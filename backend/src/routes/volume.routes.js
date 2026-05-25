const { Router } = require('express');
const volumeController = require('../controllers/volume.controller');

const router = Router();

// POST /api/volume/predict/:tpsId — Prediksi volume 3 bulan ke depan (LSTM)
router.post('/predict/:tpsId', volumeController.predictVolume);

// GET /api/volume/history/:tpsId — Data historis volume 12 bulan
router.get('/history/:tpsId', volumeController.getVolumeHistory);

// GET /api/volume/predictions/:tpsId — Riwayat hasil prediksi
router.get('/predictions/:tpsId', volumeController.getVolumePredictions);

module.exports = router;
