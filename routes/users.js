'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../models/db');
const { requireRole } = require('../middleware/authJWT');

const router = express.Router();

/* ===== Helpers ===== */
function generateUserId() {
  const yyyy = new Date().getFullYear();
  const six = Math.floor(100000 + Math.random() * 900000);
  return `${yyyy}-${six}`;
}

function generatePassword() {
  // 8 karakter, hindari karakter ambigu (0/O/1/l/I)
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

const VALID_ROLES = ['siswa', 'guru', 'admin'];
const PAKET_CODE_RE = /^[A-Z]$/;

async function validatePaketCodes(codes) {
  // codes: array of strings; validate format then ensure each exists in `packages`.
  if (!Array.isArray(codes) || codes.length === 0) return [];
  for (const c of codes) {
    if (typeof c !== 'string' || !PAKET_CODE_RE.test(c)) {
      const err = new Error(`Kode paket tidak valid: "${c}". Harus 1 huruf kapital A-Z.`);
      err.status = 400;
      throw err;
    }
  }
  const placeholders = codes.map(() => '?').join(',');
  const [rows] = await pool.query(
    `SELECT code FROM packages WHERE code IN (${placeholders})`,
    codes,
  );
  const found = new Set(rows.map(r => r.code));
  const missing = codes.filter(c => !found.has(c));
  if (missing.length) {
    const err = new Error(`Paket belum terdaftar: ${missing.join(', ')}`);
    err.status = 400;
    throw err;
  }
  return codes;
}

function parseJsonField(v) {
  if (v == null) return null;
  if (typeof v === 'object') return v; // mysql2 auto-parses JSON columns
  try { return JSON.parse(v); } catch (e) { return null; }
}

function rowToUser(r) {
  return {
    id: r.id,
    user_id: r.user_id,
    name: r.name,
    email: r.email,
    role: r.role,
    paket: parseJsonField(r.paket),
    desa: r.desa,
    kecamatan: r.kecamatan,
    kota: r.kota,
    kelas: r.kelas,
    usia: r.usia,
    hp: r.hp,
    mapel: r.mapel,
    is_active: !!r.is_active,
    is_seed: !!r.is_seed,
    created_at: r.created_at,
  };
}

/* ===== Endpoints ===== */

/** GET /api/users — list (admin only) */
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const { role, paket, q } = req.query;
    const where = [];
    const args = [];
    if (role && VALID_ROLES.includes(role)) { where.push('role = ?'); args.push(role); }
    if (paket) { where.push('JSON_CONTAINS(paket, JSON_QUOTE(?))'); args.push(paket); }
    if (q) {
      where.push('(name LIKE ? OR user_id LIKE ? OR email LIKE ? OR desa LIKE ?)');
      const like = `%${q}%`;
      args.push(like, like, like, like);
    }
    const sql = `SELECT * FROM users ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`;
    const [rows] = await pool.query(sql, args);
    return res.json({ users: rows.map(rowToUser), count: rows.length });
  } catch (err) {
    console.error('[users.list]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** GET /api/users/:id */
router.get('/:id', requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'NotFound' });
    return res.json({ user: rowToUser(rows[0]) });
  } catch (err) {
    console.error('[users.get]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** POST /api/users — create
 *  Body: { name, role, email?, paket?, desa?, kecamatan?, kota?, kelas?, usia?, hp?, mapel?, password? }
 *  Returns: { user, plain_password } — password plaintext hanya dikembalikan sekali!
 */
router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const b = req.body || {};
    const role = (b.role || '').toString();
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: 'BadRequest', message: 'role harus siswa | guru | admin' });
    }
    const name = (b.name || '').toString().trim();
    if (!name) return res.status(400).json({ error: 'BadRequest', message: 'Nama wajib diisi' });

    const email = (b.email || '').toString().trim() || null;
    if (role === 'admin' && !email) {
      return res.status(400).json({ error: 'BadRequest', message: 'Email wajib untuk admin' });
    }

    let paket = null;
    if (role === 'siswa') {
      if (!b.paket) return res.status(400).json({ error: 'BadRequest', message: 'Paket wajib untuk siswa' });
      paket = await validatePaketCodes([String(b.paket)]);
    } else if (role === 'guru') {
      const arr = Array.isArray(b.paket) ? b.paket : (b.paket ? [b.paket] : []);
      if (arr.length === 0) {
        return res.status(400).json({ error: 'BadRequest', message: 'Pilih minimal 1 paket untuk guru' });
      }
      paket = await validatePaketCodes(arr.map(String));
    }

    if (role === 'siswa' && !((b.desa || '').toString().trim())) {
      return res.status(400).json({ error: 'BadRequest', message: 'Nama desa wajib untuk siswa' });
    }

    // Generate unique user_id
    let user_id;
    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = generateUserId();
      const [exists] = await pool.query('SELECT id FROM users WHERE user_id = ? LIMIT 1', [candidate]);
      if (exists.length === 0) { user_id = candidate; break; }
    }
    if (!user_id) {
      return res.status(500).json({ error: 'ServerError', message: 'Gagal generate user_id unik' });
    }

    if (email) {
      const [dup] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
      if (dup.length > 0) {
        return res.status(409).json({ error: 'Conflict', message: 'Email sudah dipakai' });
      }
    }

    const plainPassword = (b.password && String(b.password).length >= 6) ? String(b.password) : generatePassword();
    const password_hash = await bcrypt.hash(plainPassword, 10);

    const [result] = await pool.query(
      `INSERT INTO users
        (user_id, name, email, role, paket, desa, kecamatan, kota, kelas, usia, hp, mapel,
         password_hash, is_active, is_seed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
      [
        user_id,
        name,
        email,
        role,
        paket ? JSON.stringify(paket) : null,
        (b.desa || '').toString().trim() || null,
        (b.kecamatan || '').toString().trim() || null,
        (b.kota || '').toString().trim() || null,
        (b.kelas || '').toString().trim() || null,
        b.usia ? parseInt(b.usia, 10) : null,
        (b.hp || '').toString().trim() || null,
        (b.mapel || '').toString().trim() || null,
        password_hash,
      ],
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    return res.status(201).json({
      user: rowToUser(rows[0]),
      plain_password: plainPassword, // dikembalikan sekali — frontend tampilkan di modal sukses
    });
  } catch (err) {
    console.error('[users.create]', err);
    const status = err.status || 500;
    return res.status(status).json({ error: status === 400 ? 'BadRequest' : 'ServerError', message: err.message });
  }
});

/** PUT /api/users/:id — update (kecuali password) */
router.put('/:id', requireRole('admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const b = req.body || {};
    const fields = [];
    const args = [];
    const allow = ['name', 'email', 'desa', 'kecamatan', 'kota', 'kelas', 'usia', 'hp', 'mapel', 'is_active'];
    for (const k of allow) {
      if (b[k] !== undefined) {
        fields.push(`${k} = ?`);
        args.push(k === 'is_active' ? (b[k] ? 1 : 0) : (b[k] === '' ? null : b[k]));
      }
    }
    if (b.paket !== undefined) {
      let paketArr = null;
      if (b.paket) {
        const raw = Array.isArray(b.paket) ? b.paket : [b.paket];
        paketArr = await validatePaketCodes(raw.map(String));
      }
      fields.push('paket = ?');
      args.push(paketArr ? JSON.stringify(paketArr) : null);
    }
    if (fields.length === 0) {
      return res.status(400).json({ error: 'BadRequest', message: 'Tidak ada field yang diubah' });
    }
    args.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, args);
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'NotFound' });
    return res.json({ user: rowToUser(rows[0]) });
  } catch (err) {
    console.error('[users.update]', err);
    const status = err.status || 500;
    return res.status(status).json({ error: status === 400 ? 'BadRequest' : 'ServerError', message: err.message });
  }
});

/** POST /api/users/:id/reset-password — generate password baru */
router.post('/:id/reset-password', requireRole('admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const newPw = generatePassword();
    const hash = await bcrypt.hash(newPw, 10);
    const [r] = await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'NotFound' });
    return res.json({ ok: true, plain_password: newPw });
  } catch (err) {
    console.error('[users.reset-pw]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** DELETE /api/users/:id */
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [exists] = await pool.query('SELECT id, is_seed FROM users WHERE id = ?', [id]);
    if (exists.length === 0) return res.status(404).json({ error: 'NotFound' });
    if (exists[0].is_seed) {
      return res.status(403).json({ error: 'Forbidden', message: 'Akun bawaan tidak bisa dihapus' });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[users.delete]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

module.exports = router;
