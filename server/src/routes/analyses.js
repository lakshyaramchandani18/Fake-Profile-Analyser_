'use strict';

/**
 * FPDS — Analysis Routes
 *
 * GET /api/analyses/:id → get one analysis by its own ID
 */

const { Router } = require('express');
const router = Router();

const analysisController = require('../controllers/analysisController');

router.get('/:id', analysisController.getOne);

module.exports = router;

