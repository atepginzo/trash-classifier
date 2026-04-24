const { error } = require('../utils/apiResponse');
const config = require('../config');

/**
 * Global error handler.
 * Catches any unhandled errors and returns a clean JSON response.
 * In production, internal error messages are hidden from the client.
 */
function errorHandler(err, _req, res, _next) {
  console.error('Unhandled Error:', err);

  const statusCode = err.statusCode || 500;

  // Don't leak internal error messages in production
  const message = config.nodeEnv === 'production' && statusCode === 500
    ? 'Terjadi kesalahan pada server'
    : err.message || 'Terjadi kesalahan pada server';

  return error(res, message, 'INTERNAL_ERROR', statusCode);
}

module.exports = errorHandler;
