'use strict';

const express = require('express');
const { pool } = require('../models/db');
const { requireRole } = require('../middleware/authJWT');

const router = express.Router();

/**
 * GET /api/curriculum
 * Query: ?package=A
 * Mengembalikan daftar mapel berikut hitungan materi & kuis.
 */
router.get('/', async (req, res) => {
  try {
    const where = [];
    const args = [];
    if (req.query.package) { where.push('s.package_code = ?'); args.push(req.query.package); }
    const sql = `
      SELECT s.*,
             (SELECT COUNT(*) FROM materials m WHERE m.subject_id = s.id) AS material_count,
             (SELECT COUNT(*) FROM quizzes  q WHERE q.subject_id = s.id) AS quiz_count
        FROM subjects s
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY s.package_code ASC, s.sort_order ASC, s.id ASC`;
    const [rows] = await pool.query(sql, args);
    return res.json({ subjects: rows });
  } catch (err) {
    console.error('[curriculum.list]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** GET /api/curriculum/:id — detail satu mapel + materi & kuis */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [subj] = await pool.query('SELECT * FROM subjects WHERE id = ?', [id]);
    if (subj.length === 0) return res.status(404).json({ error: 'NotFound' });
    const [materials] = await pool.query(
      'SELECT * FROM materials WHERE subject_id = ? ORDER BY sort_order ASC, id ASC',
      [id],
    );
    const [quizzes] = await pool.query(
      'SELECT id, subject_id, title, duration_minutes, total_questions, created_at FROM quizzes WHERE subject_id = ? ORDER BY id DESC',
      [id],
    );
    return res.json({ subject: subj[0], materials, quizzes });
  } catch (err) {
    console.error('[curriculum.get]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** POST /api/curriculum — buat mapel baru (admin/guru) */
router.post('/', requireRole('admin', 'guru'), async (req, res) => {
  try {
    const { package_code, name, icon, description, sort_order, color } = req.body || {};
    if (!package_code || !name) {
      return res.status(400).json({ error: 'BadRequest', message: 'package_code & name wajib' });
    }
    const [pkg] = await pool.query('SELECT code FROM packages WHERE code = ?', [package_code]);
    if (pkg.length === 0) {
      return res.status(400).json({ error: 'BadRequest', message: `Paket ${package_code} belum ada` });
    }
    const [r] = await pool.query(
      `INSERT INTO subjects (package_code, name, icon, description, sort_order, color)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [package_code, name, icon || '📘', description || null, parseInt(sort_order || 0, 10), color || '#10b981'],
    );
    const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [r.insertId]);
    return res.status(201).json({ subject: rows[0] });
  } catch (err) {
    console.error('[curriculum.create]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** PUT /api/curriculum/:id — update mapel */
router.put('/:id', requireRole('admin', 'guru'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const body = req.body || {};
    const fields = [];
    const args = [];
    const allow = ['name', 'icon', 'description', 'sort_order', 'color'];
    for (const k of allow) {
      if (body[k] !== undefined) {
        fields.push(`${k} = ?`);
        args.push(k === 'sort_order' ? parseInt(body[k], 10) : body[k]);
      }
    }
    if (fields.length === 0) {
      return res.status(400).json({ error: 'BadRequest', message: 'Tidak ada field yang diubah' });
    }
    args.push(id);
    const [r] = await pool.query(`UPDATE subjects SET ${fields.join(', ')} WHERE id = ?`, args);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'NotFound' });
    const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [id]);
    return res.json({ subject: rows[0] });
  } catch (err) {
    console.error('[curriculum.update]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** DELETE /api/curriculum/:id */
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [r] = await pool.query('DELETE FROM subjects WHERE id = ?', [id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'NotFound' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('[curriculum.delete]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/* ===== Materials nested di subject ===== */

/** POST /api/curriculum/:id/materials */
router.post('/:id/materials', requireRole('admin', 'guru'), async (req, res) => {
  try {
    const subject_id = parseInt(req.params.id, 10);
    const { title, body, sort_order } = req.body || {};
    if (!title) return res.status(400).json({ error: 'BadRequest', message: 'title wajib' });
    const [r] = await pool.query(
      `INSERT INTO materials (subject_id, title, body, sort_order) VALUES (?, ?, ?, ?)`,
      [subject_id, title, body || null, parseInt(sort_order || 0, 10)],
    );
    const [rows] = await pool.query('SELECT * FROM materials WHERE id = ?', [r.insertId]);
    return res.status(201).json({ material: rows[0] });
  } catch (err) {
    console.error('[curriculum.material.create]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

/** DELETE /api/curriculum/materials/:mid */
router.delete('/materials/:mid', requireRole('admin', 'guru'), async (req, res) => {
  try {
    const mid = parseInt(req.params.mid, 10);
    const [r] = await pool.query('DELETE FROM materials WHERE id = ?', [mid]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'NotFound' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('[curriculum.material.delete]', err);
    return res.status(500).json({ error: 'ServerError', message: err.message });
  }
});

module.exports = router;
