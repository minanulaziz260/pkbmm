import Link from 'next/link';
import {
  BookOpen,
  Calculator,
  Languages,
  Atom,
  Globe2,
  ShieldCheck,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { Course } from '@/lib/types';
import { cn } from '@/lib/utils';

// Mapping icon dari string di JSON ke komponen lucide
const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Calculator,
  Languages,
  Atom,
  Globe2,
  ShieldCheck,
};

export function CourseCard({ course }: { course: Course }) {
  const Icon = iconMap[course.icon] ?? BookOpen;
  const progress = course.totalLessons
    ? Math.round((course.completedLessons / course.totalLessons) * 100)
    : 0;

  const isSage = course.color === 'sage';
  const iconBg = isSage
    ? 'bg-sage-50 text-sage-600'
    : 'bg-brand-50 text-brand-600';

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        'group relative flex flex-col rounded-2xl border border-ink-200 bg-white p-5',
        'shadow-soft transition-all duration-300',
        'hover:-translate-y-1 hover:border-ink-300 hover:shadow-lift',
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
            iconBg,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-ink-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-700" />
      </div>

      <h3 className="text-base font-semibold text-ink-900">{course.title}</h3>
      <p className="mt-1 text-sm text-ink-500 line-clamp-2">
        {course.description}
      </p>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-ink-600">
            {course.completedLessons} / {course.totalLessons} materi
          </span>
          <span className="font-semibold text-ink-900">{progress}%</span>
        </div>
        <ProgressBar value={progress} color={isSage ? 'sage' : 'brand'} />
      </div>
    </Link>
  );
}
