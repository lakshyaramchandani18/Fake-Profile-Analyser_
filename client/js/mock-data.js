/**
 * FPDS - Fake Profile Detection System
 * Mock Data Repository & Client-side Storage Manager
 * Target: Crime Branch & Law Enforcement Forensic Analysis
 */

const FPDS_MOCK_DATA = {
  // 1. Dashboard Statistics (Strict Requirement)
  stats: {
    totalAnalyzed: 248,
    lowRisk: 102,
    mediumRisk: 76,
    highRisk: 48,
    criticalRisk: 22
  },

  // 2. Risk Distribution Chart Data
  riskDistribution: {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
    data: [102, 76, 48, 22],
    colors: ['#22C55E', '#F59E0B', '#F97316', '#EF4444']
  },

  // 3. 7-Day Activity Chart Data (Sample Data: 12, 18, 9, 24, 16, 21, 14)
  activity7Days: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [12, 18, 9, 24, 16, 21, 14]
  },

  // 4. Sample Profiles & Investigation Records
  profiles: [
    {
      id: "INV-2026-001",
      username: "crypto_whale_992",
      platform: "X",
      accountAgeDays: 14,
      postsCount: 2,
      followersCount: 8,
      followingCount: 3450,
      hasProfilePic: false,
      isUsernameFlagged: true,
      hasUnusualActivity: true,
      investigatorNotes: "Automated bulk follow behavior detected. Crypto scam broadcasting pattern.",
      investigationDate: "2026-11-14",
      riskScore: 90,
      riskLevel: "CRITICAL",
      status: "Flagged Suspicious"
    },
    {
      id: "INV-2026-002",
      username: "elena_model_vance",
      platform: "Instagram",
      accountAgeDays: 22,
      postsCount: 4,
      followersCount: 6,
      followingCount: 1820,
      hasProfilePic: true,
      isUsernameFlagged: true,
      hasUnusualActivity: true,
      investigatorNotes: "Stolen stock images used as avatars. DM phishing loop observed.",
      investigationDate: "2026-11-13",
      riskScore: 75,
      riskLevel: "CRITICAL",
      status: "Under Review"
    },
    {
      id: "INV-2026-003",
      username: "agent_recruiter_exec",
      platform: "Facebook",
      accountAgeDays: 45,
      postsCount: 3,
      followersCount: 9,
      followingCount: 1200,
      hasProfilePic: false,
      isUsernameFlagged: false,
      hasUnusualActivity: true,
      investigatorNotes: "Fabricated corporate persona targeting defense contractor employees.",
      investigationDate: "2026-11-13",
      riskScore: 65,
      riskLevel: "HIGH",
      status: "Flagged Suspicious"
    },
    {
      id: "INV-2026-004",
      username: "daily_leak_drop_hq",
      platform: "TikTok",
      accountAgeDays: 60,
      postsCount: 12,
      followersCount: 4,
      followingCount: 950,
      hasProfilePic: true,
      isUsernameFlagged: true,
      hasUnusualActivity: false,
      investigatorNotes: "Automated video scraper reposting unauthorized copyrighted clips.",
      investigationDate: "2026-11-12",
      riskScore: 55,
      riskLevel: "HIGH",
      status: "Monitoring"
    },
    {
      id: "INV-2026-005",
      username: "tech_insider_alpha",
      platform: "X",
      accountAgeDays: 85,
      postsCount: 18,
      followersCount: 120,
      followingCount: 890,
      hasProfilePic: true,
      isUsernameFlagged: false,
      hasUnusualActivity: true,
      investigatorNotes: "Unusual burst activity at 03:00 AM. Requires further surveillance.",
      investigationDate: "2026-11-11",
      riskScore: 35,
      riskLevel: "MEDIUM",
      status: "Monitoring"
    },
    {
      id: "INV-2026-006",
      username: "mark_h_journalist",
      platform: "Facebook",
      accountAgeDays: 140,
      postsCount: 45,
      followersCount: 340,
      followingCount: 410,
      hasProfilePic: true,
      isUsernameFlagged: false,
      hasUnusualActivity: false,
      investigatorNotes: "Verified local journalist reporting on community events.",
      investigationDate: "2026-11-10",
      riskScore: 10,
      riskLevel: "LOW",
      status: "Cleared"
    },
    {
      id: "INV-2026-007",
      username: "sarah_miller_dev",
      platform: "Instagram",
      accountAgeDays: 320,
      postsCount: 88,
      followersCount: 1240,
      followingCount: 480,
      hasProfilePic: true,
      isUsernameFlagged: false,
      hasUnusualActivity: false,
      investigatorNotes: "Organic interactions with verified university researchers.",
      investigationDate: "2026-11-09",
      riskScore: 0,
      riskLevel: "LOW",
      status: "Cleared"
    }
  ],

  // 5. Reports Mock Records
  reports: [
    {
      reportId: "REP-2026-891",
      profileId: "INV-2026-001",
      username: "crypto_whale_992",
      platform: "X",
      riskLevel: "CRITICAL",
      riskScore: 90,
      generatedDate: "2026-11-14",
      status: "Generated",
      investigator: "Det. A. Sharma (Crime Branch)",
      summary: "High-confidence synthetic account participating in automated pump-and-dump operations."
    },
    {
      reportId: "REP-2026-890",
      profileId: "INV-2026-002",
      username: "elena_model_vance",
      platform: "Instagram",
      riskLevel: "CRITICAL",
      riskScore: 75,
      generatedDate: "2026-11-13",
      status: "Generated",
      investigator: "Det. S. Verma (Cyber Cell)",
      summary: "Romance fraud / impersonation persona using stolen catalog photos."
    },
    {
      reportId: "REP-2026-889",
      profileId: "INV-2026-003",
      username: "agent_recruiter_exec",
      platform: "Facebook",
      riskLevel: "HIGH",
      riskScore: 65,
      generatedDate: "2026-11-13",
      status: "In Review",
      investigator: "Insp. R. Khan (Crime Branch)",
      summary: "Social engineering probe targeting enterprise personnel with falsified credentials."
    },
    {
      reportId: "REP-2026-888",
      profileId: "INV-2026-004",
      username: "daily_leak_drop_hq",
      platform: "TikTok",
      riskLevel: "HIGH",
      riskScore: 55,
      generatedDate: "2026-11-12",
      status: "In Review",
      investigator: "Det. A. Sharma (Crime Branch)",
      summary: "Scraper network account redistributing unverified video content with phishing affiliate links."
    },
    {
      reportId: "REP-2026-887",
      profileId: "INV-2026-005",
      username: "tech_insider_alpha",
      platform: "X",
      riskLevel: "MEDIUM",
      riskScore: 35,
      generatedDate: "2026-11-11",
      status: "Archived",
      investigator: "Det. S. Verma (Cyber Cell)",
      summary: "Low-impact astroturfing candidate currently monitored under standard surveillance."
    }
  ]
};

