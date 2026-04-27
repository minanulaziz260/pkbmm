'use strict';

const express = require('express');
const { pool } = require('../models/db');
const { requireRole } = require('../middleware/authJWT');

const router = express.Router();

/** GET /api/packages */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*,
              (SELECT COUNT(*) FROM users u WHERE u.role='siswa' AND JSON_CONTAINS(u.paket, JSON_QUOTE(p.code))) AS student_count,
              (SELECT COUNT(*) FROM subjects s WHERE s.package_code = p.code) AS subject_count
         FROM packages p
        ORDER BY p.code ASC`,
    );
    return res.json({ packages: rows });
  } catch (err) {
    console.error('[packages.list]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** GET /api/packages/:code */
router.get('/:code', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM packages WHERE code = ? LIMIT 1', [req.params.code]);
    if (rows.length === 0) return res.status(404).json({ error: 'NotFound' });
    return res.json({ package: rows[0] });
  } catch (err) {
    console.error('[packages.get]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** POST /api/packages — admin only */
router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const { code, label, description, color } = req.body || {};
    if (!code || !label) {
      return res.status(400).json({ error: 'BadRequest', message: 'code dan label wajib' });
    }
    const c = String(code).toUpperCase().trim();
    if (!/^[A-Z]$/.test(c)) {
      return res.status(400).json({ error: 'BadRequest', message: 'code harus 1 huruf kapital (A-Z)' });
    }
    try {
      await pool.query(
        `INSERT INTO packages (code, label, description, color) VALUES (?, ?, ?, ?)`,
        [c, label, description || null, color || '#10b981'],
      );
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Conflict', message: `Paket ${c} sudah ada` });
      }
      throw e;
    }
    const [rows] = await pool.query('SELECT * FROM packages WHERE code = ?', [c]);
    return res.status(201).json({ package: rows[0] });
  } catch (err) {
    console.error('[packages.create]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** PUT /api/packages/:code — admin only */
router.put('/:code', requireRole('admin'), async (req, res) => {
  try {
    const { label, description, color } = req.body || {};
    const fields = [];
    const args = [];
    if (label !== undefined)       { fields.push('label = ?');       args.push(label); }
    if (description !== undefined) { fields.push('description = ?'); args.push(description || null); }
    if (color !== undefined)       { fields.push('color = ?');       args.push(color); }
    if (fields.length === 0) {
      return res.status(400).json({ error: 'BadRequest', message: 'Tidak ada field yang diubah' });
    }
    args.push(req.params.code);
    const [r] = await pool.query(`UPDATE packages SET ${fields.join(', ')} WHERE code = ?`, args);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'NotFound' });
    const [rows] = await pool.query('SELECT * FROM packages WHERE code = ?', [req.params.code]);
    return res.json({ package: rows[0] });
  } catch (err) {
    console.error('[packages.update]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** DELETE /api/packages/:code — admin only */
router.delete('/:code', requireRole('admin'), async (req, res) => {
  try {
    const code = req.params.code;
    const [students] = await pool.query(
      `SELECT COUNT(*) AS n FROM users WHERE role='siswa' AND JSON_CONTAINS(paket, JSON_QUOTE(?))`,
      [code],
    );
    if (students[0].n > 0) {
      return res.status(409).json({
        error: 'Conflict',
        message: `Paket ${code} masih dipakai ${students[0].n} siswa — pindahkan dulu`,
      });
    }
    const [r] = await pool.query('DELETE FROM packages WHERE code = ?', [code]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'NotFound' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('[packages.delete]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

module.exports = router;
