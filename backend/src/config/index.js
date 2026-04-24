require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  useMockAi: process.env.USE_MOCK_AI === 'true',
  aiServiceUrl: process.env.AI_SERVICE_URL || '',
  aiApiKey: process.env.AI_API_KEY || '',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB
};

module.exports = config;