/**
 * Rule-based Scoring Engine (Strict Section 11 Methodology)
 * Computes risk score and breakdown indicators
 */
function calculateProfileRisk(profile) {
  let score = 0;
  const indicators = [];

  const age = Number(profile.accountAgeDays) || 0;
  const posts = Number(profile.postsCount) || 0;
  const followers = Number(profile.followersCount) || 0;
  const following = Number(profile.followingCount) || 0;
  const hasPic = profile.hasProfilePic === true || profile.hasProfilePic === "true" || profile.hasProfilePic === "yes";
  const userFlagged = profile.isUsernameFlagged === true || profile.isUsernameFlagged === "true" || profile.isUsernameFlagged === "yes";
  const unusualAct = profile.hasUnusualActivity === true || profile.hasUnusualActivity === "true" || profile.hasUnusualActivity === "yes";

  // 1. Account Age
  if (age < 30) {
    score += 20;
    indicators.push({
      name: "Very New Account (< 30 days)",
      points: "+20",
      status: "FLAGGED",
      explanation: `Account was created only ${age} days ago. High probability of disposable burner account.`
    });
  } else if (age <= 90) {
    score += 10;
    indicators.push({
      name: "Recent Account (30–90 days)",
      points: "+10",
      status: "FLAGGED",
      explanation: `Account is ${age} days old. Moderately established but within high-risk incubation period.`
    });
  } else {
    indicators.push({
      name: "Established Account (> 90 days)",
      points: "+0",
      status: "CLEAN",
      explanation: `Account age (${age} days) exceeds the standard high-risk threshold.`
    });
  }

  // 2. Post Count
  if (posts < 5) {
    score += 15;
    indicators.push({
      name: "Low Post Count (< 5 posts)",
      points: "+15",
      status: "FLAGGED",
      explanation: `Only ${posts} posts published. Synthetic accounts typically exhibit minimal organic content.`
    });
  } else {
    indicators.push({
      name: "Adequate Content History (≥ 5 posts)",
      points: "+0",
      status: "CLEAN",
      explanation: `Account has ${posts} posts, indicating active publication behavior.`
    });
  }

  // 3. Profile Picture Available
  if (!hasPic) {
    score += 15;
    indicators.push({
      name: "Missing Profile Picture",
      points: "+15",
      status: "FLAGGED",
      explanation: "Default avatar in use. Legitimate personal accounts consistently upload identity photos."
    });
  } else {
    indicators.push({
      name: "Profile Picture Present",
      points: "+0",
      status: "CLEAN",
      explanation: "Custom profile picture is uploaded and active on the platform."
    });
  }

  // 4. Following Imbalance: following > 10 * followers AND following >= 100
  if (following > 10 * followers && following >= 100) {
    score += 15;
    indicators.push({
      name: "Extreme Following Ratio Imbalance",
      points: "+15",
      status: "FLAGGED",
      explanation: `Following (${following}) exceeds 10x followers (${followers}). Characteristic of automated mass-following.`
    });
  } else {
    indicators.push({
      name: "Follower / Following Ratio Balanced",
      points: "+0",
      status: "CLEAN",
      explanation: "Ratio between followers and following falls within normal human variance."
    });
  }

  // 5. Follower Count (< 10 followers)
  if (followers < 10) {
    score += 10;
    indicators.push({
      name: "Extremely Low Follower Count (< 10)",
      points: "+10",
      status: "FLAGGED",
      explanation: `Only ${followers} followers recorded. Demonstrates negligible organic social reach.`
    });
  } else {
    indicators.push({
      name: "Viable Audience Reach (≥ 10 followers)",
      points: "+0",
      status: "CLEAN",
      explanation: `Account has ${followers} followers, exceeding the burner baseline.`
    });
  }

  // 6. Username Flagged for Suspicious Characteristics
  if (userFlagged) {
    score += 10;
    indicators.push({
      name: "Username Flagged for Suspicious Pattern",
      points: "+10",
      status: "FLAGGED",
      explanation: "Handle contains random alphanumeric strings, impersonation tokens, or scam keywords."
    });
  } else {
    indicators.push({
      name: "Username Standard / Unflagged",
      points: "+0",
      status: "CLEAN",
      explanation: "Handle structure conforms to standard human naming conventions."
    });
  }

  // 7. Unusual Activity Observed
  if (unusualAct) {
    score += 5;
    indicators.push({
      name: "Unusual Activity Anomaly Observed",
      points: "+5",
      status: "FLAGGED",
      explanation: "Investigator observed automated posting frequency, bot-like comment loops, or night bursts."
    });
  } else {
    indicators.push({
      name: "No Unusual Activity Noted",
      points: "+0",
      status: "CLEAN",
      explanation: "Observed interaction cadence aligns with regular human browsing behavior."
    });
  }

  // Cap at 100
  score = Math.min(100, score);

  // Classification (Strict Section 11)
  let level = "LOW";
  let badgeColor = "#22C55E";
  if (score >= 75) {
    level = "CRITICAL";
    badgeColor = "#EF4444";
  } else if (score >= 50) {
    level = "HIGH";
    badgeColor = "#F97316";
  } else if (score >= 25) {
    level = "MEDIUM";
    badgeColor = "#F59E0B";
  }

  return {
    score,
    level,
    badgeColor,
    indicators
  };
}

