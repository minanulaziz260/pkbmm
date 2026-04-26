import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { QuizPlayer } from '@/components/QuizPlayer';
import { currentStudent, getQuizBySlug, getQuizzes } from '@/lib/data';

// Halaman kuis interaktif
export default async function QuizPage({
  params,
}: {
  params: { slug: string };
}) {
  const quiz = await getQuizBySlug(params.slug);
  if (!quiz) notFound();

  return (
    <>
      <Navbar studentName={currentStudent.name} />
      <main className="px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <QuizPlayer quiz={quiz} />
      </main>
    </>
  );
}

export async function generateStaticParams() {
  const quizzes = await getQuizzes();
  return quizzes.map((q) => ({ slug: q.slug }));
}
