const predictionService = require('../services/prediction.service');
const { success, successWithMeta, error } = require('../utils/apiResponse');

// POST /api/predictions
async function createPrediction(req, res, next) {
  try {
    const prediction = await predictionService.createPrediction(req.file);
    return success(res, formatPredictionDetail(prediction), 201);
  } catch (err) {
    if (err.code === 'AI_SERVICE_ERROR') {
      return error(res, err.message, 'AI_SERVICE_ERROR', 502);
    }
    next(err);
  }
}

// GET /api/predictions
async function getPredictions(req, res, next) {
  try {
    const { page, limit } = req.pagination;
    const { predictions, total, totalPages } = await predictionService.getPredictions(page, limit);

    return successWithMeta(
      res,
      predictions.map(formatPredictionSummary),
      { page, limit, total, totalPages },
    );
  } catch (err) {
    next(err);
  }
}

// GET /api/predictions/:id
async function getPredictionById(req, res, next) {
  try {
    const prediction = await predictionService.getPredictionById(req.params.id);

    if (!prediction) {
      return error(res, 'Prediksi tidak ditemukan', 'NOT_FOUND', 404);
    }

    return success(res, formatPredictionDetail(prediction));
  } catch (err) {
    if (err.code === 'P2023' || err.name === 'PrismaClientValidationError') {
      return error(res, 'Prediksi tidak ditemukan', 'NOT_FOUND', 404);
    }
    next(err);
  }
}

function formatPredictionSummary(prediction) {
  return {
    id: prediction.id,
    result: {
      label: prediction.label,
      confidence: prediction.confidence,
      category: prediction.category,
    },
    createdAt: prediction.createdAt,
  };
}

function formatPredictionDetail(prediction) {
  return {
    id: prediction.id,
    result: {
      label: prediction.label,
      confidence: prediction.confidence,
      category: prediction.category,
      detections: [], // Fallback karena field detections dihapus dari database
    },
    createdAt: prediction.createdAt,
  };
}

module.exports = { createPrediction, getPredictions, getPredictionById };
