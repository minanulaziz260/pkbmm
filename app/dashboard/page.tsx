import Link from 'next/link';
import { BookMarked, Flame, Target, Trophy } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { CourseCard } from '@/components/CourseCard';
import { Greeting } from '@/components/Greeting';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { currentStudent, getCourses, getOverallProgress } from '@/lib/data';

// Dashboard siswa - ucapan selamat datang, progress, daftar mata pelajaran
export default async function DashboardPage() {
  const [courses, progress] = await Promise.all([
    getCourses(),
    getOverallProgress(),
  ]);

  return (
    <>
      <Navbar studentName={currentStudent.name} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Greeting */}
        <section className="animate-fade-in">
          <Greeting />
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            Halo, {currentStudent.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {currentStudent.level} • Tetap semangat belajar hari ini!
          </p>
        </section>

        {/* Progress summary */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                Progress Keseluruhan
              </p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Target className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-ink-900">
              {progress.percentage}
              <span className="text-xl text-ink-400">%</span>
            </p>
            <ProgressBar value={progress.percentage} className="mt-3" />
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                Materi Selesai
              </p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-50 text-sage-600">
                <BookMarked className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-ink-900">
              {progress.completedLessons}
              <span className="text-xl text-ink-400">
                /{progress.totalLessons}
              </span>
            </p>
            <p className="mt-3 text-xs text-ink-500">
              Terus pertahankan ritme belajarmu.
            </p>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                Streak Belajar
              </p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Flame className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-ink-900">
              5<span className="text-xl text-ink-400"> hari</span>
            </p>
            <p className="mt-3 text-xs text-ink-500">
              Jangan putuskan rantai semangatmu.
            </p>
          </div>
        </section>

        {/* Daftar mata pelajaran */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink-900 sm:text-xl">
                Mata Pelajaran
              </h2>
              <p className="mt-0.5 text-sm text-ink-500">
                Pilih modul untuk mulai atau lanjutkan belajar.
              </p>
            </div>
            <Link
              href="#"
              className="hidden text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 sm:inline"
            >
              Lihat semua
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* CTA kuis */}
        <section className="mt-10">
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
                <Trophy className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink-900">
                  Uji kemampuanmu dengan kuis
                </h3>
                <p className="mt-0.5 text-sm text-ink-600">
                  Kerjakan latihan soal dari setiap mata pelajaran.
                </p>
              </div>
            </div>
            <Link
              href="/quiz/matematika-dasar"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-medium text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-lift"
            >
              Mulai Kuis Matematika
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
