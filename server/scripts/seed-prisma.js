'use strict';

/**
 * FPDS — Direct Prisma ORM Seed Script
 * Member 3 — Database Layer
 *
 * Populates PostgreSQL database directly through Prisma Client
 * without requiring the HTTP server to be running.
 *
 * Usage:
 *   node scripts/seed-prisma.js
 *   or npm run db:seed
 */

require('dotenv').config();

const db = require('../src/lib/prisma');
const { scoreProfile } = require('../src/services/riskEngine');

const SEED_PROFILES = [
  {
    platform: 'twitter',
    handle: '@crypto_alpha_bot89',
    displayName: 'Crypto Alpha Signals',
    followers: 128,
    following: 4892,
    postsCount: 1420,
    accountAgeDays: 14,
    bio: '',
    profileUrl: 'https://twitter.com/crypto_alpha_bot89',
  },
  {
    platform: 'linkedin',
    handle: 'in/sarah-jenkins-hr-talent',
    displayName: 'Sarah Jenkins Lead Recruiter',
    followers: 340,
    following: 2150,
    postsCount: 12,
    accountAgeDays: 21,
    bio: 'HR Professional at Fortune 500. Connecting talent with global opportunity.',
    profileUrl: 'https://linkedin.com/in/sarah-jenkins-hr-talent',
  },
  {
    platform: 'instagram',
    handle: '@linda_lux_lifestyle',
    displayName: 'Linda K Luxury Travel',
    followers: 18400,
    following: 120,
    postsCount: 45,
    accountAgeDays: 60,
    bio: 'Travel and lifestyle blogger. Collaborations: dm or email.',
    profileUrl: 'https://instagram.com/linda_lux_lifestyle',
  },
  {
    platform: 'facebook',
    handle: 'profile.php?id=839102482',
    displayName: 'Marcus Vance Election Observer',
    followers: 890,
    following: 1420,
    postsCount: 310,
    accountAgeDays: 150,
    bio: 'Independent political commentary and election security watcher.',
    profileUrl: 'https://facebook.com/profile.php?id=839102482',
  },
  {
    platform: 'twitter',
    handle: '@alex_chen_dev',
    displayName: 'Alex Chen Distributed Systems',
    followers: 3840,
    following: 820,
    postsCount: 4210,
    accountAgeDays: 2190,
    bio: 'Software engineer, open source contributor. Distributed systems and databases.',
    profileUrl: 'https://twitter.com/alex_chen_dev',
  },
];

async function main() {
  console.log('[FPDS Seed] Seeding database via Prisma Client...');

  for (const item of SEED_PROFILES) {
    const assessment = scoreProfile(item);

    const profile = await db.profile.create({
      data: {
        platform:       item.platform,
        handle:         item.handle,
        displayName:    item.displayName,
        bio:            item.bio,
        profileUrl:     item.profileUrl,
        followers:      item.followers,
        following:      item.following,
        postsCount:     item.postsCount,
        accountAgeDays: item.accountAgeDays,
        analyses: {
          create: {
            score:          assessment.score,
            riskLevel:      assessment.riskLevel,
            threatCategory: assessment.threatCategory,
            indicators:     assessment.indicators,
            breakdown:      assessment.breakdown,
          },
        },
      },
      include: {
        analyses: true,
      },
    });

    console.log(
      `[FPDS Seed] Seeded ${profile.handle.padEnd(28)} | Score: ${String(assessment.score).padStart(3)} | Risk: ${assessment.riskLevel.padEnd(8)} | ID: ${profile.id}`
    );
  }

  const profileCount  = await db.profile.count();
  const analysisCount = await db.analysis.count();
  console.log(`[FPDS Seed] Seeding complete! Total Profiles: ${profileCount}, Total Analyses: ${analysisCount}`);
}

main()
  .catch((err) => {
    console.error('[FPDS Seed] Error during seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    if (typeof db.$disconnect === 'function') {
      await db.$disconnect();
    }
  });
