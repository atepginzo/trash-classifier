const { success } = require('../utils/apiResponse');

function getHealth(_req, res) {
  return success(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
