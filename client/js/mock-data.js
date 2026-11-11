/**
 * Fake Social Media Profile Detection and Reporting System (FPDS)
 * Mock Data Repository - Cybersecurity Forensic Intelligence
 * ASD University Capstone Project
 */

const FPDS_MOCK_DATA = {
  systemOverview: {
    systemName: "FPDS Forensics Engine",
    version: "v2.4.1-alpha",
    status: "ONLINE",
    lastSync: "Just now",
    databaseRecords: "1,248,930 profiles indexed",
    metrics: {
      totalScanned: 14892,
      totalScannedTrend: "+18.4% this week",
      highRiskDetected: 1429,
      highRiskTrend: "+12.1% flagged",
      botClustersIdentified: 84,
      botClustersTrend: "5 active syndicates",
      avgDetectionConfidence: 98.4,
      avgConfidenceTrend: "±0.3% margin"
    }
  },

  // Investigations Data
  investigations: [
    {
      id: "INV-2026-8941",
      platform: "twitter",
      platformName: "Twitter / X",
      handle: "@crypto_alpha_bot89",
      displayName: "Crypto Alpha Signals 🚀",
      avatarInitials: "CA",
      riskScore: 94,
      riskLevel: "critical", // critical, high, medium, low
      threatCategory: "Coordinated Bot Farm",
      accountAge: "14 days",
      followers: 128,
      following: 4892,
      postsCount: 1420,
      status: "Confirmed Fake",
      timestamp: "6 mins ago",
      investigator: "Analyst #402",
      signals: [
        "Identical bio hash matched with 42 other accounts in cluster",
        "High-frequency automated broadcasting (28 tweets/minute)",
        "Profile picture matches StyleGAN face synthesis markers",
        "Abnormal follow-to-follower ratio (1:38.2)"
      ],
      breakdown: {
        avatarAuthenticity: 12, // Lower means fake
        metadataAnomaly: 96,
        behavioralBurstRate: 92,
        networkClusterDensity: 94,
        linguisticScripting: 89
      },
      hourlyActivity: [22, 28, 35, 41, 38, 29, 24, 30, 28, 32, 38, 44, 40, 36, 42, 39, 45, 48, 52, 49, 42, 36, 30, 26], // 24/7 bot burst
      networkStats: {
        clusterDensity: 94,
        reciprocalRatio: "98.2%",
        botCliqueSize: 42,
        isolatedComponent: true
      },
      faceForensics: {
        ganScore: 96,
        eyeAxisDeviation: "0.01% (Synthetic Centering)",
        pupilAsymmetry: "Detected",
        backgroundArtifacts: "GAN Neural Smudge",
        verdict: "StyleGAN-v2 Synthesized Persona"
      }
    },
    {
      id: "INV-2026-8938",
      platform: "linkedin",
      platformName: "LinkedIn",
      handle: "in/sarah-jenkins-hr-talent",
      displayName: "Sarah Jenkins [Lead Recruiter]",
      avatarInitials: "SJ",
      riskScore: 88,
      riskLevel: "critical",
      threatCategory: "Corporate Impersonation",
      accountAge: "21 days",
      followers: 340,
      following: 2150,
      postsCount: 12,
      status: "Flagged Suspicious",
      timestamp: "24 mins ago",
      investigator: "Analyst #108",
      signals: [
        "Headshot reverse lookup matches stock photo library with modified background",
        "Fabricated employment history at non-existent corporate entities",
        "Bulk outbound connection requests to defense contractor employees",
        "Zero endorsement graph reciprocation"
      ],
      breakdown: {
        avatarAuthenticity: 18,
        metadataAnomaly: 84,
        behavioralBurstRate: 78,
        networkClusterDensity: 91,
        linguisticScripting: 72
      },
      hourlyActivity: [0, 0, 0, 0, 0, 5, 14, 22, 18, 25, 20, 19, 21, 24, 28, 30, 22, 18, 12, 6, 2, 0, 0, 0],
      networkStats: {
        clusterDensity: 91,
        reciprocalRatio: "14.2%",
        botCliqueSize: 18,
        isolatedComponent: false
      },
      faceForensics: {
        ganScore: 88,
        eyeAxisDeviation: "0.04% (Stock Composite)",
        pupilAsymmetry: "Neutral",
        backgroundArtifacts: "Chroma Key Replacement",
        verdict: "Manipulated Stock Asset"
      }
    },
    {
      id: "INV-2026-8932",
      platform: "instagram",
      platformName: "Instagram",
      handle: "@linda_lux_lifestyle",
      displayName: "Linda K. • Luxury Travel & Lifestyle",
      avatarInitials: "LL",
      riskScore: 82,
      riskLevel: "high",
      threatCategory: "Financial Scam / Romance Fraud",
      accountAge: "2 months",
      followers: 18400,
      following: 120,
      postsCount: 45,
      status: "Under Review",
      timestamp: "1 hour ago",
      investigator: "Analyst #215",
      signals: [
        "Stolen photos identified from verified European fashion model",
        "Sudden injection of 15,000 purchased inactive followers over 48 hours",
        "Comment section dominated by spam bot engagement loops",
        "DM redirection to unverified Telegram investment channels"
      ],
      breakdown: {
        avatarAuthenticity: 25,
        metadataAnomaly: 81,
        behavioralBurstRate: 86,
        networkClusterDensity: 79,
        linguisticScripting: 83
      },
      hourlyActivity: [2, 1, 0, 0, 0, 0, 4, 12, 15, 18, 22, 20, 19, 24, 28, 32, 29, 24, 20, 16, 12, 8, 4, 2],
      networkStats: {
        clusterDensity: 79,
        reciprocalRatio: "8.4%",
        botCliqueSize: 24,
        isolatedComponent: false
      },
      faceForensics: {
        ganScore: 32,
        eyeAxisDeviation: "Natural Human Asymmetry",
        pupilAsymmetry: "Organic",
        backgroundArtifacts: "Stolen Original Media",
        verdict: "Identity Theft / Impersonation"
      }
    },
    {
      id: "INV-2026-8927",
      platform: "facebook",
      platformName: "Facebook",
      handle: "profile.php?id=839102482",
      displayName: "Marcus Vance Election Observer",
      avatarInitials: "MV",
      riskScore: 68,
      riskLevel: "medium",
      threatCategory: "Astroturfing & Disinformation",
      accountAge: "5 months",
      followers: 890,
      following: 1420,
      postsCount: 310,
      status: "Monitoring",
      timestamp: "3 hours ago",
      investigator: "Analyst #402",
      signals: [
        "Re-sharing identical political propaganda infographics across 18 state groups",
        "Temporal alignment with known coordinated information operation campaigns",
        "No natural original personal content or family connections",
        "Account created via temporary email provider domain"
      ],
      breakdown: {
        avatarAuthenticity: 45,
        metadataAnomaly: 62,
        behavioralBurstRate: 71,
        networkClusterDensity: 69,
        linguisticScripting: 74
      },
      hourlyActivity: [8, 10, 12, 14, 9, 6, 8, 12, 18, 22, 24, 26, 28, 30, 28, 25, 24, 22, 20, 18, 16, 14, 12, 10],
      networkStats: {
        clusterDensity: 69,
        reciprocalRatio: "62.4%",
        botCliqueSize: 15,
        isolatedComponent: true
      },
      faceForensics: {
        ganScore: 72,
        eyeAxisDeviation: "0.12% (AI Composite)",
        pupilAsymmetry: "Mild distortion",
        backgroundArtifacts: "Diffusion background fill",
        verdict: "Semi-Synthetic Persona"
      }
    },
    {
      id: "INV-2026-8920",
      platform: "tiktok",
      platformName: "TikTok",
      handle: "@gadget_leak_daily_hq",
      displayName: "Tech Leak Daily HQ",
      avatarInitials: "TL",
      riskScore: 54,
      riskLevel: "medium",
      threatCategory: "Automated Content Scraper",
      accountAge: "4 months",
      followers: 43200,
      following: 380,
      postsCount: 620,
      status: "Monitoring",
      timestamp: "5 hours ago",
      investigator: "Analyst #319",
      signals: [
        "100% video generation via AI voiceover and watermarked clip reposts",
        "Suspicious bio redirect link containing affiliate phishing parameters",
        "Automated hashtag stuffing detected across all recent uploads",
        "Low unique comment engagement despite high view counts"
      ],
      breakdown: {
        avatarAuthenticity: 60,
        metadataAnomaly: 48,
        behavioralBurstRate: 59,
        networkClusterDensity: 52,
        linguisticScripting: 66
      },
      hourlyActivity: [4, 4, 4, 4, 4, 4, 8, 12, 14, 16, 18, 20, 22, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4],
      networkStats: {
        clusterDensity: 52,
        reciprocalRatio: "22.1%",
        botCliqueSize: 8,
        isolatedComponent: false
      },
      faceForensics: {
        ganScore: 40,
        eyeAxisDeviation: "Logo Graphic",
        pupilAsymmetry: "N/A",
        backgroundArtifacts: "Vector Asset",
        verdict: "Synthetic Brand Icon"
      }
    },
    {
      id: "INV-2026-8915",
      platform: "twitter",
      platformName: "Twitter / X",
      handle: "@alex_chen_dev",
      displayName: "Alex Chen | Distributed Systems",
      avatarInitials: "AC",
      riskScore: 12,
      riskLevel: "low",
      threatCategory: "Legitimate User (Verified)",
      accountAge: "6 years",
      followers: 3840,
      following: 820,
      postsCount: 4210,
      status: "Cleared",
      timestamp: "8 hours ago",
      investigator: "Analyst #108",
      signals: [
        "Consistent temporal activity conforming to human circadian rhythm",
        "Organic interaction graphs with verified open-source contributors",
        "Valid cryptographic signatures linked to public GitHub keypair",
        "Natural distribution of conversational replies and original media"
      ],
      breakdown: {
        avatarAuthenticity: 95,
        metadataAnomaly: 8,
        behavioralBurstRate: 11,
        networkClusterDensity: 14,
        linguisticScripting: 9
      },
      hourlyActivity: [0, 0, 0, 0, 0, 0, 0, 2, 6, 8, 10, 9, 8, 11, 14, 12, 9, 7, 5, 4, 2, 1, 0, 0], // Natural human sleep
      networkStats: {
        clusterDensity: 14,
        reciprocalRatio: "34.5%",
        botCliqueSize: 0,
        isolatedComponent: false
      },
      faceForensics: {
        ganScore: 5,
        eyeAxisDeviation: "Natural Human Portrait (0.84% deviation)",
        pupilAsymmetry: "Natural biological lighting reflection",
        backgroundArtifacts: "Natural depth of field optical blur",
        verdict: "Authentic Human Portrait"
      }
    }
  ],

  // Threat Activity Live Feed
  activityStream: [
    {
      id: "EVT-101",
      type: "alert",
      time: "2 mins ago",
      title: "Bot Ring Spike Detected",
      description: "Cluster of 14 new accounts created under subnet 194.26.29.0/24 sharing identical bio fingerprints."
    },
    {
      id: "EVT-102",
      type: "scan",
      time: "8 mins ago",
      title: "Deep Fake Face Match",
      description: "Profile @sarah.jenkins_hr flagged for StyleGAN synthesis eye-alignment symmetry."
    },
    {
      id: "EVT-103",
      type: "report",
      time: "22 mins ago",
      title: "Investigation Report Generated",
      description: "Forensic dossier #FPDS-2026-089 signed and exported for Academic Review."
    },
    {
      id: "EVT-104",
      type: "cleared",
      time: "45 mins ago",
      title: "Profile Cleared",
      description: "Account @alex_chen_dev passed multi-modal behavioral authenticity validation."
    }
  ],

  // ASD Academic Detection Methodology
  methodologySteps: [
    {
      step: 1,
      title: "Visual Artifact & Face Synthesis Inspection",
      code: "MOD-IMG-01",
      description: "Performs GAN artifact detection on profile avatars, eye-alignment symmetry tests, and reverse perceptual hashing against known impersonation databases."
    },
    {
      step: 2,
      title: "Chronological Activity & Temporal Poisson Mapping",
      code: "MOD-TEMP-02",
      description: "Evaluates post intervals against standard human sleep-wake cycles. Detects sub-second burst broadcasts and unhuman regularity."
    },
    {
      step: 3,
      title: "Graph Topology & Reciprocal Cluster Analysis",
      code: "MOD-NET-03",
      description: "Constructs ego-network graphs to uncover artificial follower injection, isolated clique rings, and bot farm cross-pollination patterns."
    },
    {
      step: 4,
      title: "NLP Stylometry & Scripted Semantic Fingerprinting",
      code: "MOD-NLP-04",
      description: "Analyzes lexical richness, sentiment polarity variance, and phrase repetition across social media text feeds using lightweight transformer heuristics."
    },
    {
      step: 5,
      title: "Bayesian Multi-Factor Risk Synthesis",
      code: "MOD-RISK-05",
      description: "Aggregates weighted anomaly outputs into a normalized 0-100 Threat Index: <30 (Legitimate), 30-60 (Suspicious), 60-80 (High Risk), >80 (Confirmed Fake)."
    }
  ],

  // Platform Distribution
  platformStats: [
    { name: "Twitter / X", count: "6,420", percentage: "43%", riskRate: "18.2%" },
    { name: "Instagram", count: "4,180", percentage: "28%", riskRate: "12.5%" },
    { name: "LinkedIn", count: "2,640", percentage: "18%", riskRate: "9.8%" },
    { name: "Facebook", count: "1,190", percentage: "8%", riskRate: "14.1%" },
    { name: "TikTok / Other", count: "462", percentage: "3%", riskRate: "22.4%" }
  ]
};

// Freeze data to prevent mutations
if (typeof Object.freeze === "function") {
  Object.freeze(FPDS_MOCK_DATA);
}
