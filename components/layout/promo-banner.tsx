'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white py-2.5 px-4">
      <div className="container flex items-center justify-center gap-2 text-sm">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span className="font-medium">
          Impulsa tu carrera profesional
        </span>
        <span className="hidden sm:inline text-white/90">|</span>
        <Link
          href="/cursos"
          className="hidden sm:inline font-semibold underline underline-offset-2 hover:text-white/90 transition-colors"
        >
          Obtén tu certificado con validez para SERVIR y procesos CAS
        </Link>
        <span className="sm:hidden font-semibold underline underline-offset-2">
          <Link href="/cursos">Ver cursos</Link>
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Cerrar banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
