'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const { ping } = require('./models/db');
const { authJWT } = require('./middleware/authJWT');

const authRoutes       = require('./routes/auth');
const usersRoutes      = require('./routes/users');
const packagesRoutes   = require('./routes/packages');
const curriculumRoutes = require('./routes/curriculum');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Static frontend
app.use(express.static(path.join(__dirname, 'public')));

/* ========== Public API ========== */
app.use('/api/auth', authRoutes);

/* ========== Healthcheck ========== */
app.get('/api/health', async (req, res) => {
  try {
    const ok = await ping();
    res.json({ ok, db: ok ? 'connected' : 'disconnected' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ========== JWT-protected API ========== */
app.use('/api/users',      authJWT, usersRoutes);
app.use('/api/packages',   authJWT, packagesRoutes);
app.use('/api/curriculum', authJWT, curriculumRoutes);

// Pass `me` after JWT
app.get('/api/me', authJWT, (req, res) => res.json({ user: req.user }));

/* ========== SPA-ish fallback: serve login.html for unknown HTML routes ========== */
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/dashboard',  (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/users',      (req, res) => res.sendFile(path.join(__dirname, 'public', 'users.html')));
app.get('/packages',   (req, res) => res.sendFile(path.join(__dirname, 'public', 'packages.html')));
app.get('/curriculum', (req, res) => res.sendFile(path.join(__dirname, 'public', 'curriculum.html')));

/* ========== Error handler ========== */
app.use((err, req, res, _next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ error: 'ServerError', message: err.message || 'Internal error' });
});

app.listen(PORT, () => {
  console.log(`PKBM MUGI SAE listening on http://0.0.0.0:${PORT}`);
});
