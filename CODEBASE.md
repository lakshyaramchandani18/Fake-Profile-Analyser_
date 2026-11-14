# FPDS — Full Codebase Reference & Architecture Guide

> **Target Audience:** All team members (Members 1, 2, 3) and their AI assistants.
> **Last Updated:** Day 3 of 4-day capstone sprint.
> **AI Instruction:** Read this document first to understand project architecture, team boundaries, completed work, and your exact hand-off tasks.

---

## 1. Project Overview

**Fake Social Media Profile Detection and Reporting System (FPDS)**
University ASD (Advanced Software Development) Capstone — 4-day MVP Sprint

An investigation support tool that allows a forensic analyst to inspect social media profiles, run a deterministic rule-based risk analysis engine, view contributing risk indicators across 5 threat dimensions, and manage investigation records.

> ⚠️ **Core Domain Principle:** Risk scores (0–100) are investigation leads for forensic analysts, NOT legal proof of inauthenticity.

---

## 2. Team Boundaries & Ownership

| Member | Domain & Responsibilities | Working Branch | Status |
|--------|---------------------------|----------------|--------|
| **Member 1** | Express API, 10-rule risk engine, input validation, in-memory DB fallback, integration tests, API formatters | `feature/backend` | **100% Done (Merged)** |
| **Member 2** | Client UI, SOC dashboard, wiring frontend `fetch()` calls to backend endpoints | `feature/frontend` | In Progress (Mock UI complete) |
| **Member 3 (Current)** | PostgreSQL database setup, Prisma schema, migrations, DB seed & verification, ER docs | `feature/database` | **100% Done (Ready for PR)** |

### Branch Policy
- **Never push directly to `main`**. All work must be developed on a feature branch (`feature/backend`, `feature/frontend`, etc.) and merged via GitHub Pull Request.
- `main` serves as the clean, stable integration baseline.

---

## 3. What Has Happened So Far (Sprint Chronology)

### Day 1 (Nov 11)
- **Frontend Prototype:** Member 2 implemented the Day 1 SOC investigation UI in `client/` using static data in `mock-data.js`.
- **Backend Core:** Member 1 initialized `server/` with Express 5, CORS, and dotenv.
- **Risk Engine:** Implemented a deterministic 10-rule risk scoring engine (`src/services/riskEngine.js`) with 21 unit tests.
- **REST Endpoints:** Created controllers and routes for profiles, analyses, dashboard formatted output, and stats.
- **In-Memory Store:** Built an in-memory database mock (`src/lib/inMemoryStore.js`) mirroring Prisma's API so the entire system works before PostgreSQL is provisioned.
- **One-Shot Scan:** Implemented `POST /api/scan` for rapid profile analysis from the dashboard quick scan bar.

### Day 2 & 3 (Nov 12–13)
- **PR & History Management:** Cleaned up git history so `main` remains pristine at the Day 1 baseline while `feature/backend` holds granular, authentic commits.
- **Database Adapter Upgrade (`src/lib/prisma.js`):** Engineered automatic database detection. The server now checks for `DATABASE_URL` in `.env` — if present and `@prisma/client` is installed, it connects to PostgreSQL; otherwise, it seamlessly uses the in-memory store.
- **Integration Test Suite (`tests/api.test.js`):** Added 14 controller integration tests covering profile CRUD, analysis flows, 404 handling, and quick scans. Total test suite is **35 / 35 tests passing (100% green)**.
- **Documentation & Prisma Specification:** Documented ready-to-use Prisma models for Member 3.

### Day 4 & 5 (Nov 13–14) — Member 3 Database Integration & Forensic Reporting
- **PostgreSQL & Prisma 7 Architecture:** Provisioned Prisma 7 ORM with PostgreSQL datasource, UUID primary keys, and cascade foreign key constraints. Migrated connection URLs to modern `prisma.config.js` with `@prisma/adapter-pg` driver adapter.
- **Database Migration:** Generated and applied migration `20261113113409_init` creating live `Profile`, `Analysis`, and `_prisma_migrations` tables.
- **Crime Branch Forensic Dossier:** Implemented formal law-enforcement report generator (`toCrimeBranchReport`) and endpoint `GET /api/profiles/:id/report` providing full case metadata, threat classification, and hash-verified chain-of-custody.
- **Unified Master Seeder:** Built unified seeder in `scripts/seed.js` with automatic mode switching between PostgreSQL (via Prisma ORM) and in-memory store fallback.
- **Lifecycle & Health Heartbeat:** Added graceful Prisma disconnection handling on SIGINT/SIGTERM, and extended `/health` endpoint to query PostgreSQL and measure query latency.
- **Test Suite Expansion:** Expanded test suite with controller integration tests for the report endpoint and Prisma adapter tests. Test suite is **41 / 41 passing tests (100% green)**.
- **Documentation & Diagrams:** Authored `server/docs/DATABASE.md` and overhauled `README.md` with complete Mermaid system architecture, sequence flows, and ER diagrams.

