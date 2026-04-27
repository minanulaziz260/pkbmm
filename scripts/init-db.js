#!/usr/bin/env node
'use strict';

/**
 * scripts/init-db.js
 *
 * Menjalankan schema.sql lalu meng-insert akun admin awal
 * (email + password dari .env), dengan password di-hash bcrypt.
 *
 * Pakai:
 *   npm run init-db
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

(async () => {
  const cfg = {
    host:     process.env.DB_HOST || '127.0.0.1',
    port:     parseInt(process.env.DB_PORT || '3306', 10),
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  };
  const dbName = process.env.DB_NAME || 'pkbm_mugisae';

  console.log(`→ Connecting to MySQL at ${cfg.host}:${cfg.port} as ${cfg.user}…`);
  const conn = await mysql.createConnection(cfg);

  // Run schema.sql (CREATE DATABASE included)
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
  console.log(`→ Running schema.sql (${schemaSQL.length} bytes)…`);
  await conn.query(schemaSQL);

  // Seed bootstrap admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mugisae.id';
  const adminPw    = process.env.ADMIN_PASSWORD || 'demo123';
  const hash = await bcrypt.hash(adminPw, 10);
  const adminUserId = `${new Date().getFullYear()}-000001`;

  await conn.query(`USE \`${dbName}\``);

  const [exists] = await conn.query(
    'SELECT id FROM users WHERE email = ? OR is_seed = 1 LIMIT 1',
    [adminEmail],
  );
  if (exists.length === 0) {
    await conn.query(
      `INSERT INTO users (user_id, name, email, role, password_hash, is_active, is_seed)
       VALUES (?, ?, ?, 'admin', ?, 1, 1)`,
      [adminUserId, 'Admin Utama', adminEmail, hash],
    );
    console.log(`✓ Admin awal dibuat: ${adminEmail} / ${adminPw} (id: ${adminUserId})`);
  } else {
    console.log(`• Admin sudah ada (id internal=${exists[0].id}). Tidak ditimpa.`);
  }

  await conn.end();
  console.log('✓ init-db selesai.');
  process.exit(0);
})().catch((err) => {
  console.error('✗ init-db gagal:', err.message);
  console.error(err.stack);
  process.exit(1);
});
