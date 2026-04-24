const predictionService = require('../services/prediction.service');
const { success, successWithMeta, error } = require('../utils/apiResponse');

/**
 * POST /api/predictions
 * Upload image and get AI prediction.
 */
async function createPrediction(req, res, next) {
  try {
    const prediction = await predictionService.createPrediction(req.file);

    return success(res, formatPredictionDetail(prediction), 201);
  } catch (err) {
    // Handle AI service errors specifically
    if (err.message?.includes('AI') || err.message?.includes('service')) {
      return error(res, 'AI service sedang tidak tersedia', 'AI_SERVICE_ERROR', 502);
    }
    next(err);
  }
}

/**
 * GET /api/predictions
 * List prediction history with pagination.
 */
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

/**
 * GET /api/predictions/:id
 * Get single prediction detail.
 */
async function getPredictionById(req, res, next) {
  try {
    const prediction = await predictionService.getPredictionById(req.params.id);

    if (!prediction) {
      return error(res, 'Prediksi tidak ditemukan', 'NOT_FOUND', 404);
    }

    return success(res, formatPredictionDetail(prediction));
  } catch (err) {
    // Prisma throws on invalid ID format — treat as not found
    if (err.code === 'P2023' || err.name === 'PrismaClientValidationError') {
      return error(res, 'Prediksi tidak ditemukan', 'NOT_FOUND', 404);
    }
    next(err);
  }
}

// ─── Response formatters ──────────────────────────────────────

function formatPredictionSummary(prediction) {
  return {
    id: prediction.id,
    originalFilename: prediction.originalFilename,
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
    originalFilename: prediction.originalFilename,
    mimeType: prediction.mimeType,
    fileSize: prediction.fileSize,
    imageUrl: prediction.imageUrl,
    result: {
      label: prediction.label,
      confidence: prediction.confidence,
      category: prediction.category,
      detections: prediction.detections || [],
    },
    rawAiResponse: prediction.rawAiResponse,
    aiProvider: prediction.aiProvider,
    createdAt: prediction.createdAt,
  };
}

module.exports = { createPrediction, getPredictions, getPredictionById };
