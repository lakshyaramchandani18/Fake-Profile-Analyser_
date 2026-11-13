'use strict';

/**
 * FPDS — Database Verification & Health Diagnostic
 * Member 3 — Database Layer
 *
 * Verifies live PostgreSQL connectivity, runs raw sanity queries,
 * checks table states and relations, and prints a diagnostic report.
 *
 * Usage:
 *   node scripts/verify-db.js
 *   or npm run db:verify
 */

require('dotenv').config();

const db = require('../src/lib/prisma');

async function verify() {
  console.log('====================================================');
  console.log('   FPDS — PostgreSQL Database Verification Report   ');
  console.log('====================================================');

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is not set in environment or .env file');
    process.exit(1);
  }

  // Mask credentials in printed URL for security
  const maskedUrl = dbUrl.replace(/\/\/([^:]+):?([^@]*)@/, '//***:***@');
  console.log(`🔌 Target Database : ${maskedUrl}`);

  const isPrisma = typeof db.$queryRaw === 'function';
  if (!isPrisma) {
    console.warn('⚠️  Prisma Client not initialized — using inMemory fallback');
    process.exit(0);
  }

  try {
    const t0 = Date.now();
    const [rawPing] = await db.$queryRaw`SELECT NOW() as current_time, current_database() as db_name, version() as pg_version`;
    const latency = Date.now() - t0;

    console.log(`✅ Connection Status: CONNECTED (${latency}ms roundtrip)`);
    console.log(`📊 Active Database  : ${rawPing.db_name}`);
    console.log(`🕒 Database Clock   : ${rawPing.current_time}`);
    console.log(`🏷️  Engine Version  : ${String(rawPing.pg_version).split(',')[0]}`);

    const profileCount  = await db.profile.count();
    const analysisCount = await db.analysis.count();

    console.log('----------------------------------------------------');
    console.log(`📁 Profile Records  : ${profileCount}`);
    console.log(`🔬 Analysis Records : ${analysisCount}`);

    if (profileCount > 0) {
      const sample = await db.profile.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { analyses: { take: 1 } },
      });
      console.log(`🔍 Latest Profile   : ${sample.handle} (${sample.platform})`);
      if (sample.analyses[0]) {
        console.log(`   └─ Risk Score    : ${sample.analyses[0].score}/100 [${sample.analyses[0].riskLevel}]`);
      }
    }
    console.log('====================================================');
    console.log('✅ All database verification checks passed!');
  } catch (err) {
    console.error('❌ Database verification failed:', err.message);
    process.exit(1);
  } finally {
    if (typeof db.$disconnect === 'function') {
      await db.$disconnect();
    }
  }
}

verify();
