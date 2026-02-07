'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  BarChart3,
  BookOpen,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: 'Principal',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Estadísticas', href: '/admin/estadisticas', icon: BarChart3 },
    ],
  },
  {
    title: 'Gestión de Cursos',
    items: [
      { label: 'Todos los Cursos', href: '/admin/cursos', icon: BookOpen },
      { label: 'Diplomados', href: '/admin/cursos/diplomados', icon: GraduationCap },
      { label: 'Certificados', href: '/admin/cursos/certificados', icon: Award },
      { label: 'Constancias', href: '/admin/cursos/constancias', icon: FileText },
    ],
  },
  {
    title: 'Certificaciones',
    items: [
      { label: 'Emitir Certificado', href: '/admin/certificados/emitir', icon: Award },
      { label: 'Certificados Emitidos', href: '/admin/certificados', icon: ShieldCheck },
    ],
  },
  {
    title: 'Inscripciones',
    items: [
      { label: 'Todas las Inscripciones', href: '/admin/inscripciones', icon: FolderOpen },
    ],
  },
  {
    title: 'Usuarios',
    items: [
      { label: 'Participantes', href: '/admin/participantes', icon: Users },
    ],
  },
  {
    title: 'Configuración',
    items: [
      { label: 'Ajustes', href: '/admin/configuracion', icon: Settings },
    ],
  },
];

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/logo/logocertificado.jpg"
              alt="CertificadosPerú"
              width={140}
              height={40}
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            {!isCollapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-violet-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800',
                        isCollapsed && 'justify-center'
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-2">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? 'Cerrar Sesión' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </Link>
      </div>
    </aside>
  );
}
