-- ============================================================
-- PKBM MUGI SAE — Database Schema
-- MySQL 8+ / MariaDB 10.5+
--
-- File ini TIDAK membuat database. Database harus sudah ada
-- (di-create manual atau di-provision oleh penyedia, mis.
-- Clever Cloud / Aiven / Pterodactyl). Jalankan dengan database
-- terpilih, contoh:
--   mysql -u pkbm -p pkbm_mugisae < schema.sql
-- atau lewat skrip:
--   node scripts/init-db.js   (otomatis pakai DB_NAME dari .env)
-- ============================================================

-- ============================================================
-- Tabel: users
-- ID auto-generated di aplikasi format YYYY-XXXXXX.
-- Password disimpan dalam bcrypt hash.
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`       VARCHAR(20)  NOT NULL UNIQUE COMMENT 'YYYY-XXXXXX',
  `name`          VARCHAR(100) NOT NULL,
  `email`         VARCHAR(150) DEFAULT NULL UNIQUE,
  `role`          ENUM('siswa','guru','admin') NOT NULL DEFAULT 'siswa',
  `paket`         JSON DEFAULT NULL COMMENT 'Array kode paket: ["A"], ["A","B","C"], atau NULL',
  `desa`          VARCHAR(100) DEFAULT NULL,
  `kecamatan`     VARCHAR(100) DEFAULT NULL,
  `kota`          VARCHAR(100) DEFAULT NULL,
  `kelas`         VARCHAR(50)  DEFAULT NULL,
  `usia`          INT UNSIGNED DEFAULT NULL,
  `hp`            VARCHAR(30)  DEFAULT NULL,
  `mapel`         VARCHAR(150) DEFAULT NULL COMMENT 'Mapel yang diajar (untuk guru)',
  `password_hash` VARCHAR(255) NOT NULL,
  `is_active`     TINYINT(1)   NOT NULL DEFAULT 1,
  `is_seed`       TINYINT(1)   NOT NULL DEFAULT 0 COMMENT 'Akun bawaan, tidak bisa dihapus',
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_role`       (`role`),
  KEY `idx_is_active`  (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabel: packages
-- Paket A (SD), Paket B (SMP), Paket C (SMA), atau lebih.
-- ============================================================
CREATE TABLE IF NOT EXISTS `packages` (
  `code`        CHAR(1)      NOT NULL,
  `label`       VARCHAR(100) NOT NULL,
  `description` TEXT         DEFAULT NULL,
  `color`       VARCHAR(20)  DEFAULT '#10b981',
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabel: subjects (mata pelajaran per paket)
-- ============================================================
CREATE TABLE IF NOT EXISTS `subjects` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_code` CHAR(1)      NOT NULL,
  `name`         VARCHAR(150) NOT NULL,
  `icon`         VARCHAR(20)  DEFAULT '📘',
  `description`  TEXT         DEFAULT NULL,
  `sort_order`   INT          NOT NULL DEFAULT 0,
  `color`        VARCHAR(20)  DEFAULT '#10b981',
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_package_code` (`package_code`),
  CONSTRAINT `fk_subjects_package`
    FOREIGN KEY (`package_code`) REFERENCES `packages`(`code`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabel: materials (modul belajar per mapel)
-- ============================================================
CREATE TABLE IF NOT EXISTS `materials` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `subject_id` INT UNSIGNED NOT NULL,
  `title`      VARCHAR(200) NOT NULL,
  `body`       LONGTEXT     DEFAULT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_subject_id` (`subject_id`),
  CONSTRAINT `fk_materials_subject`
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabel: quizzes (kuis per mapel)
-- Soal disimpan sebagai JSON sederhana di kolom `questions`.
-- ============================================================
CREATE TABLE IF NOT EXISTS `quizzes` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `subject_id`       INT UNSIGNED NOT NULL,
  `title`            VARCHAR(200) NOT NULL,
  `duration_minutes` INT          NOT NULL DEFAULT 30,
  `total_questions`  INT          NOT NULL DEFAULT 10,
  `questions`        JSON         DEFAULT NULL
                     COMMENT '[{q,options:[],answer:idx}, ...]',
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_subject_id` (`subject_id`),
  CONSTRAINT `fk_quizzes_subject`
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Seed data minimum: 3 paket A/B/C.
-- Akun admin awal di-insert oleh `node scripts/init-db.js`
-- supaya password di-hash dengan bcrypt (jangan hardcode hash di SQL).
-- ============================================================
INSERT INTO `packages` (`code`, `label`, `description`, `color`) VALUES
  ('A', 'Paket A (Setara SD)',  'Pendidikan dasar setara SD untuk warga belajar dewasa.', '#10b981'),
  ('B', 'Paket B (Setara SMP)', 'Pendidikan dasar setara SMP.',                            '#0d9488'),
  ('C', 'Paket C (Setara SMA)', 'Pendidikan menengah setara SMA.',                          '#f59e0b')
ON DUPLICATE KEY UPDATE
  `label`       = VALUES(`label`),
  `description` = VALUES(`description`),
  `color`       = VALUES(`color`);
