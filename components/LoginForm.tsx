'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Form login & daftar dengan tab switch. Belum terhubung backend -
// semua submit hanya redirect ke dashboard (mock auth).
export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: integrasikan dengan Supabase/Firebase auth di sini
    await new Promise((r) => setTimeout(r, 600));
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-ink-100 bg-white p-6 shadow-lift sm:p-8">
      {/* Tab switch */}
      <div className="mb-6 flex rounded-xl bg-ink-100 p-1">
        <TabButton
          active={mode === 'login'}
          onClick={() => setMode('login')}
        >
          Masuk
        </TabButton>
        <TabButton
          active={mode === 'register'}
          onClick={() => setMode('register')}
        >
          Daftar
        </TabButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <Field
            icon={<User className="h-5 w-5" />}
            label="Nama Lengkap"
            type="text"
            name="name"
            placeholder="Nama kamu"
            required
          />
        )}
        <Field
          icon={<Mail className="h-5 w-5" />}
          label="Email"
          type="email"
          name="email"
          placeholder="nama@email.com"
          required
        />
        <Field
          icon={<Lock className="h-5 w-5" />}
          label="Kata Sandi"
          type="password"
          name="password"
          placeholder="Minimal 8 karakter"
          required
          minLength={8}
        />

        {mode === 'login' && (
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              Lupa kata sandi?
            </button>
          </div>
        )}

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              {mode === 'login' ? 'Masuk ke Portal' : 'Daftar Sekarang'}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-ink-500">
        Dengan melanjutkan, kamu menyetujui syarat & ketentuan platform.
      </p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all',
        active
          ? 'bg-white text-ink-900 shadow-soft'
          : 'text-ink-500 hover:text-ink-700',
      )}
    >
      {children}
    </button>
  );
}

function Field({
  icon,
  label,
  ...props
}: {
  icon: React.ReactNode;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-700">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
          {icon}
        </div>
        <input
          {...props}
          className="h-11 w-full rounded-xl border border-ink-200 bg-white pl-11 pr-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors hover:border-ink-300 focus:border-brand-400"
        />
      </div>
    </div>
  );
}
