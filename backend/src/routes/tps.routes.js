const express = require('express');
const router = express.Router();

// Pastikan namanya getNearestTps sesuai dengan yang ada di controller
const { getNearestTps } = require('../controllers/tps.controller');

// Rute untuk mengambil semua data TPS
router.get('/', getNearestTps);

module.exports = router;