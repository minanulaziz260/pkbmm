import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <p className="text-sm font-medium text-brand-600">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Maaf, halaman yang kamu cari tidak tersedia.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-medium text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-lift"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
