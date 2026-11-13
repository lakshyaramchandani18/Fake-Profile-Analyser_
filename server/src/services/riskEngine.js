'use strict';

/**
 * FPDS — Rule-Based Risk Scoring Engine
 * Member 1 | server/src/services/riskEngine.js
 *
 * This module is a PURE function — it has no Express, Prisma, or I/O imports.
 * It takes a profile data object and returns a deterministic risk assessment.
 *
 * DISCLAIMER (required by context.md):
 *   Risk scores are investigation leads only. They do NOT prove an account is
 *   fake, malicious, or involved in criminal activity. Each signal has
 *   legitimate explanations. Human review is mandatory before action.
 *
 * Scoring categories:
 *   0  – 24  → LOW
 *   25 – 49  → MEDIUM
 *   50 – 74  → HIGH
 *   75 – 100 → CRITICAL
 */

// ── Risk level thresholds ─────────────────────────────────────────────────────

const RISK_LEVELS = [
  { min: 75, label: 'CRITICAL' },
  { min: 50, label: 'HIGH'     },
  { min: 25, label: 'MEDIUM'   },
  { min: 0,  label: 'LOW'      },
];

function getRiskLevel(score) {
  for (const { min, label } of RISK_LEVELS) {
    if (score >= min) return label;
  }
  return 'LOW';
}

// ── Threat category classification ────────────────────────────────────────────

function getThreatCategory(score, indicators) {
  // Use the highest-weight matched indicator codes to pick a category
  const codes = indicators.map(i => i.code);

  if (score >= 75) {
    if (codes.includes('HIGH_FOLLOW_RATIO')) return 'Coordinated Bot Farm';
    if (codes.includes('NEW_ACCOUNT'))       return 'Suspicious New Account';
    return 'Critical Threat Actor';
  }
  if (score >= 50) {
    if (codes.includes('LOW_POST_COUNT'))    return 'Dormant Potential Bot';
    return 'High-Risk Suspicious Profile';
  }
  if (score >= 25) return 'Flagged for Review';
  return 'Legitimate User (Low Risk)';
}

// ── Scoring rules ─────────────────────────────────────────────────────────────
//
// Each rule is an object with:
//   code        – short machine label for the indicator
//   description – human-readable explanation shown in the inspector
//   points      – how many risk points this rule contributes (1–30)
//   test(p)     – returns true if the rule fires for profile p
//
// Max raw sum intentionally exceeds 100 so multiple signals stack up quickly
// on truly suspicious profiles. We cap the final score at 100.

const RULES = [
  {
    code:        'NEW_ACCOUNT',
    description: 'Account is less than 30 days old',
    points:      20,
    test: (p) => p.accountAgeDays < 30,
  },
  {
    code:        'VERY_NEW_ACCOUNT',
    description: 'Account is less than 7 days old — extremely new',
    points:      10,  // stacks with NEW_ACCOUNT for a total of 30
    test: (p) => p.accountAgeDays < 7,
  },
  {
    code:        'HIGH_FOLLOW_RATIO',
    description: 'Following-to-followers ratio exceeds 10:1 (possible bot behaviour)',
    points:      25,
    test: (p) => p.followers > 0 && (p.following / p.followers) > 10,
  },
  {
    code:        'EXTREME_FOLLOW_RATIO',
    description: 'Following-to-followers ratio exceeds 30:1 (highly anomalous)',
    points:      10,  // stacks with HIGH_FOLLOW_RATIO for a total of 35
    test: (p) => p.followers > 0 && (p.following / p.followers) > 30,
  },
  {
    code:        'ZERO_FOLLOWERS',
    description: 'Account has zero followers — no organic audience detected',
    points:      15,
    test: (p) => p.followers === 0,
  },
  {
    code:        'HIGH_POST_VOLUME_SHORT_LIFE',
    description: 'Very high post volume relative to account age (possible automated posting)',
    points:      20,
    test: (p) => p.accountAgeDays > 0 && (p.postsCount / p.accountAgeDays) > 20,
  },
  {
    code:        'LOW_POST_COUNT',
    description: 'Account has very few posts — possible dormant or placeholder account',
    points:      10,
    test: (p) => p.postsCount < 5,
  },
  {
    code:        'NO_BIO',
    description: 'Profile has no bio text — common indicator of synthetic accounts',
    points:      10,
    test: (p) => !p.bio || p.bio.trim().length === 0,
  },
  {
    code:        'MASSIVE_FOLLOWING_COUNT',
    description: 'Following count exceeds 5,000 — potential bulk follow behaviour',
    points:      15,
    test: (p) => p.following > 5000,
  },
  {
    code:        'ZERO_POSTS',
    description: 'Account has never posted — possible lurk bot or fake placeholder',
    points:      15,
    test: (p) => p.postsCount === 0,
  },
];

