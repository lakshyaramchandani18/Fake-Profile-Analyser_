'use strict';

/**
 * FPDS — Database Client Adapter
 *
 * Automatically detects whether Prisma and DATABASE_URL are available:
 *   - If DATABASE_URL is set and PrismaClient is configured, uses PostgreSQL via Prisma 7.
 *   - Otherwise, falls back to the in-memory store for local zero-config execution.
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


