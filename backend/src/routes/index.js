const { Router } = require('express');
const healthRoutes = require('./health.routes');
const predictionRoutes = require('./prediction.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/predictions', predictionRoutes);

module.exports = router;
