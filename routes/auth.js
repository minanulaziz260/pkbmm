'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../models/db');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/**
 * POST /api/auth/login
 * Body: { identifier, password }
 *   identifier = email atau user_id (YYYY-XXXXXX) atau nis (legacy)
 */
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if(!identifier || !password){
      return res.status(400).json({ error: 'BadRequest', message: 'identifier dan password wajib diisi' });
    }
    const ident = String(identifier).trim();
    const [rows] = await pool.query(
      `SELECT id, user_id, name, email, role, paket, password_hash, is_active
         FROM users
        WHERE email = ? OR user_id = ?
        LIMIT 1`,
      [ident, ident],
    );
    if(rows.length === 0){
      return res.status(401).json({ error: 'Unauthorized', message: 'ID atau password salah' });
    }
    const u = rows[0];
    if(!u.is_active){
      return res.status(403).json({ error: 'Forbidden', message: 'Akun nonaktif. Hubungi admin.' });
    }
    const ok = await bcrypt.compare(password, u.password_hash);
    if(!ok){
      return res.status(401).json({ error: 'Unauthorized', message: 'ID atau password salah' });
    }
    const payload = {
      id: u.id,
      user_id: u.user_id,
      name: u.name,
      email: u.email,
      role: u.role,
      paket: u.paket && typeof u.paket === 'string' ? (() => { try { return JSON.parse(u.paket); } catch (e) { return null; } })() : (u.paket || null),
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({
      token,
      expiresIn: JWT_EXPIRES_IN,
      user: payload,
    });
  } catch (err) {
    console.error('[auth/login]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/**
 * POST /api/auth/logout
 * JWT bersifat stateless — endpoint ini hanya formality.
 * Klien harus menghapus token dari localStorage.
 */
router.post('/logout', (req, res) => {
  return res.json({ ok: true, message: 'Logout berhasil — hapus token di klien' });
});

/**
 * GET /api/auth/me
 * Optional helper: butuh JWT, dipasang di server.js.
 */
router.get('/me', (req, res) => {
  return res.json({ user: req.user || null });
});

module.exports = router;