/**
 * LocalStorage Demo Profile Persistence
 */
const STORAGE_KEY_PROFILES = "FPDS_DEMO_PROFILES_V1";
const STORAGE_KEY_REPORTS = "FPDS_DEMO_REPORTS_V1";

function getAllProfiles() {
  const localStr = localStorage.getItem(STORAGE_KEY_PROFILES);
  if (!localStr) {
    // Initialize with mock profiles
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(FPDS_MOCK_DATA.profiles));
    return [...FPDS_MOCK_DATA.profiles];
  }
  try {
    const parsed = JSON.parse(localStr);
    return Array.isArray(parsed) ? parsed : [...FPDS_MOCK_DATA.profiles];
  } catch (e) {
    return [...FPDS_MOCK_DATA.profiles];
  }
}

function getProfileById(id) {
  const profiles = getAllProfiles();
  return profiles.find(p => p.id === id) || profiles[0] || null;
}

function saveNewProfile(profileData) {
  const profiles = getAllProfiles();
  const evaluation = calculateProfileRisk(profileData);

  const newProfile = {
    id: `INV-2026-${String(profiles.length + 1).padStart(3, '0')}`,
    username: profileData.username.trim(),
    platform: profileData.platform,
    accountAgeDays: Number(profileData.accountAgeDays),
    postsCount: Number(profileData.postsCount),
    followersCount: Number(profileData.followersCount),
    followingCount: Number(profileData.followingCount),
    hasProfilePic: profileData.hasProfilePic === true || profileData.hasProfilePic === "true" || profileData.hasProfilePic === "yes",
    isUsernameFlagged: profileData.isUsernameFlagged === true || profileData.isUsernameFlagged === "true" || profileData.isUsernameFlagged === "yes",
    hasUnusualActivity: profileData.hasUnusualActivity === true || profileData.hasUnusualActivity === "true" || profileData.hasUnusualActivity === "yes",
    investigatorNotes: profileData.investigatorNotes ? profileData.investigatorNotes.trim() : "Initial case filing.",
    investigationDate: new Date().toISOString().split('T')[0],
    riskScore: evaluation.score,
    riskLevel: evaluation.level,
    status: evaluation.level === "CRITICAL" ? "Confirmed Fake" : evaluation.level === "HIGH" ? "Flagged Suspicious" : evaluation.level === "MEDIUM" ? "Under Review" : "Cleared"
  };

  profiles.unshift(newProfile);
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));

  // Automatically append report entry
  const allReports = getAllReports();
  const newReport = {
    reportId: `REP-2026-${String(allReports.length + 892)}`,
    profileId: newProfile.id,
    username: newProfile.username,
    platform: newProfile.platform,
    riskLevel: newProfile.riskLevel,
    riskScore: newProfile.riskScore,
    generatedDate: newProfile.investigationDate,
    status: "Generated",
    investigator: "Active Investigator",
    summary: `Heuristic assessment conducted. Triggered score: ${newProfile.riskScore}/100.`
  };
  allReports.unshift(newReport);
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(allReports));

  return newProfile;
}

function getAllReports() {
  const localStr = localStorage.getItem(STORAGE_KEY_REPORTS);
  if (!localStr) {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(FPDS_MOCK_DATA.reports));
    return [...FPDS_MOCK_DATA.reports];
  }
  try {
    const parsed = JSON.parse(localStr);
    return Array.isArray(parsed) ? parsed : [...FPDS_MOCK_DATA.reports];
  } catch (e) {
    return [...FPDS_MOCK_DATA.reports];
  }
}

// Export to global scope
window.FPDS_MOCK = {
  data: FPDS_MOCK_DATA,
  calculateProfileRisk,
  getAllProfiles,
  getProfileById,
  saveNewProfile,
  getAllReports
};
