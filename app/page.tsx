import Link from 'next/link';
import { GraduationCap, Sparkles, BookOpen, Trophy, Clock } from 'lucide-react';
import { LoginForm } from '@/components/LoginForm';

// Landing page dengan header simpel + hero + form login/daftar
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/40 via-white to-white">
      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold tracking-tight text-ink-900">
            Portal Paket C
          </span>
        </Link>
        <div className="hidden items-center gap-2 text-xs text-ink-500 sm:flex">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Platform belajar mandiri untuk Paket C</span>
        </div>
      </header>

      {/* Main - hero + login form */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-16">
        {/* Hero */}
        <section className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Belajar fleksibel, kapan saja
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            Belajar Paket C
            <span className="block text-brand-600">tanpa batas waktu.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
            Portal belajar online untuk siswa Paket C setara SMA. Akses materi
            pelajaran, video interaktif, dan kuis latihan dari mana saja -
            dirancang ringan untuk ponsel kamu.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Feature
              icon={<BookOpen className="h-4 w-4" />}
              label="6+ Mata Pelajaran"
            />
            <Feature
              icon={<Clock className="h-4 w-4" />}
              label="Belajar Kapanpun"
            />
            <Feature
              icon={<Trophy className="h-4 w-4" />}
              label="Kuis Interaktif"
            />
          </ul>
        </section>

        {/* Form */}
        <section className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <LoginForm />
        </section>
      </main>

      {/* Footer minimal */}
      <footer className="mx-auto max-w-7xl border-t border-ink-100 px-4 py-6 text-center text-xs text-ink-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Portal Paket C - Dibuat untuk pembelajaran
        kesetaraan.
      </footer>
    </div>
  );
}

function Feature({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2 rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm font-medium text-ink-700 shadow-soft">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        {icon}
      </span>
      {label}
    </li>
  );
}
