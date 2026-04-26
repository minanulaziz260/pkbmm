'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';
import type { Quiz } from '@/lib/types';

interface QuizPlayerProps {
  quiz: Quiz;
}

// Player kuis: soal per halaman, navigasi next/prev, modal hasil di akhir.
export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const total = quiz.questions.length;
  const current = quiz.questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round(((currentIdx + 1) / total) * 100);

  const score = useMemo(() => {
    if (!submitted) return 0;
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correct += 1;
    });
    return Math.round((correct / total) * 100);
  }, [submitted, answers, quiz.questions, total]);

  const passed = score >= quiz.passingScore;

  const handleSelect = (optionIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [current.id]: optionIdx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResult(true);
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header kuis */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          {quiz.title}
        </h1>
        <p className="mt-1 text-sm text-ink-500">{quiz.description}</p>
      </div>

      {/* Progress */}
      <div className="mb-6 flex items-center gap-4">
        <ProgressBar value={progress} className="flex-1" />
        <span className="whitespace-nowrap text-sm font-medium text-ink-600">
          Soal {currentIdx + 1} / {total}
        </span>
      </div>

      {/* Card soal */}
      <div className="animate-slide-up rounded-2xl border border-ink-200 bg-white p-6 shadow-soft sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-600">
          Pertanyaan {currentIdx + 1}
        </p>
        <h2 className="mt-2 text-lg font-semibold text-ink-900 sm:text-xl">
          {current.question}
        </h2>

        <div className="mt-6 space-y-3">
          {current.options.map((option, idx) => {
            const selected = answers[current.id] === idx;
            const isCorrect = submitted && idx === current.correctIndex;
            const isWrongSelection =
              submitted && selected && idx !== current.correctIndex;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={submitted}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all',
                  'disabled:cursor-default',
                  !submitted && selected && 'border-brand-400 bg-brand-50',
                  !submitted &&
                    !selected &&
                    'border-ink-200 hover:border-ink-300 hover:bg-ink-50',
                  isCorrect && 'border-sage-400 bg-sage-50',
                  isWrongSelection && 'border-red-300 bg-red-50',
                  submitted && !isCorrect && !isWrongSelection && 'border-ink-200 opacity-60',
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
                    !submitted && selected && 'border-brand-500 bg-brand-500 text-white',
                    !submitted && !selected && 'border-ink-300 text-ink-500',
                    isCorrect && 'border-sage-500 bg-sage-500 text-white',
                    isWrongSelection && 'border-red-400 bg-red-400 text-white',
                  )}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <span
                  className={cn(
                    'text-sm leading-relaxed sm:text-base',
                    isCorrect && 'font-medium text-sage-900',
                    isWrongSelection && 'text-red-900',
                    !submitted && 'text-ink-800',
                  )}
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {submitted && current.explanation && (
          <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Pembahasan
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">
              {current.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Kontrol navigasi */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          Sebelumnya
        </Button>

        {currentIdx < total - 1 ? (
          <Button
            onClick={() => setCurrentIdx((i) => Math.min(total - 1, i + 1))}
          >
            Selanjutnya
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : submitted ? (
          <Button variant="outline" onClick={() => setShowResult(true)}>
            <Trophy className="h-4 w-4" />
            Lihat Hasil
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={handleSubmit}
            disabled={answeredCount < total}
          >
            Submit Kuis
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!submitted && answeredCount < total && currentIdx === total - 1 && (
        <p className="mt-3 text-center text-xs text-ink-500">
          Jawab semua {total} soal untuk dapat submit.
        </p>
      )}

      {/* Modal hasil */}
      <Modal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="Hasil Kuis"
      >
        <div className="text-center">
          <div
            className={cn(
              'mx-auto flex h-16 w-16 items-center justify-center rounded-full',
              passed ? 'bg-sage-100 text-sage-600' : 'bg-red-100 text-red-500',
            )}
          >
            {passed ? (
              <Trophy className="h-8 w-8" />
            ) : (
              <XCircle className="h-8 w-8" />
            )}
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-ink-900">
            {passed ? 'Selamat, Lulus!' : 'Belum Lulus'}
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            {passed
              ? 'Kamu berhasil memahami materi dengan baik.'
              : `Nilai minimum kelulusan ${quiz.passingScore}%. Tetap semangat!`}
          </p>

          <div className="mt-5 rounded-2xl bg-ink-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
              Skor Kamu
            </p>
            <p
              className={cn(
                'mt-1 text-4xl font-bold',
                passed ? 'text-sage-600' : 'text-ink-900',
              )}
            >
              {score}
              <span className="text-lg text-ink-400">/100</span>
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Jawaban benar:{' '}
              {
                quiz.questions.filter(
                  (q) => answers[q.id] === q.correctIndex,
                ).length
              }{' '}
              dari {total}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setShowResult(false);
                handleReset();
              }}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4" />
              Coba Lagi
            </Button>
            <Link
              href="/dashboard"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-medium text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-lift"
            >
              Kembali ke Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
