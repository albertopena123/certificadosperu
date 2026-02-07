'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  FileText,
  Users,
  TrendingUp,
  DollarSign,
  BookOpen,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardData {
  stats: {
    totalCursos: number;
    totalParticipantes: number;
    totalCertificados: number;
    cursosActivos: number;
    diplomados: number;
    certificados: number;
    constancias: number;
    ingresosMes: number;
    inscripcionesMes: number;
  };
  ultimosInscritos: {
    id: string;
    nombre: string;
    curso: string;
    tipo: string;
    fecha: string;
  }[];
  cursosPopulares: {
    id: string;
    nombre: string;
    tipo: string;
    inscritos: number;
  }[];
}

const tipoColors: Record<string, string> = {
  diplomado: 'bg-violet-100 text-violet-700',
  certificado: 'bg-blue-100 text-blue-700',
  constancia: 'bg-emerald-100 text-emerald-700',
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount);
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Hace menos de 1 hora';
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalCursos: 0,
    totalParticipantes: 0,
    totalCertificados: 0,
    cursosActivos: 0,
    diplomados: 0,
    certificados: 0,
    constancias: 0,
    ingresosMes: 0,
    inscripcionesMes: 0,
  };

  const statsCards = [
    {
      title: 'Total Cursos',
      value: stats.totalCursos.toString(),
      change: `${stats.cursosActivos} activos`,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Participantes',
      value: stats.totalParticipantes.toLocaleString(),
      change: `+${stats.inscripcionesMes} este mes`,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Certificados Emitidos',
      value: stats.totalCertificados.toLocaleString(),
      change: 'Total emitidos',
      icon: ShieldCheck,
      color: 'bg-violet-500',
    },
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(stats.ingresosMes),
      change: `${stats.inscripcionesMes} inscripciones`,
      icon: DollarSign,
      color: 'bg-amber-500',
    },
  ];

  const cursosPorTipo = [
    { tipo: 'Diplomados', cantidad: stats.diplomados, icon: GraduationCap, color: 'text-violet-600 bg-violet-100' },
    { tipo: 'Certificados', cantidad: stats.certificados, icon: Award, color: 'text-blue-600 bg-blue-100' },
    { tipo: 'Constancias', cantidad: stats.constancias, icon: FileText, color: 'text-emerald-600 bg-emerald-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Bienvenido al panel de administración</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cursos por tipo */}
      <div className="grid gap-4 md:grid-cols-3">
        {cursosPorTipo.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.tipo}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{item.cantidad}</p>
                    <p className="text-sm text-gray-500">{item.tipo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two columns layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Últimos inscritos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Últimos Inscritos</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.ultimosInscritos && data.ultimosInscritos.length > 0 ? (
              <div className="space-y-4">
                {data.ultimosInscritos.map((inscrito) => (
                  <div key={inscrito.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {inscrito.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{inscrito.nombre}</p>
                        <p className="text-xs text-gray-500">{inscrito.curso}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={tipoColors[inscrito.tipo]} variant="secondary">
                        {inscrito.tipo}
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(inscrito.fecha)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No hay inscripciones recientes</p>
            )}
          </CardContent>
        </Card>

        {/* Cursos populares */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cursos Más Populares</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.cursosPopulares && data.cursosPopulares.length > 0 ? (
              <div className="space-y-4">
                {data.cursosPopulares.map((curso, index) => (
                  <div key={curso.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-violet-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {curso.nombre}
                        </p>
                        <Badge className={tipoColors[curso.tipo]} variant="secondary">
                          {curso.tipo}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{curso.inscritos}</p>
                      <p className="text-xs text-gray-500">inscritos</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No hay cursos aún</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/cursos/nuevo?tipo=DIPLOMADO" className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors">
              <div className="p-2 rounded-lg bg-violet-100">
                <GraduationCap className="h-5 w-5 text-violet-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Nuevo Diplomado</span>
            </Link>
            <Link href="/admin/cursos/nuevo?tipo=CERTIFICADO" className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="p-2 rounded-lg bg-blue-100">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Nuevo Certificado</span>
            </Link>
            <Link href="/admin/cursos/nuevo?tipo=CONSTANCIA" className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
              <div className="p-2 rounded-lg bg-emerald-100">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Nueva Constancia</span>
            </Link>
            <Link href="/admin/certificados/emitir" className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors">
              <div className="p-2 rounded-lg bg-amber-100">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Emitir Certificado</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
