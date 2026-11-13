'use strict';

/**
 * FPDS — Express Application Factory
 * Member 1: sets up middleware, routes, and error handling.
 * Does NOT call app.listen() — that lives in server.js so this
 * module can be imported cleanly in tests.
 */

const express = require('express');
const cors    = require('cors');

const healthRouter   = require('./routes/health');
const profileRouter  = require('./routes/profiles');
const analysisRouter = require('./routes/analyses');
const statsRouter    = require('./routes/stats');
const scanRouter     = require('./routes/scan');
const errorHandler   = require('./middleware/errorHandler');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────

// Allow the frontend dev server (python http.server on :8080) to call our API.
// In production this origin list should come from an env variable.
const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5500',  // VS Code Live Server default
  'http://127.0.0.1:5500',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no Origin header (curl, Postman, same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Routes ────────────────────────────────────────────────────────────────────

app.use('/health',       healthRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/analyses', analysisRouter);
app.use('/api/stats',    statsRouter);
app.use('/api/scan',     scanRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

// Global error handler (must have 4 params)
app.use(errorHandler);

module.exports = app;

