'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Edit,
  Trash2,
  GraduationCap,
  Award,
  FileText,
  Clock,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  Target,
  CheckCircle,
  Loader2,
  Globe,
  Monitor,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Curso {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  descripcionCorta: string;
  tipo: string;
  modalidad: string;
  horasAcademicas: number;
  horasCronologicas: number;
  creditos: number;
  precio: number;
  precioOriginal?: number;
  imagen?: string;
  temario: string[];
  objetivos: string[];
  requisitos: string[];
  dirigidoA: string[];
  activo: boolean;
  destacado: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  cupoMaximo?: number;
  categoria: {
    id: string;
    nombre: string;
    slug: string;
  };
  creador: {
    id: string;
    nombre: string;
    email: string;
  };
  _count: {
    inscripciones: number;
    certificados: number;
  };
  createdAt: string;
  updatedAt: string;
}

const tipoConfig: Record<string, { icon: any; color: string; label: string; bgColor: string }> = {
  DIPLOMADO: { icon: GraduationCap, color: 'text-violet-700', bgColor: 'bg-violet-100', label: 'Diplomado' },
  CERTIFICADO: { icon: Award, color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Certificado' },
  CONSTANCIA: { icon: FileText, color: 'text-emerald-700', bgColor: 'bg-emerald-100', label: 'Constancia' },
};

const modalidadConfig: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
  VIRTUAL: { icon: Globe, color: 'text-cyan-700', bgColor: 'bg-cyan-100', label: 'Virtual' },
  PRESENCIAL: { icon: MapPin, color: 'text-orange-700', bgColor: 'bg-orange-100', label: 'Presencial' },
  SEMIPRESENCIAL: { icon: Monitor, color: 'text-purple-700', bgColor: 'bg-purple-100', label: 'Semipresencial' },
};

export default function CursoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCurso();
    }
  }, [params.id]);

  async function fetchCurso() {
    try {
      const response = await fetch(`/api/admin/cursos/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCurso(data);
      } else {
        router.push('/admin/cursos');
      }
    } catch (error) {
      console.error('Error fetching curso:', error);
      router.push('/admin/cursos');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!curso) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/cursos/${curso.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.push('/admin/cursos');
      }
    } catch (error) {
      console.error('Error deleting curso:', error);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Curso no encontrado</p>
        <Button asChild className="mt-4">
          <Link href="/admin/cursos">Volver a cursos</Link>
        </Button>
      </div>
    );
  }

  const tipoInfo = tipoConfig[curso.tipo] || tipoConfig.CERTIFICADO;
  const modalidadInfo = modalidadConfig[curso.modalidad] || modalidadConfig.VIRTUAL;
  const TipoIcon = tipoInfo.icon;
  const ModalidadIcon = modalidadInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/cursos">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalles del Curso</h1>
            <p className="text-gray-500">Información completa del curso</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/cursos/${curso.id}/editar`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar este curso?</AlertDialogTitle>
                <AlertDialogDescription>
                  {curso._count.inscripciones > 0 || curso._count.certificados > 0
                    ? 'Este curso tiene inscripciones o certificados asociados. Se desactivará en lugar de eliminarse.'
                    : 'Esta acción no se puede deshacer. El curso será eliminado permanentemente.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="relative w-full md:w-64 aspect-video rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {curso.imagen ? (
                    <Image
                      src={curso.imagen}
                      alt={curso.nombre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${tipoInfo.bgColor}`}>
                      <TipoIcon className={`h-16 w-16 ${tipoInfo.color}`} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className={`${tipoInfo.bgColor} ${tipoInfo.color}`}>
                      {tipoInfo.label}
                    </Badge>
                    <Badge className={`${modalidadInfo.bgColor} ${modalidadInfo.color}`}>
                      {modalidadInfo.label}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={curso.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                    >
                      {curso.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                    {curso.destacado && (
                      <Badge className="bg-amber-100 text-amber-700">Destacado</Badge>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">{curso.nombre}</h2>

                  {curso.descripcionCorta && (
                    <p className="text-gray-600 mb-4">{curso.descripcionCorta}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {curso.horasAcademicas} horas académicas
                    </span>
                    {curso.creditos > 0 && (
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {curso.creditos} créditos
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {curso._count.inscripciones} inscritos
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {curso.descripcion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Descripción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">{curso.descripcion}</p>
              </CardContent>
            </Card>
          )}

          {/* Temario */}
          {curso.temario && curso.temario.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Temario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {curso.temario.map((tema, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-medium shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{tema}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Objetivos */}
          {curso.objetivos && curso.objetivos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {curso.objetivos.map((objetivo, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{objetivo}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Requisitos */}
          {curso.requisitos && curso.requisitos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {curso.requisitos.map((requisito, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                      <span className="text-gray-600">{requisito}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Dirigido a */}
          {curso.dirigidoA && curso.dirigidoA.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Dirigido a
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {curso.dirigidoA.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Precio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Precio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  S/ {curso.precio.toFixed(2)}
                </p>
                {curso.precioOriginal && curso.precioOriginal > curso.precio && (
                  <>
                    <p className="text-lg text-gray-400 line-through">
                      S/ {curso.precioOriginal.toFixed(2)}
                    </p>
                    <Badge className="bg-red-100 text-red-700 mt-2">
                      {Math.round(((curso.precioOriginal - curso.precio) / curso.precioOriginal) * 100)}% descuento
                    </Badge>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Inscripciones</span>
                <span className="font-semibold">{curso._count.inscripciones}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Certificados emitidos</span>
                <span className="font-semibold">{curso._count.certificados}</span>
              </div>
              {curso.cupoMaximo && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Cupo máximo</span>
                    <span className="font-semibold">{curso.cupoMaximo}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Categoría</span>
                <p className="font-medium">{curso.categoria?.nombre || 'Sin categoría'}</p>
              </div>
              <Separator />
              <div>
                <span className="text-sm text-gray-500">Horas cronológicas</span>
                <p className="font-medium">{curso.horasCronologicas || curso.horasAcademicas} horas</p>
              </div>
              {curso.fechaInicio && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm text-gray-500">Fecha de inicio</span>
                    <p className="font-medium">
                      {new Date(curso.fechaInicio).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                </>
              )}
              {curso.fechaFin && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm text-gray-500">Fecha de fin</span>
                    <p className="font-medium">
                      {new Date(curso.fechaFin).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <span className="text-sm text-gray-500">Creado por</span>
                <p className="font-medium">{curso.creador?.nombre || 'Sistema'}</p>
              </div>
              <Separator />
              <div>
                <span className="text-sm text-gray-500">Slug (URL)</span>
                <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{curso.slug}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