// ── Breakdown bar computation ─────────────────────────────────────────────────
//
// The frontend inspector renders 5 specific percentage bars.
// We derive these from which indicator groups fired.
//
//  metadataAnomaly       ← NO_BIO + account metadata signals
//  behavioralBurstRate   ← HIGH_POST_VOLUME_SHORT_LIFE + ZERO_POSTS
//  networkClusterDensity ← HIGH_FOLLOW_RATIO + EXTREME_FOLLOW_RATIO + MASSIVE_FOLLOWING
//  linguisticScripting   ← approximated from overall score (no NLP in MVP)
//  avatarAuthenticity    ← always 50 in MVP (no image analysis); inversely displayed

function computeBreakdown(indicators, totalScore) {
  const codes = new Set(indicators.map(i => i.code));

  // metadata signals: NO_BIO, NEW_ACCOUNT, VERY_NEW_ACCOUNT
  let metadataPoints = 0;
  if (codes.has('NO_BIO'))          metadataPoints += 40;
  if (codes.has('NEW_ACCOUNT'))     metadataPoints += 35;
  if (codes.has('VERY_NEW_ACCOUNT')) metadataPoints += 25;
  const metadataAnomaly = Math.min(metadataPoints, 100);

  // behavioral: posting frequency signals
  let burstPoints = 0;
  if (codes.has('HIGH_POST_VOLUME_SHORT_LIFE')) burstPoints += 70;
  if (codes.has('ZERO_POSTS'))                  burstPoints += 30;
  if (codes.has('LOW_POST_COUNT'))              burstPoints += 20;
  const behavioralBurstRate = Math.min(burstPoints, 100);

  // network: follow ratio signals
  let networkPoints = 0;
  if (codes.has('HIGH_FOLLOW_RATIO'))     networkPoints += 50;
  if (codes.has('EXTREME_FOLLOW_RATIO'))  networkPoints += 30;
  if (codes.has('MASSIVE_FOLLOWING_COUNT')) networkPoints += 20;
  if (codes.has('ZERO_FOLLOWERS'))        networkPoints += 30;
  const networkClusterDensity = Math.min(networkPoints, 100);

  // linguistic: no NLP in MVP, proxy from overall score with jitter
  const linguisticScripting = Math.min(Math.round(totalScore * 0.85), 100);

  // avatar: no image analysis in MVP; 50 means "unknown / not assessed"
  const avatarAuthenticity = 50;

  return {
    metadataAnomaly,
    behavioralBurstRate,
    networkClusterDensity,
    linguisticScripting,
    avatarAuthenticity,
  };
}

// ── Main exported function ────────────────────────────────────────────────────

/**
 * scoreProfile(profile) → assessment
 *
 * @param {object} profile - profile data (from DB or request body)
 *   Required fields: accountAgeDays, followers, following, postsCount
 *   Optional fields: bio
 * @returns {object} assessment
 *   {
 *     score:          number  (0–100),
 *     riskLevel:      string  ('LOW'|'MEDIUM'|'HIGH'|'CRITICAL'),
 *     threatCategory: string,
 *     indicators:     Array<{ code, description, points }>,
 *     breakdown:      { metadataAnomaly, behavioralBurstRate, networkClusterDensity, linguisticScripting, avatarAuthenticity }
 *   }
 */
function scoreProfile(profile) {
  // Validate required numeric inputs are non-negative integers
  const fields = ['accountAgeDays', 'followers', 'following', 'postsCount'];
  for (const field of fields) {
    const val = profile[field];
    if (typeof val !== 'number' || !Number.isInteger(val) || val < 0) {
      throw new Error(`riskEngine: '${field}' must be a non-negative integer, got: ${val}`);
    }
  }

  // Run all rules
  const firedIndicators = RULES
    .filter(rule => rule.test(profile))
    .map(({ code, description, points }) => ({ code, description, points }));

  // Sum points, cap at 100
  const rawScore = firedIndicators.reduce((sum, ind) => sum + ind.points, 0);
  const score    = Math.min(rawScore, 100);

  const riskLevel      = getRiskLevel(score);
  const threatCategory = getThreatCategory(score, firedIndicators);
  const breakdown      = computeBreakdown(firedIndicators, score);

  return {
    score,
    riskLevel,
    threatCategory,
    indicators: firedIndicators,
    breakdown,
  };
}

module.exports = { scoreProfile };

