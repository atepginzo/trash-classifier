const prisma = require('../lib/prisma');
const aiService = require('./ai.service');

// ── Konstanta (identik dengan Python app.py) ────────────────────────────────
const SEASONAL_FACTOR = {
  1: 1.20, 2: 1.05, 3: 1.15, 4: 1.10, 5: 1.00, 6: 0.95,
  7: 0.88, 8: 0.88, 9: 0.92, 10: 0.98, 11: 1.05, 12: 1.25,
};

const VOL_BASE = { URBAN: 15.0, SEMI_URBAN: 6.5, RURAL: 2.0 };
const AREA_ENC = { RURAL: 0, SEMI_URBAN: 1, URBAN: 2 };

/**
 * Ambil/generate data volume 12 bulan terakhir untuk sebuah TPS.
 *
 * Jika data belum ada di DB (belum pernah di-seed), generate data sintetis
 * menggunakan rumus rule-based yang sama dengan Python app.py.
 * Data sintetis akan otomatis di-persist ke DB agar konsisten.
 */
async function getOrCreateHistory(tpsId) {
  const tps = await prisma.tps_master.findUnique({ where: { id: tpsId } });
  if (!tps) {
    const err = new Error('TPS tidak ditemukan');
    err.code = 'NOT_FOUND';
    err.statusCode = 404;
    throw err;
  }

  const areaType = tps.area_type || 'RURAL';
  const now = new Date();
  const baseYear = now.getFullYear();
  const baseMonth = now.getMonth() + 1; // 1-indexed

  // Cek apakah sudah ada 12 bulan data di DB
  const existing = await prisma.volumeHistory.findMany({
    where: { tpsId },
    orderBy: [{ tahun: 'asc' }, { bulan: 'asc' }],
  });

  let history;

  if (existing.length >= 12) {
    // Ambil 12 terakhir
    history = existing.slice(-12);
  } else {
    // Generate data sintetis 12 bulan ke belakang
    history = await generateAndSeedHistory(tpsId, areaType, baseYear, baseMonth);
  }

  return { tps, areaType, history };
}

/**
 * Generate data sintetis 12 bulan terakhir dan simpan ke DB.
 * Rumus identik dengan Python app.py `_build_window()`.
 */
async function generateAndSeedHistory(tpsId, areaType, baseYear, baseMonth) {
  const pBase = VOL_BASE[areaType] || VOL_BASE.RURAL;
  const records = [];

  for (let i = 0; i < 12; i++) {
    // Hitung bulan & tahun untuk 12 bulan ke belakang
    let m = baseMonth - 11 + i;
    let y = baseYear;
    while (m <= 0) { m += 12; y -= 1; }
    while (m > 12) { m -= 12; y += 1; }

    const growth = 1 + (y - 2019) * 0.035;
    const vol = pBase * growth * (SEASONAL_FACTOR[m] || 1.0);
    // Tambahkan sedikit noise agar tidak terlalu flat
    const noise = 1 + (Math.random() * 0.1 - 0.05);

    records.push({
      tpsId,
      tahun: y,
      bulan: m,
      volumeTon: parseFloat((vol * noise).toFixed(3)),
    });
  }

  // Upsert agar idempotent
  for (const rec of records) {
    await prisma.volumeHistory.upsert({
      where: {
        tpsId_tahun_bulan: {
          tpsId: rec.tpsId,
          tahun: rec.tahun,
          bulan: rec.bulan,
        },
      },
      update: { volumeTon: rec.volumeTon },
      create: rec,
    });
  }

  return records;
}

/**
 * Konversi record VolumeHistory (12 baris) → payload 7 fitur per timestep
 * yang dibutuhkan oleh FastAPI /predict-volume/.
 *
 * Fitur (urutan sesuai notebook):
 *   0. volume_ton
 *   1. sin_month     = sin(2π × bulan / 12)
 *   2. cos_month     = cos(2π × bulan / 12)
 *   3. area_encoded  = 0/1/2
 *   4. year_norm     = (tahun − 2019) / 4.0
 *   5. volume_ma     = simple moving average (set = volume_ton jika data terbatas)
 *   6. volume_ema    = exponential MA (set = volume_ton jika data terbatas)
 */
function buildLSTMPayload(historyRows, areaType) {
  const areaEnc = AREA_ENC[areaType] ?? 0;

  return historyRows.map((row) => {
    const vol = row.volumeTon;
    const m = row.bulan;
    const y = row.tahun;

    return {
      volume_ton: vol,
      sin_month: parseFloat(Math.sin((2 * Math.PI * m) / 12).toFixed(6)),
      cos_month: parseFloat(Math.cos((2 * Math.PI * m) / 12).toFixed(6)),
      area_encoded: areaEnc,
      year_norm: parseFloat(((y - 2019) / 4.0).toFixed(4)),
      volume_ma: vol,   // Simplified — same as volume_ton
      volume_ema: vol,  // Simplified — same as volume_ton
    };
  });
}

/**
 * Prediksi volume 3 bulan ke depan untuk sebuah TPS.
 *
 * Flow:
 *  1. Ambil/generate 12 bulan history dari DB
 *  2. Transform ke format 7-fitur per timestep
 *  3. Kirim ke FastAPI /predict-volume/
 *  4. Simpan hasil ke VolumePrediction
 *  5. Return hasil lengkap ke controller
 */
async function predictVolume(tpsId) {
  // 1. Ambil data
  const { tps, areaType, history } = await getOrCreateHistory(tpsId);

  // 2. Build payload
  const payload = buildLSTMPayload(history, areaType);

  // 3. Kirim ke AI
  const aiResult = await aiService.predictVolume(payload);

  // 4. Simpan hasil prediksi ke DB
  const saved = await prisma.volumePrediction.create({
    data: {
      tpsId,
      areaType,
      modelUsed: aiResult.model_used || 'LSTM+BahdanauAttention',
      predictions: aiResult.predictions,
    },
  });

  // 5. Return
  return {
    id: saved.id,
    tps: {
      id: tps.id,
      nama_desa: tps.nama_desa,
      kecamatan: tps.kecamatan,
      kabupaten: tps.kabupaten,
      area_type: areaType,
    },
    model_used: aiResult.model_used || 'LSTM+BahdanauAttention',
    history: history.map((h) => ({
      tahun: h.tahun,
      bulan: h.bulan,
      volume_ton: h.volumeTon,
    })),
    predictions: aiResult.predictions,
    createdAt: saved.createdAt,
  };
}

/**
 * Ambil riwayat prediksi volume untuk sebuah TPS.
 */
async function getVolumePredictions(tpsId, limit = 5) {
  return prisma.volumePrediction.findMany({
    where: { tpsId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

module.exports = { predictVolume, getVolumePredictions, getOrCreateHistory };
