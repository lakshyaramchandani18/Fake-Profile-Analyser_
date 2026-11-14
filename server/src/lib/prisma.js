'use strict';

/**
 * FPDS — Database Client Adapter
 *
 * Automatically detects whether Prisma and DATABASE_URL are available:
 *   - If DATABASE_URL is set and PrismaClient is installed, uses real PostgreSQL.
 *   - Otherwise, falls back to the in-memory store for local development/testing.
 *
 * For Member 3 (Prisma setup):
 *   1. Run `npm install @prisma/client` and `npm install -D prisma` in server/
 *   2. Run `npx prisma init` (or `npx prisma migrate dev`)
 *   3. Set DATABASE_URL in server/.env
 *   4. Done — no manual edits required in controllers or routes!
 */

let db;

try {
  if (process.env.DATABASE_URL) {
    const prismaClientModule = process.env.PRISMA_CLIENT_PATH || '@prisma/client';
    const { PrismaClient } = require(prismaClientModule);
    const { PrismaPg } = require('@prisma/adapter-pg');

    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    db = new PrismaClient({ adapter });
    console.log('[FPDS] Database: Connected via Prisma Client (PostgreSQL Adapter)');
  } else {
    throw new Error('DATABASE_URL not set');
  }
} catch {
  db = require('./inMemoryStore');
  console.log('[FPDS] Database: Using in-memory store (fallback)');
}

module.exports = db;


