'use strict';

/**
 * FPDS — Response Formatters
 * Maps internal DB/engine data to the shapes dashboard.js expects.
 * Member 2 can consume these directly — no extra transformation needed.
 */

// ── Platform display names ────────────────────────────────────────────────────

const PLATFORM_NAMES = {
  twitter:   'Twitter / X',
  instagram: 'Instagram',
  linkedin:  'LinkedIn',
  facebook:  'Facebook',
  tiktok:    'TikTok',
};

function toPlatformName(slug) {
  return PLATFORM_NAMES[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

// ── Avatar initials ───────────────────────────────────────────────────────────

function toAvatarInitials(displayName) {
  if (!displayName) return '??';
  const words = displayName.replace(/[^a-zA-Z ]/g, '').trim().split(/s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// ── Account age string ────────────────────────────────────────────────────────

function toAccountAgeStr(days) {
  if (days < 1)   return 'Today';
  if (days < 30)  return days + ' day' + (days === 1 ? '' : 's');
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months + ' month' + (months === 1 ? '' : 's');
  }
  const years = Math.floor(days / 365);
  return years + ' year' + (years === 1 ? '' : 's');
}

// ── Relative timestamp ────────────────────────────────────────────────────────

function toRelativeTime(date) {
  const diffMs  = Date.now() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1)   return 'Just now';
  if (diffMin < 60)  return diffMin + ' min' + (diffMin === 1 ? '' : 's') + ' ago';
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24)   return diffHr + ' hour' + (diffHr === 1 ? '' : 's') + ' ago';
  const diffDay = Math.floor(diffHr / 24);
  return diffDay + ' day' + (diffDay === 1 ? '' : 's') + ' ago';
}

// ── Investigation status label ────────────────────────────────────────────────

const STATUS_MAP = {
  CRITICAL: 'Confirmed Fake',
  HIGH:     'Flagged Suspicious',
  MEDIUM:   'Under Review',
  LOW:      'Cleared',
};

function toStatus(riskLevel) {
  return STATUS_MAP[riskLevel] || 'Under Review';
}

// ── Case ID formatter ─────────────────────────────────────────────────────────
// Produces INV-2026-XXXX style IDs the frontend renders in the Case ID column.

function toCaseId(uuid) {
  const year = new Date().getFullYear();
  const short = uuid.replace(/-/g, '').slice(0, 4).toUpperCase();
  return 'INV-' + year + '-' + short;
}

// ── Main shape mapper ─────────────────────────────────────────────────────────

/**
 * toInvestigationShape(profile, analysis?)
 *
 * Maps a profile record + optional latest analysis into the object shape
 * that dashboard.js renderInvestigationsTable() and selectInvestigation() read.
 *
 * If no analysis is provided, risk fields are null/zero (profile not yet analyzed).
 */
function toInvestigationShape(profile, analysis = null) {
  const riskLevel     = analysis ? analysis.riskLevel     : null;
  const riskLevelCss  = riskLevel ? riskLevel.toLowerCase() : 'low';
  const score         = analysis ? analysis.score          : 0;
  const breakdown     = analysis ? analysis.breakdown      : {
    metadataAnomaly: 0, behavioralBurstRate: 0,
    networkClusterDensity: 0, linguisticScripting: 0, avatarAuthenticity: 50,
  };
  const signals       = analysis ? (analysis.indicators || []).map(i => i.description) : [];

  return {
    // IDs
    id:             toCaseId(profile.id),
    profileId:      profile.id,
    analysisId:     analysis ? analysis.id : null,

    // Platform
    platform:       profile.platform,
    platformName:   toPlatformName(profile.platform),

    // Identity
    handle:         profile.handle,
    displayName:    profile.displayName,
    avatarInitials: toAvatarInitials(profile.displayName),

    // Risk
    riskScore:      score,
    riskLevel:      riskLevelCss,            // lowercase — matches CSS class names
    threatCategory: analysis ? analysis.threatCategory : 'Not Analyzed',

    // Account stats
    accountAge:     toAccountAgeStr(profile.accountAgeDays),
    followers:      profile.followers,
    following:      profile.following,
    postsCount:     profile.postsCount,

    // Status & metadata
    status:         analysis ? toStatus(riskLevel) : 'Pending Analysis',
    timestamp:      toRelativeTime(analysis ? analysis.createdAt : profile.createdAt),
    investigator:   'FPDS Engine',

    // Inspector panel data
    signals,
    breakdown,

    // Raw timestamps (for sorting/filtering)
    createdAt:      profile.createdAt,
    analyzedAt:     analysis ? analysis.createdAt : null,
  };
}

module.exports = {
  toPlatformName,
  toAvatarInitials,
  toAccountAgeStr,
  toRelativeTime,
  toStatus,
  toCaseId,
  toInvestigationShape,
};
