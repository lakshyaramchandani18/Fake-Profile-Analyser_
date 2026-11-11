'use strict';

/**
 * FPDS — Stats Route
 * GET /api/stats → KPI numbers for the 4 dashboard cards
 */

const { Router } = require('express');
const router = Router();
const { getStats } = require('../controllers/statsController');

router.get('/', getStats);

module.exports = router;

