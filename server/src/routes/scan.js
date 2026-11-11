'use strict';

/**
 * FPDS — Quick Scan Route
 * POST /api/scan  → create profile + analyze in one shot
 */

const { Router } = require('express');
const router = Router();
const { scan } = require('../controllers/scanController');

router.post('/', scan);

module.exports = router;
