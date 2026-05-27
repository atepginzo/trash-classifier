// prisma/seed.js
// Seeder untuk tabel volume_history dari dataset sampahbandung_normal_monthly.csv
// Jalankan dengan: npx prisma db seed

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

// Ukuran batch untuk bulk insert — cukup besar agar cepat, tapi tidak overload DB
const BATCH_SIZE = 500;

/**
 * Membaca file CSV dan mengembalikan Promise berisi array objek baris.
 * @param {string} filePath - Path absolut ke file CSV
 * @returns {Promise<Array<Object>>}
 */
function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];

    if (!fs.existsSync(filePath)) {
      return reject(new Error(`File CSV tidak ditemukan: ${filePath}`));
    }

    fs.createReadStream(filePath)
      .on('error', (err) => reject(new Error(`Gagal membaca file CSV: ${err.message}`)))
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(new Error(`Gagal parsing CSV: ${err.message}`)));
  });
}

/**
 * Transformasi baris CSV menjadi objek yang sesuai dengan model VolumeHistory Prisma.
 * @param {Object} row - Baris dari csv-parser
 * @param {number} index - Index baris (untuk pesan error)
 * @returns {Object}
 */
function transformRow(row, index) {
  const tpsId = row.tps_id?.trim();
  const kecamatan = row.kecamatan?.trim() || null;
  const areaType = row.area_type?.trim() || null;
  const tahun = parseInt(row.tahun, 10);
  const bulan = parseInt(row.bulan, 10);
  const volumeTon = parseFloat(row.volume_ton);

  // Validasi data wajib
  if (!tpsId) {
    throw new Error(`Baris ${index + 1}: tps_id kosong atau tidak valid`);
  }
  if (isNaN(tahun) || isNaN(bulan) || isNaN(volumeTon)) {
    throw new Error(
      `Baris ${index + 1}: Nilai numerik tidak valid — tahun=${row.tahun}, bulan=${row.bulan}, volume_ton=${row.volume_ton}`
    );
  }
  if (bulan < 1 || bulan > 12) {
    throw new Error(`Baris ${index + 1}: bulan harus 1-12, ditemukan ${bulan}`);
  }

  return { tpsId, kecamatan, areaType, tahun, bulan, volumeTon };
}

/**
 * Ekstrak data TPS unik dari baris CSV dan upsert ke tabel tps_master.
 * Diperlukan karena volume_history memiliki FK ke tps_master.
 * @param {Array<Object>} records - Array hasil transformRow
 * @returns {Promise<number>} Jumlah TPS yang di-upsert
 */
async function upsertTpsMaster(records) {
  // Kumpulkan data TPS unik berdasarkan tpsId
  const tpsMap = new Map();
  for (const r of records) {
    if (!tpsMap.has(r.tpsId)) {
      tpsMap.set(r.tpsId, {
        id: r.tpsId,
        kecamatan: r.kecamatan,
        kabupaten: 'Kota Bandung', // dataset ini khusus Bandung
        area_type: r.areaType,
      });
    }
  }

  const tpsList = Array.from(tpsMap.values());
  console.log(`   → Ditemukan ${tpsList.length} TPS unik dari CSV`);

  // Upsert satu per satu (jumlah kecil ~78, jadi tidak masalah)
  for (const tps of tpsList) {
    await prisma.tps_master.upsert({
      where: { id: tps.id },
      update: {
        kecamatan: tps.kecamatan,
        kabupaten: tps.kabupaten,
        area_type: tps.area_type,
      },
      create: {
        id: tps.id,
        kecamatan: tps.kecamatan,
        kabupaten: tps.kabupaten,
        area_type: tps.area_type,
      },
    });
  }

  return tpsList.length;
}

async function main() {
  const csvPath = path.resolve(__dirname, '..', 'data', 'sampahbandung_normal_monthly.csv');

  console.log('=== SEEDER: volume_history ===');
  console.log();

  // 1. Baca file CSV
  console.log(`Membaca CSV: ${csvPath}`);
  const rawRows = await readCsv(csvPath);
  console.log(`   ${rawRows.length} baris ditemukan`);

  if (rawRows.length === 0) {
    console.log('File CSV kosong, tidak ada data untuk di-seed.');
    return;
  }

  // 2. Transformasi & validasi
  console.log('Memvalidasi dan mentransformasi data...');
  const records = rawRows.map((row, i) => transformRow(row, i));
  console.log(`   ${records.length} record siap di-insert`);

  // 3. Upsert tps_master (FK dependency)
  console.log('Menyinkronkan tps_master dari CSV...');
  const tpsCount = await upsertTpsMaster(records);
  console.log(`   ${tpsCount} TPS berhasil di-upsert`);

  // 4. Hapus data volume_history lama
  console.log('Menghapus data volume_history yang lama...');
  const { count: deletedCount } = await prisma.volumeHistory.deleteMany();
  console.log(`   ${deletedCount} record dihapus`);

  // 5. Bulk insert per batch
  const volumeData = records.map(({ tpsId, tahun, bulan, volumeTon }) => ({
    tpsId,
    tahun,
    bulan,
    volumeTon,
  }));

  console.log(`Memulai insert ${volumeData.length} record (batch @${BATCH_SIZE})...`);
  let inserted = 0;

  for (let i = 0; i < volumeData.length; i += BATCH_SIZE) {
    const batch = volumeData.slice(i, i + BATCH_SIZE);

    await prisma.volumeHistory.createMany({
      data: batch,
      skipDuplicates: true, // amankan jika ada duplikat (tpsId, tahun, bulan)
    });

    inserted += batch.length;
    const progress = ((inserted / volumeData.length) * 100).toFixed(1);
    process.stdout.write(`\r   Progress: ${inserted}/${volumeData.length} (${progress}%)`);
  }

  console.log(); // newline setelah progress
  console.log(`   Selesai! ${inserted} record berhasil di-insert.`);
}

main()
  .then(() => {
    console.log('\nSeed volume_history selesai dengan sukses.\n');
  })
  .catch((err) => {
    console.error('\nSeed gagal:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
