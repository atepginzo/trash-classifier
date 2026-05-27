const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const path = require('path');

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json());
const uploadsPath = process.env.VERCEL 
  ? '/tmp/uploads' 
  : path.join(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsPath));

app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint tidak ditemukan',
    code: 'NOT_FOUND',
  });
});

app.use(errorHandler);

module.exports = app;
