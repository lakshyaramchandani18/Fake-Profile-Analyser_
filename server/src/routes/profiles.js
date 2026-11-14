'use strict';

/**
 * FPDS — Profile Routes
 *
 * POST   /api/profiles          → create a profile
 * GET    /api/profiles          → list all profiles
 * GET    /api/profiles/:id      → get one profile
 * POST   /api/profiles/:id/analyze   → run risk engine, store & return analysis
 * GET    /api/profiles/:id/analyses  → list all analyses for a profile
 */

const { Router } = require('express');
const router = Router();

const profileController  = require('../controllers/profileController');
const analysisController = require('../controllers/analysisController');
const { validateProfile } = require('../middleware/validate');

// Profile CRUD
router.post('/',             validateProfile, profileController.create);
router.get('/',                               profileController.list);
router.get('/dashboard',                      profileController.dashboard); // frontend shape
router.get('/:id',                            profileController.getOne);
router.get('/:id/report',                     profileController.getReport); // Crime Branch dossier report

// Analysis sub-resource
router.post('/:id/analyze',  analysisController.analyze);
router.get('/:id/analyses',  analysisController.listForProfile);

module.exports = router;

