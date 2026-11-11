# FPDS — Full Codebase Reference

> Read this before starting any work on this repository.
> For AI agents: read this file first, then read the specific sub-document for your area.

---

## Project Overview

**Fake Social Media Profile Detection and Reporting System (FPDS)**
University ASD (Advanced Software Development) Capstone — 4-day sprint

An investigation support tool that lets a forensic analyst submit a social media
profile, receive a rule-based risk score (0–100), and view which signals contributed.

> ⚠️ Risk scores are investigation leads only. They do NOT prove a profile is fake.

---

## Team & Ownership

| Member | Area | Branch |
|--------|------|--------|
| Member 1 | Express API, risk engine, profile/analysis endpoints | `feature/backend` |
| Member 2 | Frontend UI, dashboard wiring, API integration | (coordinate) |
| Member 3 | PostgreSQL setup, Prisma schema + migrations, PDF reports | (coordinate) |

**Branch policy:** never commit directly to `main`. Open a PR when ready.

---

## Repository Structure

```
Fake-Profile-Analyser_/
├── CODEBASE.md              ← you are here
├── README.md                project overview (academic description)
├── .gitignore               node_modules, .env, .DS_Store, *.log
│
├── client/                  ← FRONTEND (Member 2 owns this)
│   ├── index.html           portal landing page
│   ├── dashboard.html       SOC investigation dashboard (main UI)
│   ├── css/
│   │   ├── style.css        design tokens, layout shell
│   │   ├── components.css   buttons, badges, cards, modals
│   │   └── dashboard.css    investigation grid, inspector panel
│   └── js/
│       ├── mock-data.js     FPDS_MOCK_DATA — all test data lives here (pre-backend)
│       ├── app.js           Lucide icon init, toast notifications, global search
│       ├── navigation.js    sidebar, modal triggers, keyboard shortcuts
│       └── dashboard.js     KPI counters, investigations table, profile inspector
│
└── server/                  ← BACKEND (Member 1 owns this)
    ├── BACKEND.md           detailed backend reference  ← read next
    ├── package.json
    └── src/ ...             Express app, risk engine, API routes
```

---

## Current State (Day 1 complete)

### Client — 100% frontend-only, no API calls yet

The dashboard runs entirely from `mock-data.js` (a frozen JS object).
No `fetch()` calls exist. The frontend needs to be wired to the backend by Member 2.

**Key frontend facts an agent must know:**
- `FPDS_MOCK_DATA.investigations[]` → array of investigation objects rendered in the table
- `dashboard.js` reads specific field names (see BACKEND.md → Frontend Shape table)
- Risk level CSS classes are **lowercase**: `critical` / `high` / `medium` / `low`
- The Quick Scan form (`#quickScanForm`) currently synthesises fake data client-side
- Do NOT modify frontend JS independently — coordinate with Member 2

**To run the frontend:**
```bash
cd client
python3 -m http.server 8080
# open http://localhost:8080/dashboard.html
```

### Server — backend complete, in-memory store active

All API endpoints are implemented and tested. No database yet (Member 3 pending).
An in-memory store provides full functionality — data resets on server restart.

**Key backend facts an agent must know:**
- `POST /api/scan` → one-shot: create profile + analyze → returns investigation object
- `GET /api/profiles/dashboard` → all profiles as investigation objects (replaces mock data)
- `GET /api/stats` → KPI numbers for the 4 stat cards
- Risk engine is a pure function in `src/services/riskEngine.js` — deterministic, testable
- DB is wired via `src/lib/prisma.js` — set `PRISMA_CLIENT_PATH` to switch from in-memory to Prisma
- **Never modify the Prisma schema independently** — that is Member 3's area

**To run the backend:**
```bash
cd server
cp .env.example .env     # first time
node src/server.js       # → http://localhost:3000
node scripts/seed.js     # populate test data (server must be running)
```

---

## API Quick Reference

| Method | Path | Purpose |
|--------|------|---------|
| GET | /health | server alive check |
| POST | /api/scan | quickScan form → investigation shape |
| GET | /api/profiles/dashboard | all profiles → investigation shapes |
| GET | /api/stats | KPI card numbers |
| POST | /api/profiles | create profile |
| GET | /api/profiles | list profiles |
| GET | /api/profiles/:id | single profile |
| POST | /api/profiles/:id/analyze | run risk engine |
| GET | /api/profiles/:id/analyses | analysis history |
| GET | /api/analyses/:id | single analysis |

Full request/response format → see `server/BACKEND.md`

---

## Frontend ↔ Backend Integration (Member 2 task)

### On page load — replace mock investigations:
```js
// In dashboard.js initDashboard(), replace FPDS_MOCK_DATA.investigations with:
const res = await fetch('http://localhost:3000/api/profiles/dashboard');
const { investigations } = await res.json();
// investigations[] is drop-in compatible — same field names as FPDS_MOCK_DATA.investigations
```

### Quick Scan form submission — replace the fake setTimeout:
```js
// In handleQuickScanSubmit(), replace the setTimeout block with:
const res = await fetch('http://localhost:3000/api/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ handle: targetQuery, platform })
});
const { investigation } = await res.json();
investigations.unshift(investigation);
renderInvestigationsTable();
selectInvestigation(investigation.id);
```

### KPI stats cards:
```js
const { stats } = await (await fetch('http://localhost:3000/api/stats')).json();
animateMetricNumber('statTotalScanned', stats.totalScanned);
animateMetricNumber('statHighRisk', stats.highRiskDetected);
// etc.
```

---

## Prisma Integration (Member 3 task)

Member 3 needs to provide:
1. A PostgreSQL database with this connection string format: `postgresql://user:pass@host:5432/fpds_db`
2. Prisma schema with `Profile` and `Analysis` models (see BACKEND.md → Required Models)
3. The path to the Prisma generated client (after running `npx prisma generate`)

Then Member 1 sets `PRISMA_CLIENT_PATH` in `server/src/lib/prisma.js` — no other changes needed.

---

## What Is NOT In Scope (4-day MVP)

- User authentication or sessions
- Real social platform API calls (Twitter/Instagram/etc.)
- ML models, GAN detection, NLP analysis, image processing
- Blockchain or advanced forensics
- PDF report generation is Member 3's area unless reallocated
- Pagination on list endpoints
