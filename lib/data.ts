// Data layer - abstraksi akses data agar mudah diganti dengan Supabase/Firebase nanti.
// Cukup ubah implementasi fungsi-fungsi di file ini tanpa menyentuh komponen UI.

import coursesData from '@/data/courses.json';
import quizzesData from '@/data/quizzes.json';
import type { Course, Quiz, Student } from './types';

const courses = coursesData as Course[];
const quizzes = quizzesData as Quiz[];

// Mock user - nanti diganti dengan auth dari Supabase/Firebase
export const currentStudent: Student = {
  id: 's1',
  name: 'Rizky Pratama',
  email: 'rizky@paketc.id',
  level: 'Paket C - Kelas XII',
};

/** Ambil seluruh daftar kursus yang tersedia. */
export async function getCourses(): Promise<Course[]> {
  // TODO: ganti dengan `supabase.from('courses').select('*')` saat integrasi
  return courses;
}

/** Ambil detail satu kursus berdasarkan slug. */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  return courses.find((c) => c.slug === slug) ?? null;
}

/** Ambil detail kuis berdasarkan slug. */
export async function getQuizBySlug(slug: string): Promise<Quiz | null> {
  return quizzes.find((q) => q.slug === slug) ?? null;
}

/** Ambil semua kuis. */
export async function getQuizzes(): Promise<Quiz[]> {
  return quizzes;
}

/** Hitung progress belajar keseluruhan (rata-rata persen penyelesaian). */
export async function getOverallProgress(): Promise<{
  totalLessons: number;
  completedLessons: number;
  percentage: number;
}> {
  const all = await getCourses();
  const totalLessons = all.reduce((sum, c) => sum + c.totalLessons, 0);
  const completedLessons = all.reduce((sum, c) => sum + c.completedLessons, 0);
  const percentage = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;
  return { totalLessons, completedLessons, percentage };
}
