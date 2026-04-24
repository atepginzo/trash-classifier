const { Router } = require('express');
const { uploadImage } = require('../middleware/upload');
const { requireFile, validatePagination } = require('../middleware/validate');
const predictionController = require('../controllers/prediction.controller');

const router = Router();

// POST /api/predictions — Upload image and get prediction
router.post('/', uploadImage, requireFile, predictionController.createPrediction);

// GET /api/predictions — List predictions with pagination
router.get('/', validatePagination, predictionController.getPredictions);

// GET /api/predictions/:id — Get prediction detail
router.get('/:id', predictionController.getPredictionById);

module.exports = router;
