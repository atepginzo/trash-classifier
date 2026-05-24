const config = require('../config');

const CATEGORY_MAP = {
  'Plastic': 'Anorganik',
  'Glass': 'Anorganik',
  'Metal': 'Anorganik',
  'Paper': 'Organik',
  'Cardboard': 'Organik',
  'Residu (Campuran)': 'Residu',
};

function mapLabelToCategory(label) {
  return CATEGORY_MAP[label] || null;
}

const MOCK_LABELS = [
  'Plastic',
  'Glass',
  'Metal',
  'Paper',
  'Cardboard',
  'Residu (Campuran)'
];

async function mockPredict(_fileBuffer, _mimeType) {
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700));

  const label = MOCK_LABELS[Math.floor(Math.random() * MOCK_LABELS.length)];
  const confidence = parseFloat((0.75 + Math.random() * 0.2).toFixed(4));

  return {
    label,
    confidence,
    category: mapLabelToCategory(label),
    detections: [
      {
        label,
        confidence,
        bbox: { x: 50, y: 30, width: 200, height: 250 },
      },
    ],
    raw: { mock: true, label, confidence },
  };
}

async function realPredict(fileBuffer, mimeType) {
  const axios = require('axios');
  const FormData = require('form-data');

  const form = new FormData();
  const ext = mimeType.split('/')[1] || 'jpg';
  form.append('file', fileBuffer, {
    filename: `frame.${ext}`,
    contentType: mimeType,
  });

  try {
    const timeoutMs = config.aiTimeout || 30000; // default 30 detik untuk cold start
    const response = await axios.post(config.aiServiceUrl, form, {
      headers: { ...form.getHeaders() },
      timeout: timeoutMs,
      maxContentLength: 10 * 1024 * 1024,
    });

    return normalizeAiResponse(response.data);
  } catch (err) {
    console.error('AI Service Error:', err.message);
    const aiError = new Error('AI service sedang tidak tersedia');
    aiError.code = 'AI_SERVICE_ERROR';
    aiError.statusCode = 502;
    throw aiError;
  }
}

// Normalisasi response AI ke format standar backend.
// Mendukung format Python FastAPI: { status, hasil: [{ kategori, confidence }] }
// Serta format generik lama: { predictions, results }
function normalizeAiResponse(rawResponse) {
  // --- Format Python FastAPI (primer) ---
  // { "status": "success", "hasil": [{ "kategori": "Anorganik", "confidence": 0.986 }] }
  if (Array.isArray(rawResponse.hasil) && rawResponse.hasil.length > 0) {
    const top = rawResponse.hasil[0];
    const label = top.kategori || 'Unknown';
    const confidence = parseFloat(top.confidence || 0);

    return {
      label,
      confidence,
      category: label, // Python sudah mengembalikan kategori final
      detections: rawResponse.hasil.map((item) => ({
        label: item.kategori || 'Unknown',
        confidence: parseFloat(item.confidence || 0),
        bbox: null,
      })),
      raw: rawResponse,
    };
  }

  // --- Format generik lama (fallback) ---
  const predictions =
    rawResponse.predictions || rawResponse.results || [];

  const topPrediction = predictions[0] || {};
  const label = topPrediction.class || topPrediction.label || 'Unknown';
  const confidence = parseFloat(topPrediction.confidence || 0);

  return {
    label,
    confidence,
    category: mapLabelToCategory(label),
    detections: predictions.map((pred) => ({
      label: pred.class || pred.label || 'Unknown',
      confidence: parseFloat(pred.confidence || 0),
      bbox: pred.bbox
        ? {
            x: pred.bbox.x ?? pred.bbox.x1 ?? 0,
            y: pred.bbox.y ?? pred.bbox.y1 ?? 0,
            width: pred.bbox.width ?? (pred.bbox.x2 - pred.bbox.x1) ?? 0,
            height: pred.bbox.height ?? (pred.bbox.y2 - pred.bbox.y1) ?? 0,
          }
        : null,
    })),
    raw: rawResponse,
  };
}

async function predictImage(fileBuffer, mimeType) {
  if (config.useMockAi) {
    return mockPredict(fileBuffer, mimeType);
  }
  return realPredict(fileBuffer, mimeType);
}

module.exports = { predictImage };
