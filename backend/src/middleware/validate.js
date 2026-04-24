const { error } = require('../utils/apiResponse');

/**
 * Validate that a file was provided in the request.
 */
function requireFile(req, res, next) {
  if (!req.file) {
    return error(res, 'File gambar wajib dikirim', 'VALIDATION_ERROR', 400);
  }
  next();
}

/**
 * Validate pagination query params.
 */
function validatePagination(req, _res, next) {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  req.pagination = {
    page: page > 0 ? page : 1,
    limit: limit > 0 && limit <= 50 ? limit : 10,
  };

  next();
}

module.exports = { requireFile, validatePagination };
