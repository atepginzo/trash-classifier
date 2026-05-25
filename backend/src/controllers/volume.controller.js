const volumeService = require('../services/volume.service');
const { success, error } = require('../utils/apiResponse');

/**
 * POST /api/volume/predict/:tpsId
 *
 * Prediksi volume sampah 3 bulan ke depan untuk sebuah TPS.
 * Flow: ambil 12 bulan history → kirim ke FastAPI LSTM → return hasil.
 */
async function predictVolume(req, res, next) {
  try {
    const { tpsId } = req.params;

    if (!tpsId) {
      return error(res, 'Parameter tpsId wajib diisi', 'VALIDATION_ERROR', 400);
    }

    const result = await volumeService.predictVolume(tpsId);
    return success(res, result);
  } catch (err) {
    if (err.code === 'NOT_FOUND') {
      return error(res, err.message, 'NOT_FOUND', 404);
    }
    if (err.code === 'AI_SERVICE_ERROR') {
      return error(res, err.message, 'AI_SERVICE_ERROR', 502);
    }
    next(err);
  }
}

/**
 * GET /api/volume/history/:tpsId
 *
 * Ambil data historis volume pembuangan 12 bulan terakhir untuk sebuah TPS.
 * Jika data belum ada, generate data sintetis otomatis.
 */
async function getVolumeHistory(req, res, next) {
  try {
    const { tpsId } = req.params;

    if (!tpsId) {
      return error(res, 'Parameter tpsId wajib diisi', 'VALIDATION_ERROR', 400);
    }

    const { tps, areaType, history } = await volumeService.getOrCreateHistory(tpsId);

    return success(res, {
      tps: {
        id: tps.id,
        nama_desa: tps.nama_desa,
        kecamatan: tps.kecamatan,
        area_type: areaType,
      },
      history: history.map((h) => ({
        tahun: h.tahun,
        bulan: h.bulan,
        volume_ton: h.volumeTon,
      })),
    });
  } catch (err) {
    if (err.code === 'NOT_FOUND') {
      return error(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
}

/**
 * GET /api/volume/predictions/:tpsId
 *
 * Ambil riwayat hasil prediksi volume untuk sebuah TPS.
 */
async function getVolumePredictions(req, res, next) {
  try {
    const { tpsId } = req.params;
    const results = await volumeService.getVolumePredictions(tpsId);

    return success(res, results.map((r) => ({
      id: r.id,
      tpsId: r.tpsId,
      area_type: r.areaType,
      model_used: r.modelUsed,
      predictions: r.predictions,
      createdAt: r.createdAt,
    })));
  } catch (err) {
    next(err);
  }
}

module.exports = { predictVolume, getVolumeHistory, getVolumePredictions };
