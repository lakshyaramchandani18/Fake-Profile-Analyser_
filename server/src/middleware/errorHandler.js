'use strict';

/**
 * FPDS — Global Error Handler
 * Must have exactly 4 parameters to be recognized as an Express error middleware.
 */

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status  = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Don't leak stack traces in production
  const payload = {
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  };

  console.error(`[FPDS ERROR] ${req.method} ${req.originalUrl} → ${status}: ${message}`);

  res.status(status).json(payload);
}

module.exports = errorHandler;

