'use client';

import { CheckCircle2, Circle, FileText, Play, FileDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/lib/types';

interface LessonSidebarProps {
  courseTitle: string;
  lessons: Lesson[];
  activeLessonId: string;
  onSelect: (lessonId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Sidebar navigasi materi - collapsible di mobile (overlay), fixed di desktop
export function LessonSidebar({
  courseTitle,
  lessons,
  activeLessonId,
  onSelect,
  isOpen,
  onClose,
}: LessonSidebarProps) {
  return (
    <>
      {/* Overlay backdrop saat sidebar terbuka di mobile */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 top-16 z-40 w-80 border-r border-ink-100 bg-white',
          'transform transition-transform duration-300 ease-out',
          'lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-2 border-b border-ink-100 p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                Daftar Materi
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-ink-900 leading-tight">
                {courseTitle}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800 lg:hidden"
              aria-label="Tutup sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3">
            {lessons.map((lesson, index) => {
              const active = lesson.id === activeLessonId;
              const Icon =
                lesson.type === 'video'
                  ? Play
                  : lesson.type === 'pdf'
                    ? FileDown
                    : FileText;
              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelect(lesson.id)}
                  className={cn(
                    'mb-1 flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all',
                    active
                      ? 'bg-brand-50 text-brand-800'
                      : 'text-ink-700 hover:bg-ink-50',
                  )}
                >
                  <div className="flex-shrink-0 pt-0.5">
                    {lesson.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-sage-500" />
                    ) : (
                      <Circle
                        className={cn(
                          'h-5 w-5',
                          active ? 'text-brand-500' : 'text-ink-300',
                        )}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-ink-500">
                      Materi {index + 1}
                    </p>
                    <p
                      className={cn(
                        'mt-0.5 text-sm font-medium leading-snug',
                        active ? 'text-brand-900' : 'text-ink-900',
                      )}
                    >
                      {lesson.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-ink-500">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
