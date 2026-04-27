const prisma = require('../lib/prisma');
const aiService = require('./ai.service');
const config = require('../config');

async function createPrediction(file) {
  const aiResult = await aiService.predictImage(file.buffer, file.mimetype);

  const prediction = await prisma.prediction.create({
    data: {
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      imageUrl: null,
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

async function getPredictionById(id) {
  return prisma.prediction.findUnique({
    where: { id },
  });
}

module.exports = { createPrediction, getPredictions, getPredictionById };
