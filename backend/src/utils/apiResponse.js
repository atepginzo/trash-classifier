/**
 * Standardized API response helpers.
 * Every response from this API follows the same shape.
 */

function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    status: 'success',
    data,
  });
}

function successWithMeta(res, data, meta, statusCode = 200) {
  return res.status(statusCode).json({
    status: 'success',
    data,
    meta,
  });
}

function error(res, message, code = 'INTERNAL_ERROR', statusCode = 500) {
  return res.status(statusCode).json({
    status: 'error',
    message,
    code,
  });
}

module.exports = { success, successWithMeta, error };
