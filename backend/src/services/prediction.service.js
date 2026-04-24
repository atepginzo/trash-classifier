const prisma = require('../lib/prisma');
const aiService = require('./ai.service');
const config = require('../config');

/**
 * Create a new prediction.
 * Sends image to AI, normalizes result, saves to database.
 *
 * @param {Object} file - Multer file object (buffer, mimetype, originalname, size)
 * @returns {Promise<Object>} Created prediction record
 */
async function createPrediction(file) {
  // 1. Send to AI service
  const aiResult = await aiService.predictImage(file.buffer, file.mimetype);

  // 2. Save to database
  const prediction = await prisma.prediction.create({
    data: {
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      imageUrl: null, // Enhancement: cloud storage URL
      label: aiResult.label,
      confidence: aiResult.confidence,
      category: aiResult.category,
      detections: aiResult.detections || [],
      rawAiResponse: aiResult.raw || null,
      aiProvider: config.useMockAi ? 'mock' : 'ai-service',
    },
  });

  return prediction;
}

/**
 * Get paginated list of predictions.
 * Returns simplified data (no detections) for list view performance.
 *
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<{predictions, total, totalPages}>}
 */
async function getPredictions(page, limit) {
  const skip = (page - 1) * limit;

  const [predictions, total] = await Promise.all([
    prisma.prediction.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        originalFilename: true,
        label: true,
        confidence: true,
        category: true,
        createdAt: true,
      },
    }),
    prisma.prediction.count(),
  ]);

  return {
    predictions,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single prediction by ID with full details.
 *
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
async function getPredictionById(id) {
  return prisma.prediction.findUnique({
    where: { id },
  });
}

module.exports = { createPrediction, getPredictions, getPredictionById };
