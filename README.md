# PKBM MUGI SAE — Platform Kesetaraan (Express + MySQL + JWT)

Platform belajar online untuk sekolah kesetaraan **Paket A / B / C**.

- **Backend** : Node.js 18+ · Express
- **Database**: MySQL 8 / MariaDB 10.5+
- **Frontend**: HTML + CSS + Vanilla JS (tanpa framework)
- **Auth**    : JWT, expire 8 jam, disimpan di `localStorage`
- **Deploy**  : Pterodactyl Panel (Node.js egg)

## Struktur folder

```
project/
├── server.js
├── schema.sql
├── package.json
├── .env.example
├── routes/
│   ├── auth.js          # login, logout, /me
│   ├── users.js         # CRUD pengguna
│   ├── packages.js      # manajemen paket
│   └── curriculum.js    # mapel & materi
├── middleware/
│   └── authJWT.js       # proteksi route, role guard
├── models/
│   └── db.js            # pool MySQL (mysql2/promise)
├── scripts/
│   └── init-db.js       # menjalankan schema.sql + seed admin
└── public/
    ├── login.html
    ├── dashboard.html
    ├── users.html
    ├── packages.html
    ├── curriculum.html
    ├── styles.css
    └── app.js
```

## Setup lokal

### 1. Clone dan install
```bash
git clone https://github.com/minanulaziz260/pkbmm.git
cd pkbmm
npm install
```

### 2. Siapkan MySQL

Buat user & database (atau pakai user `root` saat dev):

```sql
CREATE USER 'pkbm'@'localhost' IDENTIFIED BY 'changeme';
CREATE DATABASE pkbm_mugisae CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON pkbm_mugisae.* TO 'pkbm'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Konfigurasi `.env`

```bash
cp .env.example .env
# edit .env, isi DB credentials & JWT_SECRET
```

Nilai yang harus diganti di production:
- `JWT_SECRET` — gunakan random string panjang (mis. `openssl rand -hex 32`)
- `DB_PASSWORD` — password MySQL nyata
- `ADMIN_PASSWORD` — password admin pertama

### 4. Jalankan migrasi + seed admin

```bash
npm run init-db
```

Skrip ini menjalankan `schema.sql` (membuat database, 5 tabel, 3 paket bawaan)
lalu menambah satu akun admin awal dengan password di-hash bcrypt.

Output yang diharapkan:
```
✓ Admin awal dibuat: admin@mugisae.id / demo123 (id: 2026-000001)
```

### 5. Start server

```bash
npm start          # production
npm run dev        # node --watch (auto-restart on file change)
```

Server listen di `http://localhost:3000` (atau `PORT` di `.env`).

### 6. Login

Buka `http://localhost:3000/` → halaman login.

Akun bawaan (langsung dari `init-db`):
- **Email**     : `admin@mugisae.id`
- **Password**  : `demo123` (atau sesuai `ADMIN_PASSWORD` di `.env`)

Akun siswa & guru tidak dibuat otomatis — admin yang membuat manual lewat
**Manajemen Pengguna → + Tambah Pengguna**. Sistem akan generate:
- **ID akun** format `YYYY-XXXXXX` (mis. `2026-481937`)
- **Password** random 8 karakter

Setelah submit, pop-up "Akun Berhasil Dibuat ✅" menampilkan ID & password
satu kali — admin wajib menyalin atau menyerahkan ke pengguna sebelum modal ditutup.

## API Reference

Semua endpoint kecuali `/api/auth/login` dan `/api/health` butuh header:

```
Authorization: Bearer <token>
```

### Auth
| Method | Path                  | Akses     | Keterangan |
|--------|-----------------------|-----------|------------|
| POST   | `/api/auth/login`     | publik    | body: `{ identifier, password }` (identifier = email atau user_id) |
| POST   | `/api/auth/logout`    | JWT (opt) | client-side: hapus token dari localStorage |
| GET    | `/api/me`             | JWT       | info user dari token |

### Users (admin only)
| Method | Path                              | Body / Query |
|--------|-----------------------------------|--------------|
| GET    | `/api/users?role=&paket=&q=`      | filter & search |
| GET    | `/api/users/:id`                  | detail |
| POST   | `/api/users`                      | `{ role, name, email?, paket?, desa?, ... }` → return `{ user, plain_password }` |
| PUT    | `/api/users/:id`                  | partial update |
| POST   | `/api/users/:id/reset-password`   | → `{ ok, plain_password }` |
| DELETE | `/api/users/:id`                  | tidak boleh menghapus akun `is_seed` |

