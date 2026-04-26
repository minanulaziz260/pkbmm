import { FileDown, Play, FileText, Clock } from 'lucide-react';
import type { Lesson } from '@/lib/types';

// Render konten materi sesuai tipe (text / video / pdf)
export function LessonContent({ lesson }: { lesson: Lesson }) {
  const TypeIcon =
    lesson.type === 'video' ? Play : lesson.type === 'pdf' ? FileDown : FileText;
  const typeLabel =
    lesson.type === 'video'
      ? 'Video Pembelajaran'
      : lesson.type === 'pdf'
        ? 'Materi PDF'
        : 'Bacaan';

  return (
    <article className="animate-fade-in">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-brand-600">
        <TypeIcon className="h-4 w-4" />
        <span>{typeLabel}</span>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
        {lesson.title}
      </h1>
      <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
        <Clock className="h-4 w-4" />
        <span>{lesson.duration}</span>
      </div>

      <div className="mt-8">
        {lesson.type === 'video' && lesson.videoUrl && (
          <div className="aspect-video overflow-hidden rounded-2xl border border-ink-100 bg-ink-900 shadow-soft">
            <iframe
              src={lesson.videoUrl}
              title={lesson.title}
              className="h-full w-full"
              loading="lazy"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
        )}

        {lesson.type === 'pdf' && lesson.pdfUrl && (
          <div className="rounded-2xl border border-ink-100 bg-ink-50 p-6 text-center sm:p-8">
            <FileDown className="mx-auto h-10 w-10 text-brand-500" />
            <h3 className="mt-3 text-lg font-semibold text-ink-900">
              Materi tersedia dalam format PDF
            </h3>
            <p className="mt-1 text-sm text-ink-600">
              Unduh atau buka di tab baru untuk membaca lebih nyaman.
            </p>
            <a
              href={lesson.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-medium text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-lift"
            >
              <FileDown className="h-4 w-4" />
              Buka PDF
            </a>
          </div>
        )}

        {lesson.type === 'text' && lesson.content && (
          <div
            className="prose-lesson"
            // Konten sudah disanitasi dari sumber internal (mock JSON).
            // Saat integrasi CMS, pastikan melakukan sanitasi tambahan.
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        )}
      </div>
    </article>
  );
}
