# FPDS — Backend Reference (Member 1)

> Read this before touching anything inside `server/`.
> Last updated: Day 1 of 4-day sprint.

---

## What This Backend Does

REST API for the Fake Social Media Profile Detection System.
- Accepts profile data submitted by an investigator
- Runs a deterministic rule-based risk engine
- Returns a risk score (0–100), risk level, and indicator breakdown
- Stores profiles and analysis history
- Serves data in the exact shape the frontend dashboard expects

**Stack:** Node.js v24 · Express 5 · no authentication (MVP scope)  
**Database:** PostgreSQL via Prisma (Member 3) — in-memory store active until DB is ready  
**Branch:** `feature/backend`

---

## Folder Structure

```
server/
├── package.json              npm project + scripts
├── .env.example              copy to .env, fill DATABASE_URL
├── scripts/
│   └── seed.js               populate test data (run after server starts)
├── src/
│   ├── server.js             entry point — binds port, loads .env
│   ├── app.js                Express factory (middleware + routes)
│   ├── routes/
│   │   ├── health.js         GET /health
│   │   ├── profiles.js       POST|GET /api/profiles, /api/profiles/:id, /dashboard
│   │   ├── analyses.js       GET /api/analyses/:id
│   │   ├── stats.js          GET /api/stats
│   │   └── scan.js           POST /api/scan  ← main entry for quickScan form
│   ├── controllers/
│   │   ├── profileController.js    create / list / dashboard / getOne
│   │   ├── analysisController.js   analyze / listForProfile / getOne
│   │   ├── statsController.js      getStats
│   │   └── scanController.js       scan (create + analyze in one shot)
│   ├── services/
│   │   └── riskEngine.js     PURE FUNCTION — no DB, no Express deps
│   ├── middleware/
│   │   ├── validate.js       input validation → 422 on bad data
│   │   └── errorHandler.js   global Express error handler
│   ├── lib/
│   │   ├── prisma.js         DB adapter — swap PRISMA_CLIENT_PATH to go live
│   │   └── inMemoryStore.js  dev fallback when Prisma not configured
│   └── utils/
│       └── formatters.js     maps DB records → frontend dashboard shape
└── tests/
    └── riskEngine.test.js    21 unit tests (node --test)
```

---

## How to Run

```bash
cd server
cp .env.example .env        # first time only
node src/server.js          # start on :3000
# or
node --watch src/server.js  # auto-reload on save

# seed test data (server must be running)
node scripts/seed.js
```

---

## All API Endpoints

Base URL: `http://localhost:3000`  
All bodies and responses: JSON

### Health
```
GET /health
→ { status: ok, timestamp, version }
```

### Quick Scan (use this for the dashboard form)
```
POST /api/scan
Body (minimum): { handle, platform }
Body (full):    { handle, platform, displayName, followers, following, postsCount, accountAgeDays, bio }
→ 201 { investigation: <frontend-ready investigation object> }
→ 422 { error, details[] }
```
This is the **one-shot endpoint** Member 2's quickScan form calls.
Returns an `investigation` object that is drop-in compatible with `FPDS_MOCK_DATA.investigations` items.

### Profiles
```
POST /api/profiles
Body: { platform, handle, displayName, followers, following, postsCount, accountAgeDays, bio? }
→ 201 { profile }

GET /api/profiles
→ 200 { profiles: [ { ...profile, latestAnalysis: null | { score, riskLevel } } ] }

GET /api/profiles/dashboard
→ 200 { investigations: [ <frontend-ready investigation objects> ] }
← use this to populate the investigations table on page load

GET /api/profiles/:id
→ 200 { profile } | 404

POST /api/profiles/:id/analyze
→ 201 { analysis, investigation }

GET /api/profiles/:id/analyses
→ 200 { analyses: [ { id, score, riskLevel, threatCategory, createdAt } ] }
```

### Analyses
```
GET /api/analyses/:id
→ 200 { analysis: { ...fields, riskLevelCss, displaySignals[] } } | 404
```

### Stats (dashboard KPI cards)
```
GET /api/stats
→ 200 { stats: { totalScanned, highRiskDetected, botClusters, avgDetectionConfidence } }
```

---

## Risk Engine Rules

File: `src/services/riskEngine.js` — pure function, zero side effects.

| Rule Code | Condition | Points |
|-----------|-----------|--------|
| NEW_ACCOUNT | accountAgeDays < 30 | 20 |
| VERY_NEW_ACCOUNT | accountAgeDays < 7 | +10 |
| HIGH_FOLLOW_RATIO | following / followers > 10 | 25 |
| EXTREME_FOLLOW_RATIO | following / followers > 30 | +10 |
| ZERO_FOLLOWERS | followers === 0 | 15 |
| HIGH_POST_VOLUME_SHORT_LIFE | postsCount / accountAgeDays > 20 | 20 |
| LOW_POST_COUNT | postsCount < 5 | 10 |
| NO_BIO | bio empty or null | 10 |
| MASSIVE_FOLLOWING_COUNT | following > 5000 | 15 |
| ZERO_POSTS | postsCount === 0 | 15 |

Score capped at 100. Categories: 0–24 LOW · 25–49 MEDIUM · 50–74 HIGH · 75–100 CRITICAL

> ⚠️ Scores are investigation leads only — not proof an account is fake.

---

## Frontend Shape

`GET /api/profiles/dashboard` and `POST /api/scan` return objects with these exact fields
that map to the existing `dashboard.js` DOM element IDs:

| Field | DOM target |
|-------|-----------|
| id | `#investigationsTableBody tr data-id` |
| platformName | platform column |
| avatarInitials | `.profile-avatar` |
| riskScore | `#inspectorScoreNum`, progress bar |
| riskLevel | CSS class (lowercase: critical/high/medium/low) |
| threatCategory | `#inspectorScoreBadge` |
| displayName | `#inspectorDisplayName` |
| handle | `#inspectorHandle` |
| accountAge | `#inspectorAccountAge` |
| followers / following | `#inspectorFollowers` |
| signals[] | `#inspectorSignalsList` |
| breakdown.metadataAnomaly | `#factorMetadataBar` |
| breakdown.behavioralBurstRate | `#factorBurstBar` |
| breakdown.networkClusterDensity | `#factorNetworkBar` |
| breakdown.linguisticScripting | `#factorScriptingBar` |
| breakdown.avatarAuthenticity | `#factorAvatarBar` |

---

## Switching from In-Memory → Real Database (Day 3)

When Member 3 provides the Prisma schema and generated client:

1. Open `src/lib/prisma.js`
2. Set the `PRISMA_CLIENT_PATH` constant to the generated client path
3. Add `DATABASE_URL` to your `.env` file
4. Done — no changes needed in controllers, routes, or the risk engine

---

## Tests

```bash
cd server && node --test tests/
# 21/21 passing — risk engine unit tests
```

---

## What Is NOT Implemented (MVP scope)

- Authentication / sessions
- Real social platform API calls
- ML / GAN / NLP / image analysis
- PDF report generation (Member 3's area)
- Duplicate handle detection
- Pagination on list endpoints
