const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(`\nServer running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`AI Mode: ${config.useMockAi ? 'MOCK' : 'REAL'}`);
  console.log(`Health: http://localhost:${config.port}/api/health\n`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down...');
  server.close(() => process.exit(0));
});
