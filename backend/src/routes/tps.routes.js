const { Router } = require('express');
const tpsController = require('../controllers/tps.controller');

const router = Router();

// GET /api/tps         — Semua TPS (paginasi) atau TPS terdekat (jika ?lat&lon)
// GET /api/tps/:id     — Detail satu TPS
router.get('/', tpsController.getTps);
router.get('/:id', tpsController.getTpsById);

module.exports = router;
