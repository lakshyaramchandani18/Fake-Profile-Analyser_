'use strict';

/**
 * FPDS — Entry Point
 * Loads env, imports the Express app, and starts listening.
 */

require('dotenv').config();

const app  = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[FPDS] Backend running on http://localhost:${PORT}`);
  console.log(`[FPDS] Health check: http://localhost:${PORT}/health`);
  console.log(`[FPDS] ENV: ${process.env.NODE_ENV || 'development'}`);
});

