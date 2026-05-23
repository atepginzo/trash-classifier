const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const aiService = require('./ai.service');
const config = require('../config');

async function createPrediction(file) {
  // Ensure uploads folder exists
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Generate a unique file name
  const ext = file.originalname.split('.').pop() || 'jpg';
  const filename = `${crypto.randomUUID()}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  // Write buffer to file
  fs.writeFileSync(filePath, file.buffer);

  // Predict using AI service
  const aiResult = await aiService.predictImage(file.buffer, file.mimetype);

  // Construct image URL
  const imageUrl = `http://localhost:${config.port}/uploads/${filename}`;

  const prediction = await prisma.prediction.create({
    data: {
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      imageUrl: imageUrl,
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
