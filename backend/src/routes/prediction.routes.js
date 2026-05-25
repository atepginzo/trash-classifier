const { Router } = require('express');
const axios = require('axios');
const { uploadImage } = require('../middleware/upload');
const { requireFile, validatePagination } = require('../middleware/validate');
const predictionController = require('../controllers/prediction.controller');

const router = Router();

// ── [FIX: Race Condition] Cegah tumpang-tindih request per user ──────────
// Jika inferensi + network memakan > 5 detik, FE akan mengirim frame baru
// sementara yang lama belum selesai. Middleware ini men-drop frame baru agar
// tidak menumpuk di pipeline → hemat resource server.
const activeRequests = new Set();

const preventOverlap = (req, res, next) => {
  const clientId = req.ip;
  if (activeRequests.has(clientId)) {
    return res.status(429).json({
      status: 'error',
      message: 'Permintaan sebelumnya masih diproses, frame ini dilewati.',
      code: 'PREDICTION_IN_PROGRESS',
    });
  }
  activeRequests.add(clientId);
  // Bersihkan saat respons terkirim atau koneksi terputus
  res.on('finish', () => activeRequests.delete(clientId));
  res.on('close',  () => activeRequests.delete(clientId));
  next();
};
// ─────────────────────────────────────────────────────────────────────────

// POST /api/predictions — Upload image and get prediction
router.post('/', preventOverlap, uploadImage, requireFile, predictionController.createPrediction);

// GET /api/predictions — List predictions with pagination
router.get('/', validatePagination, predictionController.getPredictions);

// GET /api/predictions/:id — Get prediction detail
router.get('/:id', predictionController.getPredictionById);

// Contoh endpoint di Express
router.post('/tips', async (req, res) => {
    try {
        const { kategori } = req.body;
        
        // Teruskan ke Python
        const pythonResponse = await axios.post('http://localhost:8000/genai/tips/', {
            kategori: kategori
        });

        res.json(pythonResponse.data);
    } catch (error) {
        res.status(500).json({ status: "error", message: "Gagal mengambil tips AI" });
    }
});

module.exports = router;
