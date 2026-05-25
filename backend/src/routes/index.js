const { Router } = require('express');
const healthRoutes = require('./health.routes');
const predictionRoutes = require('./prediction.routes');
const tpsRoutes = require('./tps.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/predictions', predictionRoutes);
router.use('/tps', tpsRoutes);

module.exports = router;
