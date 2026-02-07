'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Clock,
  Award,
  GraduationCap,
  FileText,
  Eye,
  CreditCard,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Inscripcion {
  id: string;
  estado: string;
  monto: number;
  fechaInscripcion: string;
  fechaPago?: string;
  curso: {
    id: string;
    nombre: string;
    slug: string;
    imagen?: string;
    tipo: string;
    modalidad: string;
    horasAcademicas: number;
    precio: number;
  };
}

const estadoConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDIENTE: { label: 'Pendiente de pago', color: 'bg-amber-100 text-amber-700', icon: AlertCircle },
  PAGADO: { label: 'Pagado', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  CURSANDO: { label: 'En progreso', color: 'bg-violet-100 text-violet-700', icon: BookOpen },
  COMPLETADO: { label: 'Completado', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const tipoConfig: Record<string, { icon: any; label: string }> = {
  DIPLOMADO: { icon: GraduationCap, label: 'Diplomado' },
  CERTIFICADO: { icon: Award, label: 'Certificado' },
  CONSTANCIA: { icon: FileText, label: 'Constancia' },
};

export default function MisCursosPage() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingPreview, setGeneratingPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchInscripciones();
  }, []);

  async function fetchInscripciones() {
    try {
      const response = await fetch('/api/inscripciones');
      if (response.ok) {
        const data = await response.json();
        setInscripciones(data);
      }
    } catch (error) {
      console.error('Error fetching inscripciones:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePreviewCertificate(inscripcionId: string) {
    setGeneratingPreview(inscripcionId);
    try {
      window.open(`/api/certificados/preview/${inscripcionId}`, '_blank');
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setGeneratingPreview(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
          <p className="text-gray-500">Gestiona tus cursos inscritos</p>
        </div>
        <Button asChild>
          <Link href="/cursos">Explorar más cursos</Link>
        </Button>
      </div>

      {inscripciones.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              Aún no tienes cursos inscritos
            </p>
            <p className="text-gray-400 mb-4">
              Explora nuestro catálogo y encuentra el curso ideal para ti
            </p>
            <Button asChild>
              <Link href="/cursos">Ver cursos disponibles</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inscripciones.map((inscripcion) => {
            const tipoInfo = tipoConfig[inscripcion.curso.tipo] || tipoConfig.CERTIFICADO;
            const estadoInfo = estadoConfig[inscripcion.estado] || estadoConfig.PENDIENTE;
            const TipoIcon = tipoInfo.icon;
            const EstadoIcon = estadoInfo.icon;

            return (
              <Card key={inscripcion.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Course Image */}
                    <div className="relative w-full md:w-48 h-32 md:h-auto bg-gray-100 shrink-0">
                      {inscripcion.curso.imagen ? (
                        <Image
                          src={inscripcion.curso.imagen}
                          alt={inscripcion.curso.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-violet-100">
                          <TipoIcon className="h-10 w-10 text-violet-600" />
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-gray-100">
                              <TipoIcon className="h-3 w-3 mr-1" />
                              {tipoInfo.label}
                            </Badge>
                            <Badge className={estadoInfo.color}>
                              <EstadoIcon className="h-3 w-3 mr-1" />
                              {estadoInfo.label}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-gray-900 text-lg mb-2">
                            {inscripcion.curso.nombre}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {inscripcion.curso.horasAcademicas} horas
                            </span>
                            <span>
                              Inscrito: {new Date(inscripcion.fechaInscripcion).toLocaleDateString('es-PE')}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          {inscripcion.estado === 'PENDIENTE' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreviewCertificate(inscripcion.id)}
                                disabled={generatingPreview === inscripcion.id}
                              >
                                {generatingPreview === inscripcion.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Eye className="h-4 w-4 mr-2" />
                                )}
                                Ver certificado (preview)
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Pagar S/ {inscripcion.monto.toFixed(2)}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Realizar Pago</DialogTitle>
                                    <DialogDescription>
                                      Transfiere a la siguiente cuenta y envía tu comprobante.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                      <p className="font-medium mb-2">Datos de pago:</p>
                                      <p className="text-sm text-gray-600">Banco: BCP</p>
                                      <p className="text-sm text-gray-600">Cuenta: 123-456789-0-12</p>
                                      <p className="text-sm text-gray-600">CCI: 00212345678901234567</p>
                                      <p className="text-sm text-gray-600">Titular: CertificadosPerú S.A.C.</p>
                                    </div>
                                    <div className="p-4 bg-violet-50 rounded-lg">
                                      <p className="font-medium text-violet-900 mb-1">
                                        Monto: S/ {inscripcion.monto.toFixed(2)}
                                      </p>
                                      <p className="text-sm text-violet-700">
                                        Curso: {inscripcion.curso.nombre}
                                      </p>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                      Envía tu comprobante de pago a: pagos@certificadosperu.com
                                      o por WhatsApp al 999-999-999
                                    </p>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}

                          {(inscripcion.estado === 'PAGADO' || inscripcion.estado === 'CURSANDO') && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreviewCertificate(inscripcion.id)}
                                disabled={generatingPreview === inscripcion.id}
                              >
                                {generatingPreview === inscripcion.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Eye className="h-4 w-4 mr-2" />
                                )}
                                Ver certificado (preview)
                              </Button>
                              <Button size="sm" asChild>
                                <Link href={`/cursos/${inscripcion.curso.slug}`}>
                                  Ir al curso
                                </Link>
                              </Button>
                            </>
                          )}

                          {inscripcion.estado === 'COMPLETADO' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                              <Link href={`/mi-cuenta/certificados`}>
                                <Award className="h-4 w-4 mr-2" />
                                Ver certificado
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}
