const config = require('../config');

// ─── Label → Category mapping ─────────────────────────────────
const CATEGORY_MAP = {
  'Botol Plastik': 'Anorganik',
  'Plastik': 'Anorganik',
  'Kertas': 'Organik',
  'Kardus': 'Organik',
  'Kaleng': 'Anorganik',
  'Kaca': 'Anorganik',
  'Logam': 'Anorganik',
  'Sisa Makanan': 'Organik',
  'Daun': 'Organik',
  'Baterai': 'B3',
  'Elektronik': 'B3',
};

function mapLabelToCategory(label) {
  return CATEGORY_MAP[label] || null;
}

// ─── Mock AI labels ────────────────────────────────────────────
const MOCK_LABELS = [
  'Botol Plastik',
  'Kertas',
  'Kaleng',
  'Sisa Makanan',
  'Kardus',
  'Kaca',
  'Baterai',
];

// ─── Mock AI implementation ────────────────────────────────────
async function mockPredict(_fileBuffer, _mimeType) {
  // Simulate network latency
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

// ─── Real AI implementation (to be completed when AI service is ready) ──
async function realPredict(fileBuffer, mimeType) {
  // TODO: Implement actual AI service call
  // This is the function that will be updated when the AI team provides their API spec
  //
  // Example implementation:
  // const FormData = require('form-data');
  // const form = new FormData();
  // form.append('image', fileBuffer, { contentType: mimeType, filename: 'image.jpg' });
  //
  // const response = await fetch(config.aiServiceUrl, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${config.aiApiKey}`,
  //     ...form.getHeaders(),
  //   },
  //   body: form,
  // });
  //
  // const rawResponse = await response.json();
  // return normalizeAiResponse(rawResponse);

  throw new Error('Real AI service not yet configured. Set USE_MOCK_AI=true or configure AI_SERVICE_URL.');
}

/**
 * Normalize raw AI response to our standard format.
 * This is the key abstraction that keeps the rest of the app stable
 * even when the AI response format changes.
 *
 * @param {Object} rawResponse - Raw response from AI service
 * @returns {Object} Normalized prediction result
 */
function normalizeAiResponse(rawResponse) {
  // ASSUMPTION: AI response has a `predictions` array
  // Adjust this function when actual AI response format is known
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

// ─── Public API ────────────────────────────────────────────────

/**
 * Main prediction function.
 * Routes to mock or real AI based on config.
 * Returns a STABLE response shape regardless of AI backend.
 *
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<{label, confidence, category, detections, raw}>}
 */
async function predictImage(fileBuffer, mimeType) {
  if (config.useMockAi) {
    return mockPredict(fileBuffer, mimeType);
  }
  return realPredict(fileBuffer, mimeType);
}

module.exports = { predictImage };
