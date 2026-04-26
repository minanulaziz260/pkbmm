'use client';

import Link from 'next/link';
import { GraduationCap, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Navbar konsisten untuk seluruh halaman (kecuali landing)
export function Navbar({ studentName }: { studentName?: string }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-ink-900 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Portal Paket C
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/dashboard" active={isActive('/dashboard')}>
            Dashboard
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {studentName && (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-ink-900 leading-tight">
                {studentName}
              </p>
              <p className="text-xs text-ink-500">Siswa</p>
            </div>
          )}
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800"
            aria-label="Keluar"
            title="Keluar"
          >
            <LogOut className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-brand-50 text-brand-700'
          : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
      )}
    >
      {children}
    </Link>
  );
}
