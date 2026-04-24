const multer = require('multer');
const config = require('../config');
const { error } = require('../utils/apiResponse');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE_TYPE'));
    }
  },
});

/**
 * Middleware: handle single image upload via field name "image".
 * Handles multer errors and returns standardized error responses.
 */
function uploadImage(req, res, next) {
  const singleUpload = upload.single('image');

  singleUpload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return error(res, `Ukuran file maksimal ${config.maxFileSize / 1024 / 1024}MB`, 'FILE_TOO_LARGE', 422);
      }
      if (err.message === 'INVALID_FILE_TYPE') {
        return error(res, 'Tipe file tidak didukung. Gunakan JPEG, PNG, atau WEBP', 'INVALID_FILE_TYPE', 422);
      }
      return error(res, 'Gagal mengupload file', 'UPLOAD_ERROR', 400);
    }
    next();
  });
}

module.exports = { uploadImage };
