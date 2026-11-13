'use strict';

/**
 * FPDS — Health Check Route
 * GET /health → { status, timestamp, version, database: { provider, status, latencyMs } }
 * Used by: ops monitoring, Milestone 1 smoke test, SOC health heartbeat.
 */

const { Router } = require('express');
const db = require('../lib/prisma');
const router = Router();

router.get('/', async (req, res) => {
  const isPrisma = typeof db.$queryRaw === 'function';
  let dbStatus = 'ok';
  let latencyMs = null;

  if (isPrisma) {
    try {
      const start = Date.now();
      await db.$queryRaw`SELECT 1`;
      latencyMs = Date.now() - start;
      dbStatus = 'connected';
    } catch (err) {
      dbStatus = `disconnected (${err.message})`;
    }
  } else {
    dbStatus = 'in-memory-fallback';
  }

  res.json({
    status:    dbStatus.startsWith('disconnected') ? 'degraded' : 'ok',
    timestamp: new Date().toISOString(),
    version:   '1.0.0',
    service:   'FPDS Backend',
    database: {
      provider: isPrisma ? 'postgresql' : 'in-memory',
      status:   dbStatus,
      ...(latencyMs !== null ? { latencyMs } : {}),
    },
  });
});

module.exports = router;

