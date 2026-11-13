'use strict';

/**
 * FPDS — Risk Engine Unit Tests
 * Uses Node's built-in test runner (node --test).
 * No external test libraries required.
 *
 * Run: cd server && node --test tests/riskEngine.test.js
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const { scoreProfile } = require('../src/services/riskEngine');

// ── Helper ────────────────────────────────────────────────────────────────────

function profile(overrides = {}) {
  return {
    accountAgeDays: 365,
    followers:      500,
    following:      300,
    postsCount:     200,
    bio:            'Legitimate user bio',
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('scoreProfile — LOW risk (clean profile)', () => {
  test('returns score in LOW range for a clean profile', () => {
    const result = scoreProfile(profile());
    assert.ok(result.score >= 0 && result.score <= 24, `Expected LOW score, got ${result.score}`);
    assert.equal(result.riskLevel, 'LOW');
  });

  test('returns empty indicators for a clean profile', () => {
    const result = scoreProfile(profile());
    assert.equal(result.indicators.length, 0);
  });
});

describe('scoreProfile — NEW_ACCOUNT rule', () => {
  test('fires NEW_ACCOUNT for account less than 30 days old', () => {
    const result = scoreProfile(profile({ accountAgeDays: 20 }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(codes.includes('NEW_ACCOUNT'));
  });

  test('fires VERY_NEW_ACCOUNT for account less than 7 days old', () => {
    const result = scoreProfile(profile({ accountAgeDays: 3 }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(codes.includes('NEW_ACCOUNT'));
    assert.ok(codes.includes('VERY_NEW_ACCOUNT'));
  });

  test('does not fire NEW_ACCOUNT for account 30+ days old', () => {
    const result = scoreProfile(profile({ accountAgeDays: 30 }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(!codes.includes('NEW_ACCOUNT'));
  });
});

describe('scoreProfile — ZERO_FOLLOWERS rule', () => {
  test('fires ZERO_FOLLOWERS when followers is 0', () => {
    const result = scoreProfile(profile({ followers: 0, following: 0 }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(codes.includes('ZERO_FOLLOWERS'));
  });
});

describe('scoreProfile — HIGH_FOLLOW_RATIO rule', () => {
  test('fires HIGH_FOLLOW_RATIO when following:followers > 10', () => {
    // 110 following / 10 followers = 11x ratio
    const result = scoreProfile(profile({ followers: 10, following: 110 }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(codes.includes('HIGH_FOLLOW_RATIO'));
  });

  test('fires EXTREME_FOLLOW_RATIO when ratio > 30', () => {
    // 310 following / 10 followers = 31x ratio
    const result = scoreProfile(profile({ followers: 10, following: 310 }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(codes.includes('HIGH_FOLLOW_RATIO'));
    assert.ok(codes.includes('EXTREME_FOLLOW_RATIO'));
  });

  test('does not fire when ratio <= 10', () => {
    const result = scoreProfile(profile({ followers: 100, following: 100 }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(!codes.includes('HIGH_FOLLOW_RATIO'));
  });
});

describe('scoreProfile — HIGH_POST_VOLUME_SHORT_LIFE rule', () => {
  test('fires when posts per day > 20', () => {
    // 100 posts in 4 days = 25 posts/day
    const result = scoreProfile(profile({ postsCount: 100, accountAgeDays: 4 }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(codes.includes('HIGH_POST_VOLUME_SHORT_LIFE'));
  });

  test('does not fire for normal posting rate', () => {
    // 200 posts in 365 days ≈ 0.55 posts/day
    const result = scoreProfile(profile({ postsCount: 200, accountAgeDays: 365 }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(!codes.includes('HIGH_POST_VOLUME_SHORT_LIFE'));
  });
});

describe('scoreProfile — NO_BIO rule', () => {
  test('fires when bio is empty string', () => {
    const result = scoreProfile(profile({ bio: '' }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(codes.includes('NO_BIO'));
  });

  test('fires when bio is missing', () => {
    const result = scoreProfile(profile({ bio: null }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(codes.includes('NO_BIO'));
  });

  test('does not fire when bio has content', () => {
    const result = scoreProfile(profile({ bio: 'I am a human' }));
    const codes = result.indicators.map(i => i.code);
    assert.ok(!codes.includes('NO_BIO'));
  });
});

describe('scoreProfile — Score capping', () => {
  test('score never exceeds 100', () => {
    // Trigger every possible rule
    const result = scoreProfile(profile({
      accountAgeDays: 2,       // NEW_ACCOUNT + VERY_NEW_ACCOUNT
      followers:      0,       // ZERO_FOLLOWERS
      following:      9999,    // HIGH_FOLLOW_RATIO + EXTREME_FOLLOW_RATIO + MASSIVE_FOLLOWING_COUNT
      postsCount:     0,       // ZERO_POSTS + LOW_POST_COUNT
      bio:            '',      // NO_BIO
    }));
    assert.ok(result.score <= 100, `Score exceeded 100: ${result.score}`);
  });
});

describe('scoreProfile — CRITICAL risk (heavy bot profile)', () => {
  test('bot-like profile scores CRITICAL', () => {
    const result = scoreProfile(profile({
      accountAgeDays: 5,
      followers:      10,
      following:      5000,
      postsCount:     800,
      bio:            '',
    }));
    assert.ok(result.score >= 75, `Expected CRITICAL, got score: ${result.score}`);
    assert.equal(result.riskLevel, 'CRITICAL');
  });
});

describe('scoreProfile — Validation', () => {
  test('throws on negative accountAgeDays', () => {
    assert.throws(
      () => scoreProfile(profile({ accountAgeDays: -1 })),
      /accountAgeDays/
    );
  });

  test('throws on non-integer followers', () => {
    assert.throws(
      () => scoreProfile(profile({ followers: 1.5 })),
      /followers/
    );
  });

  test('throws on string postsCount', () => {
    assert.throws(
      () => scoreProfile(profile({ postsCount: '100' })),
      /postsCount/
    );
  });
});

describe('scoreProfile — Breakdown shape', () => {
  test('returns all 5 breakdown fields', () => {
    const result = scoreProfile(profile());
    const keys = Object.keys(result.breakdown);
    assert.ok(keys.includes('metadataAnomaly'));
    assert.ok(keys.includes('behavioralBurstRate'));
    assert.ok(keys.includes('networkClusterDensity'));
    assert.ok(keys.includes('linguisticScripting'));
    assert.ok(keys.includes('avatarAuthenticity'));
  });

  test('all breakdown values are 0–100', () => {
    const result = scoreProfile(profile({
      accountAgeDays: 2,
      followers:      0,
      following:      9999,
      postsCount:     1000,
      bio:            '',
    }));
    for (const [key, val] of Object.entries(result.breakdown)) {
      assert.ok(val >= 0 && val <= 100, `breakdown.${key} = ${val} is out of range`);
    }
  });
});