---

## 4. Repository Structure

```text
Fake-Profile-Analyser_/
├── CODEBASE.md                     ← Master architecture reference (this file)
├── README.md                       ← Academic project description
├── .gitignore                      ← Ignores node_modules, .env, *.log, context.md
│
├── client/                         ← FRONTEND (Owned by Member 2)
│   ├── index.html                  ← Landing portal
│   ├── dashboard.html              ← SOC analyst dashboard (primary UI)
│   ├── css/                        ← Design system tokens, components, grid
│   │   ├── style.css
│   │   ├── components.css
│   │   └── dashboard.css
│   └── js/
│       ├── mock-data.js            ← Static data (to be replaced by API calls)
│       ├── app.js                  ← App shell, toast notifications, search
│       ├── navigation.js           ← Sidebar navigation, modal toggles
│       └── dashboard.js            ← Investigations table, KPI cards, inspector
│
└── server/                         ← BACKEND (Owned by Member 1)
    ├── BACKEND.md                  ← Detailed API specification & guide
    ├── package.json                ← Express 5, Node >=20, npm test runner
    ├── .env.example                ← Template: PORT=3000, DATABASE_URL
    ├── prisma.config.js            ← Prisma 7 CLI & migration configuration
    ├── prisma/
    │   ├── schema.prisma           ← Prisma data models (Profile & Analysis)
    │   └── migrations/             ← Applied PostgreSQL migrations
    ├── scripts/
    │   ├── seed.js                 ← Unified master seeder (Prisma ORM + in-memory)
    │   └── verify-db.js            ← Database connectivity & latency diagnostic
    ├── src/
    │   ├── server.js               ← Entry point (boots on PORT 3000)
    │   ├── app.js                  ← Express app, CORS (allows 8080 & 5500), JSON parser
    │   ├── routes/
    │   │   ├── health.js           ← GET /health
    │   │   ├── profiles.js         ← Profile CRUD, /dashboard & /:id/report
    │   │   ├── analyses.js         ← Analysis retrieval endpoints
    │   │   ├── stats.js            ← GET /api/stats for dashboard KPI cards
    │   │   └── scan.js             ← POST /api/scan for quick scan widget
    │   ├── controllers/
    │   │   ├── profileController.js
    │   │   ├── analysisController.js
    │   │   ├── statsController.js
    │   │   └── scanController.js
    │   ├── services/
    │   │   └── riskEngine.js       ← Deterministic pure-function scoring engine
    │   ├── middleware/
    │   │   ├── validate.js         ← Input sanitization & schema validation
    │   │   └── errorHandler.js     ← Centralized JSON error response handler
    │   ├── lib/
    │   │   ├── prisma.js           ← Auto-switching DB adapter (Prisma 7 ↔ inMemory)
    │   │   └── inMemoryStore.js    ← Map-based in-memory store with Prisma-like API
    │   └── utils/
    │       └── formatters.js       ← Formats DB entities into dashboard UI shape & Crime Branch dossier
    └── tests/
        ├── riskEngine.test.js      ← 21 unit tests for risk scoring rules
        └── api.test.js             ← 20 integration tests for controllers & report
```

---

## 5. API Endpoints Quick Reference

Base URL: `http://localhost:3000`

