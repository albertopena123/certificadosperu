'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BookOpen, Award, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Stats {
  totalCursos: number;
  cursosCompletados: number;
  certificados: number;
  horasTotales: number;
}

export default function MiCuentaPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('/api/mi-cuenta/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {session?.user?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-500">
          Gestiona tus cursos y certificados desde aquí
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-100 rounded-xl">
                  <BookOpen className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalCursos || 0}
                  </p>
                  <p className="text-sm text-gray-500">Cursos inscritos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.cursosCompletados || 0}
                  </p>
                  <p className="text-sm text-gray-500">Completados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.certificados || 0}
                  </p>
                  <p className="text-sm text-gray-500">Certificados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.horasTotales || 0}
                  </p>
                  <p className="text-sm text-gray-500">Horas totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mis Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Accede a tus cursos inscritos y continúa tu aprendizaje.
            </p>
            <Button asChild>
              <Link href="/mi-cuenta/cursos">Ver mis cursos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis Certificados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Descarga y verifica tus certificados obtenidos.
            </p>
            <Button asChild variant="outline">
              <Link href="/mi-cuenta/certificados">Ver certificados</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Explore more */}
      <Card className="bg-gradient-to-r from-violet-600 to-purple-700 text-white border-0">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2">¿Quieres seguir aprendiendo?</h3>
          <p className="text-violet-100 mb-4">
            Explora nuestro catálogo de cursos y obtén más certificados para tu carrera profesional.
          </p>
          <Button variant="secondary" asChild>
            <Link href="/cursos">Explorar cursos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
