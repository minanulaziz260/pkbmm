'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { LessonSidebar } from '@/components/LessonSidebar';
import { LessonContent } from '@/components/LessonContent';
import { Button } from '@/components/ui/Button';
import type { Course } from '@/lib/types';

// Halaman Modul Pembelajaran dengan sidebar toggleable.
// Dipisahkan menjadi client component agar state sidebar/current lesson interaktif.
export function CourseView({ course }: { course: Course }) {
  const [activeLessonId, setActiveLessonId] = useState(course.lessons[0]?.id);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeIdx = course.lessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson = course.lessons[activeIdx];

  const goPrev = () => {
    if (activeIdx > 0) setActiveLessonId(course.lessons[activeIdx - 1].id);
  };
  const goNext = () => {
    if (activeIdx < course.lessons.length - 1)
      setActiveLessonId(course.lessons[activeIdx + 1].id);
  };

  const handleSelect = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setSidebarOpen(false);
  };

  if (!activeLesson) return null;

  return (
    <div className="flex">
      <LessonSidebar
        courseTitle={course.title}
        lessons={course.lessons}
        activeLessonId={activeLesson.id}
        onSelect={handleSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
          {/* Top bar mobile */}
          <div className="mb-5 flex items-center justify-between gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-ink-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50 lg:hidden"
            >
              <Menu className="h-4 w-4" />
              Daftar Materi
            </button>
          </div>

          <LessonContent lesson={activeLesson} />

          {/* Navigasi antar materi */}
          <div className="mt-10 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={activeIdx === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Materi Sebelumnya
            </Button>

            {activeIdx === course.lessons.length - 1 && course.quizSlug ? (
              <Link
                href={`/quiz/${course.quizSlug}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sage-500 px-5 text-sm font-medium text-white shadow-soft transition-all hover:bg-sage-600 hover:shadow-lift"
              >
                <Trophy className="h-4 w-4" />
                Kerjakan Kuis
              </Link>
            ) : (
              <Button
                onClick={goNext}
                disabled={activeIdx === course.lessons.length - 1}
              >
                Materi Berikutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
