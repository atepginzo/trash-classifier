import api from '../lib/api';

export const predictionService = {
  uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/predictions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getPrediction(id) {
    return api.get(`/predictions/${id}`);
  },

  getPredictions({ page = 1, limit = 10 } = {}) {
    return api.get('/predictions', { params: { page, limit } });
  },
};
