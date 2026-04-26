# Sekolah Kesetaraan Online — Paket A · B · C

Platform belajar online untuk warga belajar PKBM (Pusat Kegiatan Belajar Masyarakat) jenjang Paket A (setara SD), Paket B (setara SMP), dan Paket C (setara SMA).

Seluruh aplikasi berjalan dari **satu file HTML** ([`index.html`](./index.html)) — tanpa backend, tanpa framework eksternal, hanya HTML + CSS + JavaScript + Google Fonts.

## Cara menjalankan

Cukup buka `index.html` di peramban modern (Chrome, Firefox, Edge, Safari, atau peramban di HP).

```bash
# atau jalankan server statis sederhana
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Akun demo

Semua akun memakai kata sandi: **`demo123`**

| Peran | Email                       |
| ----- | --------------------------- |
| Siswa | `siti@kesetaraan.id`        |
| Guru  | `budi@kesetaraan.id`        |
| Admin | `admin@kesetaraan.id`       |

## Fitur utama

### Untuk Siswa
- Beranda dengan ringkasan progres, jadwal hari ini, dan pengumuman.
- Materi belajar (bacaan & video) per mata pelajaran sesuai paket.
- Kuis interaktif dengan timer, navigasi soal, dan pembahasan.
- Tugas dengan tenggat & status pengumpulan.
- Jadwal mingguan + ekspor `.ics` ke kalender.
- Progress tracker, lencana, dan grafik aktivitas.
- Forum diskusi dengan tutor dan sesama siswa.
- Simulasi UNBK (mode ujian dengan timer ketat).
- Sertifikat digital otomatis bila progres ≥ 70% (siap dicetak).
- Konseling/wali kelas (chat dummy 24/7).

### Untuk Guru / Tutor
- Dashboard ringkasan kelas & tugas menunggu penilaian.
- Manajemen kelas, daftar siswa, materi, dan kuis.
- Form penilaian dengan umpan balik.
- Posting pengumuman.

### Untuk Admin
- Statistik global (siswa, guru, materi, kuis).
- Manajemen pengguna, paket, dan kurikulum.
- Laporan & ekspor CSV.
- Pengaturan sistem.

### Fitur bernilai tinggi untuk konteks kesetaraan
- **Mode hemat data** — sembunyikan video/gambar berat untuk pengguna kuota terbatas.
- **Aksesibilitas**: pengaturan ukuran teks (A / A+ / A++), kontras tinggi, kurangi animasi, skip-link.
- **Mode gelap** untuk belajar malam.
- **Text-to-speech** (Web Speech API) untuk membaca materi keras-keras — membantu literasi.
- **Akses offline-friendly**: state tersimpan di `localStorage`, ditandai untuk akses tanpa internet.
- **Sertifikat digital** otomatis dengan nomor verifikasi.
- **Multi-peran** dalam satu antarmuka.
- **Mobile-first responsif**: bottom-nav di HP, sidebar di tablet/desktop.
- **Bahasa Indonesia** sepenuhnya, dengan placeholder untuk bahasa daerah (Jawa, Sunda).

## Catatan teknis

- Tidak ada dependensi NPM / build step.
- Semua data dummy didefinisikan di `DATA` di dalam `<script>`.
- Penyimpanan ringan menggunakan `localStorage` (`Store.get/set`).
- Dirancang ramah aksesibilitas: `aria-*`, fokus terlihat, target sentuh ≥ 44px, kontras WCAG AA.
- Tanpa framework — hanya CSS variables + vanilla JS.
