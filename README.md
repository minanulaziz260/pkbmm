# Portal Belajar Paket C (pkbmm)

Platform pembelajaran online (LMS) interaktif untuk siswa **Paket C** (setara SMA di Indonesia). Dibangun dengan fokus pada pengalaman mobile, performa, dan kesiapan deploy ke Vercel tanpa konfigurasi tambahan.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router) + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com) dengan font [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Icons**: [Lucide React](https://lucide.dev)
- **Data**: Mock JSON (siap digantikan oleh Supabase/Firebase melalui layer di `lib/data.ts`)
- **Deploy**: Vercel (zero-config)

## Struktur Folder

```
pkbmm/
├── app/                          # App Router Next.js
│   ├── layout.tsx                # Root layout + font Plus Jakarta Sans
│   ├── globals.css               # Tailwind base + utility prose-lesson
│   ├── page.tsx                  # Landing page + form login/daftar
│   ├── not-found.tsx             # Halaman 404
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard siswa
│   ├── courses/
│   │   └── [slug]/
│   │       └── page.tsx          # Halaman modul pembelajaran
│   └── quiz/
│       └── [slug]/
│           └── page.tsx          # Halaman kuis
├── components/
│   ├── ui/                       # Komponen UI primitif
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Modal.tsx
│   ├── Navbar.tsx                # Navigasi atas (sticky, blur)
│   ├── LoginForm.tsx             # Tab masuk/daftar
│   ├── CourseCard.tsx            # Kartu mata pelajaran
│   ├── CourseView.tsx            # Client component untuk modul
│   ├── LessonSidebar.tsx         # Sidebar materi (collapsible di mobile)
│   ├── LessonContent.tsx         # Renderer konten materi (text/video/pdf)
│   └── QuizPlayer.tsx            # Player kuis + modal hasil
├── data/
│   ├── courses.json              # Mock data mata pelajaran
│   └── quizzes.json              # Mock data kuis
├── lib/
│   ├── types.ts                  # Tipe TypeScript
│   ├── data.ts                   # Abstraksi data access
│   └── utils.ts                  # Helper (cn)
├── public/                       # Static assets
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── .eslintrc.json
└── package.json
```

## Fitur Utama

1. **Landing/Login Page** - Header simpel, hero section, form login/daftar dengan tab switch.
2. **Dashboard Siswa** - Ucapan selamat datang, ringkasan progress (progress bar minimalis), kartu mata pelajaran, dan CTA kuis.
3. **Modul Pembelajaran** - Sidebar materi yang bisa di-toggle/collapse di mobile, area konten utama mendukung:
   - Bacaan (HTML)
   - Video YouTube (embed iframe)
   - File PDF (tombol buka di tab baru)
4. **Kuis Interaktif** - Soal pilihan ganda, navigasi antar soal, submit dengan hasil instan via modal, serta pembahasan per soal.

## Desain

- **Tema**: Minimalis, elegan, clean ala Apple/Notion.
- **Warna**: Dominan putih dengan aksen biru pastel (`brand`) & sage green (`sage`), teks monochrome (`ink`).
- **Tipografi**: Plus Jakarta Sans (sans-serif modern).
- **Responsif**: 100% mobile-friendly, tanpa overflow.
- **Micro-interactions**: Hover halus, transisi smooth, animasi fade/scale pada modal.

## Menjalankan Secara Lokal

Pastikan Node.js **18.17+** terpasang.

```bash
# 1. Install dependencies
npm install

# 2. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Script lainnya

```bash
npm run build   # Build production
npm run start   # Jalankan build production
npm run lint    # Lint dengan ESLint
```

## Deploy ke Vercel (Zero Config)

Proyek ini sudah dioptimalkan untuk deploy otomatis ke Vercel. Ikuti langkah berikut:

### Opsi A: Lewat Dashboard Vercel (UI)

1. Push repo ini ke GitHub (sudah dilakukan).
2. Buka [vercel.com/new](https://vercel.com/new) dan **Import Git Repository** ini.
3. Biarkan semua pengaturan default - Vercel akan mendeteksi Next.js secara otomatis:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
4. Klik **Deploy**. Selesai - situs live dalam ~1-2 menit.

### Opsi B: Lewat Vercel CLI

```bash
npm i -g vercel
vercel           # preview deploy
vercel --prod    # production deploy
```

### Environment Variables

Saat ini semua data masih mock (JSON lokal), **belum ada env vars yang dibutuhkan**. Ketika nanti integrasi Supabase/Firebase, tambahkan variabel berikut di dashboard Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Integrasi Backend (Next Steps)

Layer data berada di `lib/data.ts`. Untuk migrasi ke Supabase misalnya:

```ts
// sebelum (mock)
export async function getCourses(): Promise<Course[]> {
  return coursesData as Course[];
}

// sesudah (Supabase)
export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase.from('courses').select('*');
  if (error) throw error;
  return data;
}
```

Komponen UI **tidak perlu diubah** karena kontrak tipe tetap sama.

## Lisensi

MIT