| Method | Endpoint | Purpose | Target Consumer |
|---|---|---|---|
| `GET` | `/health` | Server uptime & status check | DevOps / Health checks |
| `POST` | `/api/scan` | One-shot: saves profile, scores risk, returns investigation object | Client Quick Scan Bar |
| `GET` | `/api/profiles/dashboard` | Returns all profiles formatted as investigation rows | Client Table on Load |
| `GET` | `/api/stats` | Returns metrics (`totalScanned`, `highRiskDetected`, etc.) | Client KPI Cards |
| `POST` | `/api/profiles` | Registers a new profile | Investigation flow |
| `GET` | `/api/profiles` | Lists profiles with latest analysis summary | Internal API |
| `GET` | `/api/profiles/:id` | Returns single profile by UUID | Detail view |
| `GET` | `/api/profiles/:id/report` | Generates official Crime Branch forensic investigation dossier | Law enforcement export |
| `POST` | `/api/profiles/:id/analyze` | Triggers risk engine on profile, persists analysis | Analyst manual trigger |
| `GET` | `/api/profiles/:id/analyses`| Retrieves historical analysis runs for a profile | Audit history |
| `GET` | `/api/analyses/:id` | Fetches single analysis record by ID | Deep inspection |

---

## 6. Guide for Member 2's AI (Frontend Wiring)

Your goal is to replace static calls to `FPDS_MOCK_DATA` with `fetch()` calls to the backend running at `http://localhost:3000`.

### Step 1: Wire Dashboard Table on Load (`client/js/dashboard.js`)
In `initDashboard()`:
```javascript
// Replace static assignment with API fetch:
async function loadDashboardData() {
  try {
    const res = await fetch('http://localhost:3000/api/profiles/dashboard');
    const { investigations } = await res.json();
    // investigations array is 100% field-compatible with FPDS_MOCK_DATA.investigations
    window.investigations = investigations;
    renderInvestigationsTable();
  } catch (err) {
    console.error('Failed to load investigations from API:', err);
  }
}
```

### Step 2: Wire Quick Scan Form (`client/js/dashboard.js`)
In `handleQuickScanSubmit()`:
```javascript
// Replace client-side setTimeout simulation with:
const res = await fetch('http://localhost:3000/api/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ handle: targetQuery, platform: selectedPlatform })
});
const { investigation } = await res.json();
window.investigations.unshift(investigation);
renderInvestigationsTable();
selectInvestigation(investigation.id);
```

### Step 3: Wire KPI Metrics Cards (`client/js/dashboard.js`)
```javascript
const res = await fetch('http://localhost:3000/api/stats');
const { stats } = await res.json();
animateMetricNumber('statTotalScanned', stats.totalScanned);
animateMetricNumber('statHighRisk', stats.highRiskDetected);
animateMetricNumber('statPendingReview', stats.pendingReview);
animateMetricNumber('statSystemAccuracy', stats.systemAccuracy);
```

---

## 7. Guide for Member 3's AI (Database & Prisma 7 Setup)

Member 1 has implemented an automatic DB adapter in `server/src/lib/prisma.js`. You do **NOT** need to edit backend controller code.

### Step 1: Install Prisma 7 & Driver Adapter in `server/`
```bash
cd server
npm install @prisma/client @prisma/adapter-pg pg dotenv
npm install -D prisma @prisma/config
```

### Step 2: Copy-Paste the Ready Schema into `server/prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model Profile {
  id             String     @id @default(uuid())
  platform       String
  handle         String
  displayName    String
  bio            String?
  profileUrl     String?
  followers      Int
  following      Int
  postsCount     Int
  accountAgeDays Int
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  analyses       Analysis[]

  @@index([platform, handle])
}

model Analysis {
  id             String   @id @default(uuid())
  profileId      String
  profile        Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  score          Int
  riskLevel      String
  threatCategory String
  indicators     Json     // Array of { rule, points, description }
  breakdown      Json     // 5-factor breakdown object
  createdAt      DateTime @default(now())

  @@index([profileId])
}
```

### Step 3: Configure `server/prisma.config.js`
In Prisma 7, CLI and migration URLs are configured in `prisma.config.js`:
```javascript
const { defineConfig, env } = require('@prisma/config');
require('dotenv').config();

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```
```

### Step 3: Configure Database & Migrate
1. Set `DATABASE_URL` in `server/.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/fpds_db?schema=public"
   ```
2. Run migration:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
3. Start the server (`npm start` or `npm run dev`). You should see:
   ```text
   [FPDS] Database: Connected via Prisma Client (PostgreSQL)
   ```

---

## 8. Verification & Test Suite

All tests can be executed from the `server/` folder:
```bash
cd server
npm test
```
**Expected Output:**
- `tests/api.test.js`: 14 passing tests
- `tests/riskEngine.test.js`: 21 passing tests
- **Total: 35 passing tests, 0 failures.**
