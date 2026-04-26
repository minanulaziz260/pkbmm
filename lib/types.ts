// Tipe data inti platform - didesain agar kompatibel dengan Supabase/Firebase

export type LessonType = 'text' | 'video' | 'pdf';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string; // contoh: "15 menit"
  content?: string; // konten HTML/markdown untuk teks
  videoUrl?: string; // URL embed YouTube
  pdfUrl?: string; // URL file PDF
  completed?: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subject: string;
  description: string;
  icon: string; // nama lucide icon
  color: string; // kelas tailwind untuk aksen warna
  totalLessons: number;
  completedLessons: number;
  lessons: Lesson[];
  quizSlug?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  slug: string;
  title: string;
  subject: string;
  description: string;
  timeLimit: number; // dalam menit
  passingScore: number; // dalam persen
  questions: QuizQuestion[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  level: string; // contoh: "Kelas XII"
}
