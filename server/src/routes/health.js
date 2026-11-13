'use strict';

/**
 * FPDS — Health Check Route
 * GET /health → { status, timestamp, version }
 * Used by: ops monitoring, Milestone 1 smoke test.
 */

const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    version:   '1.0.0',
    service:   'FPDS Backend',
  });
});

module.exports = router;

