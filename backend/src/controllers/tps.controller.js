const tpsService = require('../services/tps.service');
const { success, successWithMeta, error } = require('../utils/apiResponse');

// GET /api/tps?lat=...&lon=...&limit=10
// GET /api/tps?page=1&limit=50
async function getTps(req, res, next) {
  try {
    const { lat, lon, limit, page } = req.query;
    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);

    // Mode 1: Koordinat dikirim -> cari TPS terdekat
    if (!isNaN(userLat) && !isNaN(userLon)) {
      // Validasi range koordinat
      if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
        return error(res, 'Koordinat tidak valid. Lat: -90..90, Lon: -180..180', 'INVALID_COORDS', 400);
      }

      const maxResults = Math.min(parseInt(limit) || 10, 50);
      const nearest = await tpsService.findNearest(userLat, userLon, maxResults);

      return success(res, {
        mode: 'nearest',
        user_location: { lat: userLat, lon: userLon },
        count: nearest.length,
        tps: nearest,
      });
    }

    // Mode 2: Tanpa koordinat -> kembalikan semua dengan paginasi
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(parseInt(limit) || 50, 100);

    const { tps, total, totalPages } = await tpsService.findAll(pageNum, limitNum);

    return successWithMeta(res, tps, {
      mode: 'all',
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/tps/:id
async function getTpsById(req, res, next) {
  try {
    const tps = await tpsService.findById(req.params.id);

    if (!tps) {
      return error(res, 'TPS tidak ditemukan', 'NOT_FOUND', 404);
    }

    return success(res, tps);
  } catch (err) {
    next(err);
  }
}

module.exports = { getTps, getTpsById };
