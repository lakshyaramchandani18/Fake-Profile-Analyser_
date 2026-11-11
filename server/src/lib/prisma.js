'use strict';

/**
 * FPDS — Database Client Adapter
 *
 * Phase 1 (now):   uses in-memory store — full API works, data resets on restart.
 * Phase 2 (Day 3): Member 3 provides Prisma schema + generated client path.
 *                  Set PRISMA_CLIENT_PATH below and remove the in-memory branch.
 *
 * HOW TO SWITCH TO PRISMA (coordinate with Member 3):
 *   1. Member 3 runs `npx prisma generate`.
 *   2. Set PRISMA_CLIENT_PATH to the generated client path (e.g. '../../prisma/generated/client').
 *   3. Set DATABASE_URL in .env.
 *   4. Done — controllers don't need to change at all.
 */

// ── Set this when Member 3 provides the Prisma generated client ───────────────
const PRISMA_CLIENT_PATH = null; // e.g. '../../prisma/generated/client'
// ─────────────────────────────────────────────────────────────────────────────

let db;

if (PRISMA_CLIENT_PATH) {
  const { PrismaClient } = require(PRISMA_CLIENT_PATH);
  db = new PrismaClient();
  console.log('[FPDS] Using Prisma + PostgreSQL');
} else {
  db = require('./inMemoryStore');
  console.log('[FPDS] Using in-memory store (no DB configured yet)');
}

module.exports = db;

