'use strict';

/**
 * FPDS — Seed Script
 * Populates the in-memory store with realistic test profiles and analyses.
 * Run once after starting the server in a separate step, or call via npm script.
 *
 * Usage: node scripts/seed.js
 * (Server must be running on PORT 3000)
 */

const http = require('http');

const BASE = 'http://localhost:3000/api';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const TEST_PROFILES = [
  {
    platform: 'twitter', handle: '@crypto_alpha_bot89',
    displayName: 'Crypto Alpha Signals',
    followers: 128, following: 4892, postsCount: 1420,
    accountAgeDays: 14, bio: '',
  },
  {
    platform: 'linkedin', handle: 'in/sarah-jenkins-hr-talent',
    displayName: 'Sarah Jenkins Lead Recruiter',
    followers: 340, following: 2150, postsCount: 12,
    accountAgeDays: 21, bio: 'HR Professional at Fortune 500',
  },
  {
    platform: 'instagram', handle: '@linda_lux_lifestyle',
    displayName: 'Linda K Luxury Travel',
    followers: 18400, following: 120, postsCount: 45,
    accountAgeDays: 60, bio: 'Travel and lifestyle blogger',
  },
  {
    platform: 'facebook', handle: 'profile.php?id=839102482',
    displayName: 'Marcus Vance Election Observer',
    followers: 890, following: 1420, postsCount: 310,
    accountAgeDays: 150, bio: 'Independent observer',
  },
  {
    platform: 'twitter', handle: '@alex_chen_dev',
    displayName: 'Alex Chen Distributed Systems',
    followers: 3840, following: 820, postsCount: 4210,
    accountAgeDays: 2190, bio: 'Software engineer, open source contributor',
  },
];

async function seed() {
  console.log('[SEED] Starting...');

  for (const profileData of TEST_PROFILES) {
    // Create profile
    const { status: s1, body: b1 } = await request('POST', '/api/profiles', profileData);
    if (s1 !== 201) { console.error('[SEED] Create failed:', b1); continue; }

    const profileId = b1.profile.id;
    console.log('[SEED] Created:', profileData.handle, '→', profileId.slice(0, 8) + '...');

    // Analyze profile
    const { status: s2, body: b2 } = await request('POST', '/api/profiles/' + profileId + '/analyze');
    if (s2 !== 201) { console.error('[SEED] Analyze failed:', b2); continue; }

    const { score, riskLevel } = b2.analysis;
    console.log('[SEED] Analyzed: score=' + score + ' level=' + riskLevel);
  }

  // Show stats
  const { body: statsBody } = await request('GET', '/api/stats');
  console.log('[SEED] Done! Stats:', JSON.stringify(statsBody.stats));
  console.log('[SEED] Dashboard: GET http://localhost:3000/api/profiles/dashboard');
}

seed().catch((err) => {
  console.error('[SEED] Error:', err.message);
  console.error('Is the server running? Start it with: node src/server.js');
  process.exit(1);
});
