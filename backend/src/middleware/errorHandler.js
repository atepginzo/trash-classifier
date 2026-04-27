const { error } = require('../utils/apiResponse');
const config = require('../config');

function errorHandler(err, _req, res, _next) {
  console.error('Unhandled Error:', err);

  const statusCode = err.statusCode || 500;

  const message = config.nodeEnv === 'production' && statusCode === 500
    ? 'Terjadi kesalahan pada server'
    : err.message || 'Terjadi kesalahan pada server';

  return error(res, message, 'INTERNAL_ERROR', statusCode);
}

module.exports = errorHandler;
