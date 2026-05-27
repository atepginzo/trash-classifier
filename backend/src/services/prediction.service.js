const prisma = require('../lib/prisma');
const aiService = require('./ai.service');
const config = require('../config');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_KEY || 'placeholder'
);

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

  // Upload gambar ke Supabase Storage
  let imageUrl = null;
  if (file.buffer && file.buffer.length > 0) {
    const ext = (file.mimetype || 'image/jpeg').split('/')[1] || 'jpg';
    const filename = `${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabase
      .storage
      .from('trash-images')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error('Gagal mengupload gambar ke Supabase');
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('trash-images')
      .getPublicUrl(filename);
      
    imageUrl = publicUrlData.publicUrl;
  }

  const prediction = await prisma.prediction.create({
    data: {
      label,
      confidence: parseFloat(confidence),
      category,
      imageUrl,
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
        imageUrl: true,
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

