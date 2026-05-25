import api from '../lib/api';

export const tpsService = {
  /**
   * Ambil daftar TPS. Jika lat/lon diberikan, return TPS terdekat.
   * GET /api/tps?lat=...&lon=...&limit=...
   * GET /api/tps?page=...&limit=...
   */
  getAll(params = {}) {
    return api.get('/tps', { params });
  },

  /**
   * Ambil detail TPS by ID.
   * GET /api/tps/:id
   */
  getById(id) {
    return api.get(`/tps/${id}`);
  },

  /**
   * Cari TPS terdekat dari posisi user.
   * GET /api/tps?lat=...&lon=...&limit=10
   */
  findNearest(lat, lon, limit = 10) {
    return api.get('/tps', { params: { lat, lon, limit } });
  },
};