### Packages
| Method | Path                | Akses |
|--------|---------------------|-------|
| GET    | `/api/packages`     | JWT   |
| GET    | `/api/packages/:code` | JWT |
| POST   | `/api/packages`     | admin |
| PUT    | `/api/packages/:code` | admin |
| DELETE | `/api/packages/:code` | admin (gagal jika masih dipakai siswa) |

### Curriculum (mapel + materi)
| Method | Path                                 | Akses |
|--------|--------------------------------------|-------|
| GET    | `/api/curriculum?package=A`          | JWT   |
| GET    | `/api/curriculum/:id`                | JWT (return: subject + materials + quizzes) |
| POST   | `/api/curriculum`                    | admin/guru |
| PUT    | `/api/curriculum/:id`                | admin/guru |
| DELETE | `/api/curriculum/:id`                | admin |
| POST   | `/api/curriculum/:id/materials`      | admin/guru |
| DELETE | `/api/curriculum/materials/:mid`     | admin/guru |

## Skema database (5 tabel)

Lihat [`schema.sql`](./schema.sql).

- `users`     — id auto, `user_id` (`YYYY-XXXXXX`), bcrypt hash, role enum, `paket` JSON, `is_seed` flag
- `packages`  — `code` PK (1 huruf), label, deskripsi, warna
- `subjects`  — mapel per `package_code` (FK), icon, deskripsi, sort
- `materials` — modul belajar per `subject_id` (FK)
- `quizzes`   — kuis per `subject_id` (FK), soal sebagai JSON `[{q,options,answer}]`

Foreign keys pakai `ON DELETE CASCADE` sehingga menghapus paket otomatis
membersihkan mapel/materi/kuis di bawahnya.

## Deploy ke Pterodactyl Panel (Node.js egg)

1. Upload semua file repo (kecuali `node_modules` dan `.env`) ke server
   Pterodactyl, atau pakai integrasi Git.
2. Di panel, set **Egg = Node.js Generic**, **Node Version = 18+**.
3. **Startup variables**:
   - `STARTUP` : `npm start`
   - `MAIN_FILE` (jika ditanya) : `server.js`
4. **Install command** (Pre-Start):
   ```
   npm install --production
   ```
5. **Environment variables** di tab **Startup** atau **Variables**, set
   sesuai `.env.example`:
   - `PORT` (sesuaikan dengan port yang dialokasikan Pterodactyl —
     biasanya `{{SERVER_PORT}}`)
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
     (arahkan ke MySQL kamu — biasanya host yang sama di Pterodactyl
     menyediakan database addon)
   - `JWT_SECRET` (random panjang, **wajib** diganti)
   - `JWT_EXPIRES_IN` = `8h`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` (untuk init-db pertama)
6. Sekali saja, jalankan **dari console Pterodactyl**:
   ```
   npm run init-db
   ```
   atau dari shell node:
   ```
   node scripts/init-db.js
   ```
7. Restart server. Buka `http://<IP>:<PORT>/`. Login dengan admin awal.
8. Setelah berhasil login, **ganti password admin** segera dari menu
   Manajemen Pengguna → reset password admin.

### Catatan Pterodactyl
- Pterodactyl Node.js egg sudah otomatis menjalankan `npm install` jika
  `package.json` ada — tidak perlu commit `node_modules`.
- File `.env` **tidak ikut commit** (sudah di `.gitignore`). Konfig
  diambil dari Environment Variables panel.
- Pastikan firewall/rules Pterodactyl mengizinkan port aplikasi.

## Keamanan

- Password disimpan sebagai bcrypt hash (cost 10).
- JWT pakai `HS256` dengan `JWT_SECRET` dari `.env`.
- Semua endpoint write (`POST/PUT/DELETE`) dilindungi `requireRole('admin')`
  atau `requireRole('admin','guru')` untuk kurikulum.
- Filter query gunakan parameterized SQL via `mysql2` — tidak rentan
  SQL injection.
- `cors()` aktif untuk default policy; sesuaikan jika frontend dipisah ke
  domain berbeda.
- ⚠️ Ganti `JWT_SECRET` & `ADMIN_PASSWORD` sebelum production.

## Lisensi

MIT (atau sesuaikan).
