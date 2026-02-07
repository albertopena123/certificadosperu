'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Printer,
  QrCode,
  Calendar,
  Clock,
  Award,
  User,
  Building,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Certificado {
  id: string;
  codigoVerificacion: string;
  nombreCurso: string;
  tipoCurso: string;
  modalidad: string;
  horasAcademicas: number;
  horasCronologicas?: number;
  creditos?: number;
  temario: string[];
  fechaInicio: string;
  fechaFin: string;
  fechaEmision: string;
  institucionNombre: string;
  institucionRuc?: string;
  institucionDireccion?: string;
  firmantes: Array<{ nombre: string; cargo: string }>;
  estado: string;
  urlVerificacion: string;
  nota?: number;
  notaLetra?: string;
  observaciones?: string;
  participante: {
    id: string;
    nombreCompleto: string;
    tipoDocumento: string;
    numeroDocumento: string;
    email: string;
  };
  curso: {
    id: string;
    nombre: string;
    categoria?: { nombre: string };
  };
  emitidoPor?: {
    id: string;
    nombre: string;
  };
}

const tipoConfig: Record<string, { color: string; label: string }> = {
  DIPLOMADO: { color: 'bg-violet-100 text-violet-700', label: 'Diplomado' },
  CERTIFICADO: { color: 'bg-blue-100 text-blue-700', label: 'Certificado' },
  CONSTANCIA: { color: 'bg-emerald-100 text-emerald-700', label: 'Constancia' },
};

const estadoConfig: Record<string, { icon: any; color: string; label: string }> = {
  EMITIDO: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Emitido' },
  ANULADO: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Anulado' },
};

export default function CertificadoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [certificado, setCertificado] = useState<Certificado | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCertificado(params.id as string);
    }
  }, [params.id]);

  async function fetchCertificado(id: string) {
    try {
      const response = await fetch(`/api/admin/certificados/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCertificado(data);
      } else {
        router.push('/admin/certificados');
      }
    } catch (error) {
      console.error('Error fetching certificado:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  function copyCode() {
    if (certificado) {
      navigator.clipboard.writeText(certificado.codigoVerificacion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!certificado) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Certificado no encontrado</p>
        <Button asChild className="mt-4">
          <Link href="/admin/certificados">Volver a certificados</Link>
        </Button>
      </div>
    );
  }

  const tipoInfo = tipoConfig[certificado.tipoCurso] || tipoConfig.CERTIFICADO;
  const estadoInfo = estadoConfig[certificado.estado] || estadoConfig.EMITIDO;
  const EstadoIcon = estadoInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/certificados">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {certificado.codigoVerificacion}
              </h1>
              <Button variant="ghost" size="sm" onClick={copyCode}>
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-gray-500">Detalles del certificado</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={estadoInfo.color} variant="secondary">
            <EstadoIcon className="h-3 w-3 mr-1" />
            {estadoInfo.label}
          </Badge>
          <Button
            variant="outline"
            onClick={() => window.open(`/api/admin/certificados/${certificado.id}/download?preview=true`, '_blank')}
          >
            <Printer className="h-4 w-4 mr-2" />
            Vista Previa
          </Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700"
            onClick={() => window.open(`/api/admin/certificados/${certificado.id}/download`, '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos del Participante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-violet-600" />
                Datos del Participante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre Completo</p>
                  <p className="font-semibold text-gray-900">
                    {certificado.participante.nombreCompleto}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Documento de Identidad</p>
                  <p className="font-semibold text-gray-900">
                    {certificado.participante.tipoDocumento}: {certificado.participante.numeroDocumento}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Correo Electrónico</p>
                  <p className="font-semibold text-gray-900">{certificado.participante.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datos del Curso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-violet-600" />
                Datos del Curso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge className={tipoInfo.color} variant="secondary">
                  {tipoInfo.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nombre del Curso</p>
                <p className="font-semibold text-gray-900 text-lg">{certificado.nombreCurso}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Horas Académicas</p>
                  <p className="font-semibold text-gray-900">{certificado.horasAcademicas}</p>
                </div>
                {certificado.horasCronologicas && (
                  <div>
                    <p className="text-sm text-gray-500">Horas Cronológicas</p>
                    <p className="font-semibold text-gray-900">{certificado.horasCronologicas}</p>
                  </div>
                )}
                {certificado.creditos && (
                  <div>
                    <p className="text-sm text-gray-500">Créditos</p>
                    <p className="font-semibold text-gray-900">{certificado.creditos}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Modalidad</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {certificado.modalidad.toLowerCase()}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Fecha de Inicio</p>
                  <p className="font-semibold text-gray-900">{formatDate(certificado.fechaInicio)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Fin</p>
                  <p className="font-semibold text-gray-900">{formatDate(certificado.fechaFin)}</p>
                </div>
              </div>
              {certificado.temario && certificado.temario.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Temario</p>
                    <ul className="list-disc list-inside space-y-1">
                      {certificado.temario.map((tema, index) => (
                        <li key={index} className="text-gray-700 text-sm">
                          {tema}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Datos de la Institución */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="h-5 w-5 text-violet-600" />
                Institución Emisora
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Nombre de la Institución</p>
                  <p className="font-semibold text-gray-900">{certificado.institucionNombre}</p>
                </div>
                {certificado.institucionRuc && (
                  <div>
                    <p className="text-sm text-gray-500">RUC</p>
                    <p className="font-semibold text-gray-900">{certificado.institucionRuc}</p>
                  </div>
                )}
                {certificado.institucionDireccion && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="font-semibold text-gray-900">{certificado.institucionDireccion}</p>
                  </div>
                )}
              </div>
              {certificado.firmantes && certificado.firmantes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Firmantes</p>
                    <div className="grid grid-cols-2 gap-4">
                      {certificado.firmantes.map((firmante, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-semibold text-gray-900">{firmante.nombre}</p>
                          <p className="text-sm text-gray-500">{firmante.cargo}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verificación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <QrCode className="h-5 w-5 text-violet-600" />
                Verificación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <QrCode className="h-24 w-24 mx-auto mb-2" />
                  <p className="text-xs">Código QR</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Código de Verificación</p>
                <code className="block mt-1 px-3 py-2 bg-gray-100 rounded text-center font-mono font-bold">
                  {certificado.codigoVerificacion}
                </code>
              </div>
              <div>
                <p className="text-sm text-gray-500">URL de Verificación</p>
                <a
                  href={certificado.urlVerificacion}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-violet-600 hover:underline mt-1"
                >
                  {certificado.urlVerificacion}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Calificación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-violet-600" />
                Calificación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certificado.nota && (
                <div className="text-center">
                  <p className="text-4xl font-bold text-violet-600">{certificado.nota}</p>
                  <p className="text-sm text-gray-500">Nota numérica</p>
                </div>
              )}
              <div className="text-center">
                <Badge className="bg-green-100 text-green-700 text-lg px-4 py-1">
                  {certificado.notaLetra || 'Aprobado'}
                </Badge>
              </div>
              {certificado.observaciones && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Observaciones</p>
                    <p className="text-sm text-gray-700 mt-1">{certificado.observaciones}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Metadatos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-violet-600" />
                Información de Emisión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Fecha de Emisión</p>
                <p className="font-semibold text-gray-900">{formatDate(certificado.fechaEmision)}</p>
              </div>
              {certificado.emitidoPor && (
                <div>
                  <p className="text-sm text-gray-500">Emitido por</p>
                  <p className="font-semibold text-gray-900">{certificado.emitidoPor.nombre}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
