'use strict';

/**
 * FPDS — Analysis Controller
 * Handles:
 *   POST /api/profiles/:id/analyze     → run risk engine, persist, return result
 *   GET  /api/profiles/:id/analyses    → list all analyses for a profile
 *   GET  /api/analyses/:id             → get one analysis by ID
 */

const db = require('../lib/prisma');
const { scoreProfile } = require('../services/riskEngine');
const { toInvestigationShape } = require('../utils/formatters');

/**
 * POST /api/profiles/:id/analyze
 * Runs the risk engine, persists the result, and returns both the raw analysis
 * and the investigation shape the frontend inspector/table expects directly.
 */
async function analyze(req, res, next) {
  try {
    const { id } = req.params;

    // 1. Load profile
    const profile = await db.profile.findUnique({ where: { id } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    // 2. Score (pure function)
    const assessment = scoreProfile(profile);

    // 3. Persist
    const analysis = await db.analysis.create({
      data: {
        profileId:      profile.id,
        score:          assessment.score,
        riskLevel:      assessment.riskLevel,
        threatCategory: assessment.threatCategory,
        indicators:     assessment.indicators,
        breakdown:      assessment.breakdown,
      },
    });

    // 4. Build response — raw analysis + frontend-ready investigation shape
    return res.status(201).json({
      analysis: {
        id:             analysis.id,
        profileId:      analysis.profileId,
        score:          analysis.score,
        riskLevel:      analysis.riskLevel,
        riskLevelCss:   analysis.riskLevel.toLowerCase(),
        threatCategory: analysis.threatCategory,
        indicators:     assessment.indicators,
        breakdown:      assessment.breakdown,
        displaySignals: assessment.indicators.map(i => i.description),
        createdAt:      analysis.createdAt,
      },
      // Ready-to-use investigation object for dashboard.js renderInvestigationsTable()
      investigation: toInvestigationShape(profile, analysis),
    });
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

    const profile = await db.profile.findUnique({ where: { id } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const analyses = await db.analysis.findMany({
      where:   { profileId: id },
      orderBy: { createdAt: 'desc' },
      select:  { id: true, score: true, riskLevel: true, threatCategory: true, createdAt: true },
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
    const analysis = await db.analysis.findUnique({ where: { id: req.params.id } });
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });

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
