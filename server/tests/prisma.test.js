'use strict';

/**
 * FPDS — Prisma Database Adapter & Model Integration Tests
 * Member 3 — Database Layer
 *
 * Verifies that the Prisma client adapter:
 *  - Successfully connects and executes CRUD operations
 *  - Properly supports relations between Profile and Analysis
 *  - Handles queries, ordering, and cascade semantics correctly
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const db = require('../src/lib/prisma');

describe('Prisma Database Adapter & Model Integration', () => {
  let createdProfileId = null;

  it('creates a profile record with all required attributes', async () => {
    const profile = await db.profile.create({
      data: {
        platform:       'instagram',
        handle:         '@test_prisma_bot',
        displayName:    'Test Prisma Sentinel',
        followers:      12,
        following:      3400,
        postsCount:     3,
        accountAgeDays: 5,
        bio:            'Automated synthetic test profile',
        profileUrl:     'https://instagram.com/test_prisma_bot',
      },
    });

    assert.ok(profile.id, 'Profile should have a generated UUID');
    assert.equal(profile.handle, '@test_prisma_bot');
    assert.equal(profile.followers, 12);
    createdProfileId = profile.id;
  });

  it('creates an associated analysis record linked via foreign key', async () => {
    assert.ok(createdProfileId, 'Requires createdProfileId from previous step');

    const analysis = await db.analysis.create({
      data: {
        profileId:      createdProfileId,
        score:          88,
        riskLevel:      'CRITICAL',
        threatCategory: 'Bot Syndicate',
        indicators:     [
          { code: 'NEW_ACCOUNT', points: 20, description: 'Created less than 30 days ago' },
          { code: 'HIGH_FOLLOW_RATIO', points: 25, description: 'Following-to-follower ratio exceeds 10:1' },
        ],
        breakdown: {
          metadataAnomaly:       80,
          behavioralBurstRate:   90,
          networkClusterDensity: 75,
          linguisticScripting:   60,
          avatarAuthenticity:    85,
        },
      },
    });

    assert.ok(analysis.id, 'Analysis should have a generated UUID');
    assert.equal(analysis.profileId, createdProfileId);
    assert.equal(analysis.score, 88);
    assert.equal(analysis.riskLevel, 'CRITICAL');
  });

  it('retrieves profile with nested analyses relation', async () => {
    const profile = await db.profile.findUnique({
      where: { id: createdProfileId },
      include: {
        analyses: true,
      },
    });

    assert.ok(profile, 'Profile should be retrieved');
    assert.equal(profile.id, createdProfileId);
    assert.ok(Array.isArray(profile.analyses), 'Analyses should be an array');
    assert.equal(profile.analyses.length, 1);
    assert.equal(profile.analyses[0].score, 88);
  });

  it('finds profiles matching query filters', async () => {
    const matching = await db.profile.findMany({
      where: { platform: 'instagram' },
      orderBy: { createdAt: 'desc' },
    });

    assert.ok(Array.isArray(matching));
    const found = matching.find((p) => p.id === createdProfileId);
    assert.ok(found, 'Should find the test profile in instagram list');
  });

  it('cascades delete from profile to associated analysis', async () => {
    if (typeof db.profile.delete === 'function') {
      await db.profile.delete({
        where: { id: createdProfileId },
      });

      const deletedProfile = await db.profile.findUnique({
        where: { id: createdProfileId },
      });
      assert.equal(deletedProfile, null, 'Profile should be removed from database');

      if (typeof db.analysis.findMany === 'function') {
        const orphanAnalyses = await db.analysis.findMany({
          where: { profileId: createdProfileId },
        });
        assert.equal(orphanAnalyses.length, 0, 'Analyses should be deleted on cascade');
      }
    }
  });
});
