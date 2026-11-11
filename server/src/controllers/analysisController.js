'use strict';

/**
 * FPDS — Analysis Controller
 * Handles:
 *   POST /api/profiles/:id/analyze     → run risk engine, persist, return result
 *   GET  /api/profiles/:id/analyses    → list all analyses for a profile
 *   GET  /api/analyses/:id             → get one analysis by ID
 */

const prisma      = require('../lib/prisma');
const { scoreProfile } = require('../services/riskEngine');

/**
 * POST /api/profiles/:id/analyze
 * Loads the profile, runs the risk engine, persists the analysis, and returns
 * a response object shaped to match what the frontend inspector panel needs.
 */
async function analyze(req, res, next) {
  try {
    const { id } = req.params;

    // 1. Load the profile
    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // 2. Run risk engine (pure function — no DB)
    const assessment = scoreProfile(profile);

    // 3. Persist the analysis (immutable snapshot)
    const analysis = await prisma.analysis.create({
      data: {
        profileId:      profile.id,
        score:          assessment.score,
        riskLevel:      assessment.riskLevel,
        threatCategory: assessment.threatCategory,
        indicators:     assessment.indicators,  // stored as JSON
        breakdown:      assessment.breakdown,   // stored as JSON
      },
    });

    // 4. Build the response — shaped for the frontend inspector panel
    const response = {
      analysis: {
        id:             analysis.id,
        profileId:      analysis.profileId,
        score:          analysis.score,
        riskLevel:      analysis.riskLevel,         // e.g. "CRITICAL"
        riskLevelCss:   analysis.riskLevel.toLowerCase(), // e.g. "critical" (for CSS class)
        threatCategory: analysis.threatCategory,
        indicators:     assessment.indicators,
        breakdown:      assessment.breakdown,
        // Convenience fields that map directly to inspector DOM elements
        // (Member 2 can read these instead of re-deriving from indicators)
        displaySignals: assessment.indicators.map(i => i.description),
        createdAt:      analysis.createdAt,
      },
    };

    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/profiles/:id/analyses
 * Returns all analyses for a profile, newest first.
 */
async function listForProfile(req, res, next) {
  try {
    const { id } = req.params;

    // Check the profile exists
    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const analyses = await prisma.analysis.findMany({
      where:   { profileId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        id:             true,
        score:          true,
        riskLevel:      true,
        threatCategory: true,
        createdAt:      true,
      },
    });

    return res.json({ analyses });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/analyses/:id
 * Returns one analysis by its own ID.
 */
async function getOne(req, res, next) {
  try {
    const analysis = await prisma.analysis.findUnique({
      where: { id: req.params.id },
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    return res.json({
      analysis: {
        ...analysis,
        riskLevelCss:   analysis.riskLevel.toLowerCase(),
        displaySignals: (analysis.indicators || []).map(i => i.description),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyze, listForProfile, getOne };

