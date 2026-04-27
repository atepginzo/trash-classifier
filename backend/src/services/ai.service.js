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

// TODO: implementasi ketika AI service sudah ready
async function realPredict(fileBuffer, mimeType) {
  throw new Error('Real AI service not yet configured. Set USE_MOCK_AI=true or configure AI_SERVICE_URL.');
}

// Normalisasi response AI ke format standar backend.
// Sesuaikan fungsi ini ketika format response dari tim AI sudah final.
function normalizeAiResponse(rawResponse) {
  const predictions = rawResponse.predictions || rawResponse.results || [];

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
