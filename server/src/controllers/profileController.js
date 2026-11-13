'use strict';

/**
 * FPDS — Profile Controller
 * Handles: POST /api/profiles, GET /api/profiles, GET /api/profiles/:id
 *          GET /api/profiles/dashboard  (formatted for frontend)
 */

const db = require('../lib/prisma');
const { toInvestigationShape } = require('../utils/formatters');

/**
 * POST /api/profiles
 * Creates and persists a new profile.
 */
async function create(req, res, next) {
  try {
    const {
      platform, handle, displayName,
      followers, following, postsCount, accountAgeDays,
      bio = null, profileUrl = null,
    } = req.body;

    const profile = await db.profile.create({
      data: { platform, handle, displayName, followers, following, postsCount, accountAgeDays, bio, profileUrl },
    });

    return res.status(201).json({ profile });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/profiles
 * Returns all profiles with their most recent analysis summary (if any).
 */
async function list(req, res, next) {
  try {
    const profiles = await db.profile.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, score: true, riskLevel: true, threatCategory: true, createdAt: true },
        },
      },
    });

    const shaped = profiles.map(p => ({
      ...p,
      latestAnalysis: p.analyses[0] || null,
      analyses: undefined,
    }));

    return res.json({ profiles: shaped });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/profiles/dashboard
 * Returns profiles shaped exactly like FPDS_MOCK_DATA.investigations.
 * Member 2 calls this to replace the mock data array.
 */
async function dashboard(req, res, next) {
  try {
    const profiles = await db.profile.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const investigations = profiles.map(p =>
      toInvestigationShape(p, p.analyses[0] || null)
    );

    return res.json({ investigations });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/profiles/:id
 * Returns one profile by ID.
 */
async function getOne(req, res, next) {
  try {
    const profile = await db.profile.findUnique({ where: { id: req.params.id } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    return res.json({ profile });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, dashboard, getOne };
