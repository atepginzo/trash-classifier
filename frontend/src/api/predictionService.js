import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictionService = {
  // POST /api/predictions
  predict: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/predictions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // GET /api/predictions
  getHistory: async (page = 1, limit = 10) => {
    const response = await api.get('/predictions', {
      params: { page, limit },
    });
    return response.data;
  },

  // GET /api/predictions/:id
  getDetail: async (id) => {
    const response = await api.get(`/predictions/${id}`);
    return response.data;
  },

  // GET /api/health
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
