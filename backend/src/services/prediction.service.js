const prisma = require('../lib/prisma');
const aiService = require('./ai.service');
const config = require('../config');

async function createPrediction(file) {
  const aiResult = await aiService.predictImage(file.buffer, file.mimetype);

  let label      = aiResult.label;
  let confidence = aiResult.confidence;
  let category   = aiResult.category;

  if (!label || label === 'Unknown') {
    const hasilArray =
      (aiResult.data && Array.isArray(aiResult.data.hasil) ? aiResult.data.hasil : null) ||
      (Array.isArray(aiResult.hasil) ? aiResult.hasil : null);

    if (!hasilArray || hasilArray.length === 0) {
      const err = new Error('Format respons AI tidak valid: array "hasil" tidak ditemukan.');
      err.code = 'AI_INVALID_RESPONSE';
      err.statusCode = 502;
      throw err;
    }

    const top = hasilArray[0];
    label      = top.kategori  || 'Unknown';
    confidence = top.confidence || 0;
    category   = top.kategori  || 'Unknown';
  }

  const prediction = await prisma.prediction.create({
    data: {
      label,
      confidence: parseFloat(confidence),
      category,
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
