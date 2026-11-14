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
  const words = displayName.replace(/[^a-zA-Z ]/g, '').trim().split(/\s+/);
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

/**
 * toCrimeBranchReport(profile, analysis)
 *
 * Formats an investigation case into a formal forensic dossier
 * aligned with Cybercrime and Law Enforcement investigative requirements.
 */
function toCrimeBranchReport(profile, analysis) {
  const caseId = toCaseId(profile.id);
  const riskLevel = analysis ? analysis.riskLevel : 'UNKNOWN';
  const score = analysis ? analysis.score : 0;
  const indicators = analysis && analysis.indicators ? analysis.indicators : [];
  const breakdown = analysis ? analysis.breakdown : {};

  let recommendation = 'No action required. Account exhibits authentic behavioral markers.';
  let priority = 'P4 - Low Priority';
  if (riskLevel === 'CRITICAL') {
    recommendation = 'Immediate Intermediary Preservation Notice (Sec 91 CrPC) & Expedited Takedown Request under Information Technology Act Rules.';
    priority = 'P1 - Urgent Action Required';
  } else if (riskLevel === 'HIGH') {
    recommendation = 'Flag for Active Threat Monitoring and request platform metadata verification.';
    priority = 'P2 - High Priority Review';
  } else if (riskLevel === 'MEDIUM') {
    recommendation = 'Monitor account for activity bursts and anomalous follower velocity.';
    priority = 'P3 - Routine Surveillance';
  }

  const followRatio = profile.followers > 0 
    ? (profile.following / profile.followers).toFixed(1) + ':1'
    : profile.following + ':0';

  return {
    dossierReference: 'DOSSIER-' + caseId,
    caseId,
    issuingUnit: 'Cyber Crime Investigation Cell & Digital Forensics Command',
    classification: 'CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE',
    generatedAt: new Date().toISOString(),
    subjectEntity: {
      platform: toPlatformName(profile.platform),
      handle: profile.handle,
      displayName: profile.displayName,
      profileUrl: profile.profileUrl || `https://${profile.platform}.com/${profile.handle.replace('@', '')}`,
      metrics: {
        accountAge: toAccountAgeStr(profile.accountAgeDays),
        followers: profile.followers,
        following: profile.following,
        followRatio,
        postsCount: profile.postsCount,
        bio: profile.bio || '[NO BIO RECORDED]',
      },
    },
    forensicDetermination: {
      overallRiskScore: `${score} / 100`,
      riskSeverity: riskLevel,
      threatClassification: analysis ? analysis.threatCategory : 'Pending Analysis',
      priorityLevel: priority,
      recommendation,
      evidentiarySignals: indicators.map((ind, idx) => ({
        index: idx + 1,
        ruleCode: ind.code || `RULE_${idx + 1}`,
        finding: ind.description || ind.rule || 'Anomalous behavioral marker',
        severityImpact: `+${ind.points || 0} pts`,
      })),
      threatDimensionScores: {
        metadataAnomaly: `${breakdown.metadataAnomaly || 0}%`,
        behavioralBurstRate: `${breakdown.behavioralBurstRate || 0}%`,
        networkClusterDensity: `${breakdown.networkClusterDensity || 0}%`,
        linguisticScripting: `${breakdown.linguisticScripting || 0}%`,
        avatarAuthenticity: `${breakdown.avatarAuthenticity || 50}%`,
      },
    },
    chainOfCustody: {
      investigator: 'FPDS Automated Cyber Threat Engine (v1.0-ASD)',
      status: toStatus(riskLevel),
      hashVerification: `SHA256-${Buffer.from(profile.id + (analysis ? analysis.id : '')).toString('hex').slice(0, 32)}`,
      authorizedSignOff: 'Cybercrime Technical Investigator',
    },
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
  toCrimeBranchReport,
};
