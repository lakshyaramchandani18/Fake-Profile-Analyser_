# Fake Social Media Profile Detection and Reporting System (FPDS)

An enterprise-grade cybersecurity investigation interface and forensics intelligence system developed for an Academic Software Development (ASD) Capstone Project.

[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express 5](https://img.shields.io/badge/Express-v5.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-v7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tests](https://img.shields.io/badge/Tests-41%2F41%20Passing-success)](file:///Users/sehrawatritik2007mac.com/Downloads/asd_major_project/server/tests)

---

## 🛡️ Executive Summary

FPDS delivers digital forensics investigators and threat analysts a multi-layered detection platform to uncover synthetic personas, coordinated bot syndicates, astroturfing campaigns, and deceptive impersonation accounts across major social platforms (Twitter/X, Instagram, LinkedIn, and Facebook).

### Core Forensic Pillars
1. **Visual & GAN Face Forensics**: StyleGAN artifact detection, eye-alignment symmetry verification, and reverse perceptual hashing.
2. **Temporal Activity Cadence**: Poisson process analysis of posting frequency, circadian sleep/wake cycle deviation, and automated sub-second bursts.
3. **Ego-Graph Topology**: Reciprocal follower-following subgraphs detecting artificial follower injection farms and dense astroturfing clique rings.
4. **NLP Stylometry & Scripting**: Lexical entropy measurement, repeated payload clustering, and sentiment manipulation detection.
5. **Multi-Factor Risk Synthesis**: Normalized 0–100 Threat Index calculated via weighted Bayesian anomaly markers.

> ⚠️ **Core Domain Principle**: Risk scores (0–100) are investigation leads for forensic analysts, NOT legal proof of inauthenticity.

---

## 🏗️ System Architecture

The system follows a decoupled, three-tier forensic architecture consisting of a lightweight Cyber SOC Frontend, an Express 5 REST API with a pure-function risk engine, and a PostgreSQL database managed via Prisma ORM.

```mermaid
flowchart TD
    subgraph ClientLayer["Tier 1: SOC Frontend (Client)"]
        UI["SOC Dashboard UI (Vanilla ES6 + Cyber CSS)"]
        QS["Quick Scan Launcher"]
        Table["Investigations Table & KPI Stream"]
        Inspector["Forensics Deep-Dive Inspector"]
    end

    subgraph APILayer["Tier 2: Application API (Server)"]
        Router["Express 5 Router & Middleware"]
        Val["Validation & Sanitization Layer"]
        Ctrl["Controllers (Profile, Scan, Analysis, Stats)"]
        Engine["Deterministic Risk Engine (10 Rules)"]
        Adapter["Prisma DB Adapter (Auto Fallback)"]
    end

    subgraph DBLayer["Tier 3: Persistence Layer (Database)"]
        PrismaClient["Prisma Client ORM"]
        Postgres[("PostgreSQL Database (fpds_db)")]
        Tables["Tables: Profile, Analysis, _prisma_migrations"]
    end

    UI -->|"HTTP REST API Requests"| Router
    QS -->|"POST /api/scan"| Router
    Router --> Val --> Ctrl
    Ctrl --> Engine
    Engine -->|"Score, Indicators, Breakdown"| Ctrl
    Ctrl --> Adapter
    Adapter --> PrismaClient
    PrismaClient --> Postgres
    Postgres --> Tables
    Ctrl -->|"Investigation JSON"| Table
    Ctrl -->|"Detailed Analysis JSON"| Inspector
```

---

## 🔄 End-to-End Forensic Analysis Flow

When an investigator submits a handle or batch profile for evaluation, the data travels through sanitization, deterministic risk scoring, relational persistence, and dashboard telemetry generation:

```mermaid
flowchart TD
    Start(["Analyst Submits Profile Data"]) --> Validate{"Validate Schema & Bounds"}
    Validate -- "Invalid Data" --> ErrReturn["Return 422 Unprocessable Entity"]
    Validate -- "Valid Payload" --> RiskCalc["Run Risk Engine (10 Deterministic Rules)"]

    subgraph RulesEngine["Risk Engine Scoring (0-100)"]
        R1["Account Age Checks (<30d, <7d)"]
        R2["Follower-to-Following Ratio (>10x, >30x)"]
        R3["Zero Follower Anomaly"]
        R4["Burst Posting Velocity (>20 posts/day)"]
        R5["Empty Bio / Missing Profile Attributes"]
    end

    RiskCalc --> RulesEngine
    RulesEngine --> Synthesize["Cap Score at 100 & Assign Threat Level<br/>(LOW, MEDIUM, HIGH, CRITICAL)"]
    Synthesize --> PersistDB["Persist Profile & Analysis in PostgreSQL via Prisma"]
    PersistDB --> Format["Format into Frontend-Ready Investigation Object"]
    Format --> Response(["Return 201 Created to SOC Dashboard"])
```

---

## ⏱️ Sequence Diagram: Ingestion & Telemetry

```mermaid
sequenceDiagram
    autonumber
    actor Analyst as Forensic Analyst
    participant UI as SOC Dashboard (Client)
    participant API as Express API Server
    participant Engine as Risk Engine Service
    participant Prisma as Prisma ORM Adapter
    participant DB as PostgreSQL Database

    Analyst->>UI: Input Profile Handle & Metrics
    UI->>API: POST /api/scan { platform, handle, ... }
    API->>API: Validate input bounds (validate.js)
    API->>Engine: scoreProfile(profilePayload)
    Engine-->>API: Return { score, riskLevel, indicators, breakdown }
    API->>Prisma: db.profile.create({ data: { ..., analyses: { create } } })
    Prisma->>DB: INSERT INTO Profile & INSERT INTO Analysis
    DB-->>Prisma: Confirm Rows Committed
    Prisma-->>API: Return Saved Entities
    API->>API: toInvestigationShape(profile, analysis)
    API-->>UI: 201 Created { investigation, analysis }
    UI->>UI: Update Live Investigations Table & KPI Cards
    UI-->>Analyst: Render Threat Breakdown & Indicators
```

---

## 🗄️ Database Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    Profile ||--o{ Analysis : "has many (1:N)"

    Profile {
        String id PK "UUIDv4 Primary Key"
        String platform "Social Platform Name"
        String handle "Unique Platform Handle"
        String displayName "Account Display Name"
        String bio "Account Biography"
        String profileUrl "Link to Original Profile"
        Int followers "Total Follower Count"
        Int following "Total Following Count"
        Int postsCount "Total Posts Published"
        Int accountAgeDays "Days Since Registration"
        DateTime createdAt "Ingestion Timestamp"
        DateTime updatedAt "Record Update Timestamp"
    }

    Analysis {
        String id PK "UUIDv4 Primary Key"
        String profileId FK "References Profile(id) ON DELETE CASCADE"
        Int score "Synthesized Threat Score (0-100)"
        String riskLevel "LOW | MEDIUM | HIGH | CRITICAL"
        String threatCategory "Assigned Threat Category"
        Json indicators "Triggered Risk Indicators Array"
        Json breakdown "5-Dimensional Radar Scores"
        DateTime createdAt "Analysis Timestamp"
    }
```

---

## 💻 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend UI** | HTML5 Semantic Architecture, Custom Cyber CSS3 Design System, Pure Vanilla JavaScript (ES6+), Lucide Icons |
| **Backend API** | Node.js (v20+), Express 5, CORS, Dotenv, Built-in `node:test` Runner |
| **ORM & Database** | Prisma ORM v7 (`@prisma/client`, `@prisma/adapter-pg`, `@prisma/config`), PostgreSQL 16+ |
| **Architecture** | Deterministic Pure-Function Risk Scoring, Cascade Foreign Keys, Auto-Switching In-Memory Fallback |

---

## 📁 Repository Structure

```text
Fake-Profile-Analyser_/
├── CODEBASE.md                     # Master architecture reference & sprint log
├── README.md                       # Complete project overview & setup guide
├── .gitignore                      # Environment, logs, and node_modules exclusions
│
├── client/                         # FRONTEND SOC APPLICATION
│   ├── index.html                  # University ASD portal overview & quick scan launcher
│   ├── dashboard.html              # SOC Forensics Command Center
│   ├── favicon.svg                 # Application cybersecurity badge icon
│   ├── css/                        # Design tokens, cyber components, responsive grid
│   │   ├── style.css
│   │   ├── components.css
│   │   └── dashboard.css
│   ├── js/                         # Client controllers and telemetry
│   │   ├── app.js                  # Icon initialization, heartbeat ping, toasts
│   │   ├── navigation.js           # Responsive sidebar drawer, modal triggers
│   │   ├── dashboard.js            # KPI animations, filterable table & inspector
│   │   └── mock-data.js            # Initial dataset fallback
│   └── assets/images/              # Vector assets and badge imagery
│
└── server/                         # BACKEND API & PERSISTENCE
    ├── BACKEND.md                  # Comprehensive API documentation
    ├── package.json                # Project dependencies, scripts & engines
    ├── .env.example                # Template for PORT and DATABASE_URL
    ├── prisma.config.js            # Prisma 7 CLI & migration configuration
    ├── docs/
    │   └── DATABASE.md             # In-depth PostgreSQL & Prisma 7 architectural guide
    ├── prisma/
    │   ├── schema.prisma           # Prisma data models (Profile & Analysis)
    │   └── migrations/             # Applied PostgreSQL migration files
    ├── scripts/
    │   ├── seed.js                 # Unified master seeder (Prisma ORM & in-memory)
    │   └── verify-db.js            # Database health & diagnostic reporter
    ├── src/
    │   ├── server.js               # Entry point with graceful shutdown handling
    │   ├── app.js                  # Express application factory & middleware
    │   ├── routes/                 # REST endpoints (health, profiles, scan, stats, report)
    │   ├── controllers/            # Request handlers and response mapping
    │   ├── services/
    │   │   └── riskEngine.js       # Pure-function 10-rule threat scoring engine
    │   ├── middleware/             # Schema validation and global error handler
    │   ├── lib/
    │   │   ├── prisma.js           # Auto-switching PostgreSQL (Prisma 7 adapter) / inMemory
    │   │   └── inMemoryStore.js    # Zero-config development fallback store
    │   └── utils/
    │       └── formatters.js       # Transforms DB records to dashboard shape & Crime Branch dossier
    └── tests/
        ├── api.test.js             # Integration tests for REST endpoints & reports
        ├── prisma.test.js          # Prisma ORM CRUD & cascade integration tests
        └── riskEngine.test.js      # 21 unit tests for forensic risk engine
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20.0.0 or higher
- **PostgreSQL**: v16+ (Local via Homebrew, Docker, or Cloud via [Neon](https://neon.tech) / [Supabase](https://supabase.com))

---

### 2. Database & Backend Setup

Navigate to the `server/` directory and install dependencies:

```bash
cd server
npm install
```

Create your `.env` configuration:

```bash
cp .env.example .env
```

Edit `.env` to point to your PostgreSQL database:

```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/fpds_db?schema=public"
NODE_ENV=development
```

Run database migrations to generate tables:

```bash
npx prisma migrate dev --name init
```

Verify that the database connection is live:

```bash
npm run db:verify
```

Seed the database with sample forensic telemetry:

```bash
npm run db:seed
```

Start the backend API server:

```bash
npm run dev
# Server boots on http://localhost:3000
```

---

### 3. Launch Frontend SOC Dashboard

In a separate terminal, serve the `client/` directory with any static HTTP server:

```bash
cd client
python3 -m http.server 8080
```

Open your browser:
- **SOC Command Center Dashboard**: [http://localhost:8080/dashboard.html](http://localhost:8080/dashboard.html)
- **Portal Landing Page**: [http://localhost:8080/index.html](http://localhost:8080/index.html)
- **Backend API Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

---

## 🛠️ Database Utility Commands

Inside `server/`:

| Command | Action |
|---------|--------|
| `npm run db:verify` | Pings database, checks latency, and prints record diagnostics |
| `npm run db:seed` | Populates sample profiles and threat analyses via Prisma ORM |
| `npm run db:reset` | Resets PostgreSQL schema and runs fresh migrations and seeds |
| `npm run prisma:studio` | Launches visual Prisma Studio GUI on `http://localhost:5555` |
| `npm run prisma:migrate` | Runs pending migrations in development |
| `npm test` | Runs complete 41-test integration and unit test suite |

---

## 📜 Academic Project Scope

Developed as part of the **Advanced Software Development (ASD)** Capstone Curriculum for automated profile threat intelligence, synthetic persona analysis, and digital forensics reporting.
