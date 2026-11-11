'use strict';

/**
 * FPDS — Stats Controller
 * GET /api/stats
 * Returns KPI numbers for the 4 dashboard stat cards.
 */

const db = require('../lib/prisma');

async function getStats(req, res, next) {
  try {
    const profiles  = await db.profile.findMany({});
    const analyses  = await db.analysis.findMany({});

    const totalScanned      = profiles.length;
    const highRiskDetected  = analyses.filter(a => ['HIGH', 'CRITICAL'].includes(a.riskLevel)).length;
    const criticalDetected  = analyses.filter(a => a.riskLevel === 'CRITICAL').length;
    // Bot clusters: profiles with CRITICAL risk
    const botClusters       = criticalDetected;

    return res.json({
      stats: {
        totalScanned,
        highRiskDetected,
        botClusters,
        // avgDetectionConfidence is engine-fixed for MVP (no ML confidence score)
        avgDetectionConfidence: totalScanned > 0 ? 95.0 : 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
