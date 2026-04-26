import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { CourseView } from '@/components/CourseView';
import { currentStudent, getCourseBySlug, getCourses } from '@/lib/data';

// Halaman modul pembelajaran dengan sidebar materi
export default async function CoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  return (
    <>
      <Navbar studentName={currentStudent.name} />
      <CourseView course={course} />
    </>
  );
}

// Generate static paths saat build untuk performa maksimal
export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}
