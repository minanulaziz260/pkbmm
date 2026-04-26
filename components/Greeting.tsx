'use client';

import { useEffect, useState } from 'react';

// Komponen client untuk greeting berbasis waktu -
// pakai useEffect agar tidak membekukan output di build time dan
// menghindari mismatch SSR (render awal kosong, lalu isi di client).
export function Greeting() {
  const [greeting, setGreeting] = useState<string>('Halo');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting('Selamat pagi');
    else if (hour < 15) setGreeting('Selamat siang');
    else if (hour < 18) setGreeting('Selamat sore');
    else setGreeting('Selamat malam');
  }, []);

  return (
    <p className="text-sm font-medium text-ink-500">
      {greeting}, <span aria-hidden>👋</span>
    </p>
  );
}
