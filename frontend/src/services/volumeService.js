import api from '../lib/api';

export const volumeService = {
  /**
   * Prediksi volume 3 bulan ke depan untuk sebuah TPS.
   * POST /api/volume/predict/:tpsId
   */
  predictVolume(tpsId) {
    return api.post(`/volume/predict/${tpsId}`);
  },

  /**
   * Ambil data historis volume 12 bulan terakhir.
   * GET /api/volume/history/:tpsId
   */
  getHistory(tpsId) {
    return api.get(`/volume/history/${tpsId}`);
  },

  /**
   * Ambil riwayat prediksi volume.
   * GET /api/volume/predictions/:tpsId
   */
  getPredictions(tpsId) {
    return api.get(`/volume/predictions/${tpsId}`);
  },
};
