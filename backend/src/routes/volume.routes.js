const express = require('express');
const router = express.Router();

// Pastikan import ini bernama predictVolume
const { predictVolume } = require('../controllers/volume.controller');

// Rute untuk menangani prediksi volume TPS
router.post('/predict/:tpsId', predictVolume);

module.exports = router;