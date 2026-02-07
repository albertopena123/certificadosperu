'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import {
  User,
  BookOpen,
  Award,
  Settings,
  LogOut,
  Loader2,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/mi-cuenta', icon: User, label: 'Mi Perfil' },
  { href: '/mi-cuenta/cursos', icon: BookOpen, label: 'Mis Cursos' },
  { href: '/mi-cuenta/certificados', icon: Award, label: 'Mis Certificados' },
  { href: '/mi-cuenta/configuracion', icon: Settings, label: 'Configuración' },
];

export default function MiCuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/mi-cuenta');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!session || session.user.userType !== 'participante') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Acceso no autorizado</p>
          <Link href="/login" className="text-violet-600 hover:underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-10 w-10 text-violet-600" />
                </div>
                <h2 className="font-semibold text-gray-900">{session.user.name}</h2>
                <p className="text-sm text-gray-500">{session.user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-violet-50 text-violet-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar sesión</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
