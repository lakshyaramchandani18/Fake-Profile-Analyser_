'use strict';

/**
 * FPDS — Entry Point
 * Loads env, imports the Express app, and starts listening.
 */

require('dotenv').config();

const app  = require('./app');
const db   = require('./lib/prisma');
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`[FPDS] Backend running on http://localhost:${PORT}`);
  console.log(`[FPDS] Health check: http://localhost:${PORT}/health`);
  console.log(`[FPDS] ENV: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown handling
async function gracefulShutdown(signal) {
  console.log(`\n[FPDS] Received ${signal}. Closing server and database connection...`);
  server.close(async () => {
    try {
      if (db && typeof db.$disconnect === 'function') {
        await db.$disconnect();
        console.log('[FPDS] Database connection closed successfully.');
      }
    } catch (err) {
      console.error('[FPDS] Error closing database connection:', err.message);
    }
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = server;

