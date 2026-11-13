'use strict';

/**
 * FPDS — Quick Scan Controller
 * POST /api/scan
 *
 * One-shot endpoint for the dashboard Quick Scan form.
 * Accepts minimal input (handle + platform), creates the profile with
 * sensible defaults for missing fields, runs the risk engine, and returns
 * the full investigation shape ready for dashboard.js.
 *
 * Member 2 integration:
 *   const res  = await fetch('/api/scan', { method:'POST', headers:{'Content-Type':'application/json'},
 *                 body: JSON.stringify({ handle, platform }) });
 *   const { investigation } = await res.json();
 *   // investigation is drop-in compatible with FPDS_MOCK_DATA.investigations items
 */

const db = require('../lib/prisma');
const { scoreProfile }        = require('../services/riskEngine');
const { toInvestigationShape } = require('../utils/formatters');

const VALID_PLATFORMS = ['twitter','instagram','linkedin','facebook','tiktok'];

async function scan(req, res, next) {
  try {
    const {
      handle,
      platform,
      displayName,
      // Optional enriched fields — default to 0/null when not provided
      followers      = 0,
      following      = 0,
      postsCount     = 0,
      accountAgeDays = 0,
      bio            = null,
      profileUrl     = null,
    } = req.body;

    // ── Validation ─────────────────────────────────────────────────────────
    const errors = [];
    if (!handle || typeof handle !== 'string' || !handle.trim())
      errors.push({ field: 'handle', message: 'Required.' });
    if (!platform || !VALID_PLATFORMS.includes(platform.toLowerCase()))
      errors.push({ field: 'platform', message: 'Must be: twitter|instagram|linkedin|facebook|tiktok.' });

    const numericFields = { followers, following, postsCount, accountAgeDays };
    for (const [field, val] of Object.entries(numericFields)) {
      const n = Number(val);
      if (!Number.isInteger(n) || n < 0)
        errors.push({ field, message: 'Must be a non-negative integer.' });
    }

    if (errors.length) return res.status(422).json({ error: 'Validation failed', details: errors });

    // ── Create profile ──────────────────────────────────────────────────────
    const profile = await db.profile.create({
      data: {
        platform:       platform.toLowerCase(),
        handle:         handle.trim(),
        displayName:    displayName || handle.replace(/[@/]/g, '').trim() || 'Unknown',
        followers:      Number(followers),
        following:      Number(following),
        postsCount:     Number(postsCount),
        accountAgeDays: Number(accountAgeDays),
        bio,
        profileUrl,
      },
    });

    // ── Run risk engine ─────────────────────────────────────────────────────
    const assessment = scoreProfile(profile);

    // ── Persist analysis ────────────────────────────────────────────────────
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

    // ── Return investigation shape ──────────────────────────────────────────
    return res.status(201).json({
      investigation: toInvestigationShape(profile, analysis),
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { scan };
