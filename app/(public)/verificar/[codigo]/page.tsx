'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  GraduationCap,
  FileText,
  User,
  Calendar,
  Clock,
  Building2,
  Loader2,
  Search,
  Eye,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface VerificationResult {
  valid?: boolean;
  isPreview?: boolean;
  status?: string;
  message?: string;
  error?: string;
  certificate?: {
    id: string;
    codigoVerificacion: string;
    participante: {
      nombreCompleto: string;
      tipoDocumento: string;
      numeroDocumento: string;
    };
    curso: {
      nombre: string;
      tipo: string;
      modalidad: string;
      horasAcademicas: number;
      horasCronologicas?: number;
      creditos?: number;
    };
    fechas: {
      inicio: string;
      fin: string;
      emision: string;
    };
    institucion: {
      nombre: string;
      ruc?: string;
    };
    nota?: number;
    notaLetra?: string;
  };
}

const tipoConfig: Record<string, { icon: any; label: string; color: string }> = {
  DIPLOMADO: { icon: GraduationCap, label: 'Diplomado', color: 'text-violet-600' },
  CERTIFICADO: { icon: Award, label: 'Certificado', color: 'text-blue-600' },
  CONSTANCIA: { icon: FileText, label: 'Constancia', color: 'text-emerald-600' },
};

export default function VerificarCertificadoPage() {
  const params = useParams();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState('');

  useEffect(() => {
    if (params.codigo) {
      verifyCertificate(params.codigo as string);
    }
  }, [params.codigo]);

  async function verifyCertificate(codigo: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/verificar/${codigo}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchCode.trim()) {
      window.location.href = `/verificar/${searchCode.trim()}`;
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-gray-500">Verificando certificado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-3xl">
        {/* Search Form - Only show when no valid certificate is displayed */}
        {!(result?.valid && result?.certificate) && (
          <Card className="mb-8">
            <CardContent className="py-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Ingresa el código de verificación"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Verificar</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Preview Warning */}
        {result?.isPreview && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="py-8 text-center">
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-amber-800 mb-2">
                Vista Previa
              </h2>
              <p className="text-amber-700">
                {result.message}
              </p>
              <Button asChild className="mt-6">
                <Link href="/cursos">Ver cursos disponibles</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Not Found */}
        {result?.error && !result?.isPreview && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Certificado No Encontrado
              </h2>
              <p className="text-red-700">
                El código de verificación ingresado no corresponde a ningún certificado en nuestro sistema.
              </p>
              <p className="text-red-600 text-sm mt-2">
                Verifica que el código esté escrito correctamente.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Annulled Certificate */}
        {result?.valid === false && result?.status === 'ANULADO' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Certificado Anulado
              </h2>
              <p className="text-red-700">
                {result.message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Valid Certificate */}
        {result?.valid && result?.certificate && (
          <Card className="overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Certificado Válido
              </h2>
              <p className="text-green-100">
                Este certificado es auténtico y fue emitido por CertificadosPerú
              </p>
            </div>

            <CardContent className="p-6">
              {/* Verification Code */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-1">Código de verificación</p>
                <p className="font-mono text-lg font-bold text-gray-900">
                  {result.certificate.codigoVerificacion}
                </p>
              </div>

              <Separator className="mb-6" />

              {/* Participant Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Datos del Participante
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg font-medium text-gray-900">
                    {result.certificate.participante.nombreCompleto}
                  </p>
                  <p className="text-sm text-gray-500">
                    {result.certificate.participante.tipoDocumento}: {result.certificate.participante.numeroDocumento}
                  </p>
                </div>
              </div>

              {/* Course Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  {(() => {
                    const tipoInfo = tipoConfig[result.certificate.curso.tipo] || tipoConfig.CERTIFICADO;
                    const TipoIcon = tipoInfo.icon;
                    return <TipoIcon className={`h-5 w-5 ${tipoInfo.color}`} />;
                  })()}
                  Datos del Curso
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2">
                        {tipoConfig[result.certificate.curso.tipo]?.label || 'Certificado'}
                      </Badge>
                      <p className="font-medium text-gray-900">
                        {result.certificate.curso.nombre}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Horas Académicas</p>
                      <p className="font-semibold">{result.certificate.curso.horasAcademicas}</p>
                    </div>
                    {result.certificate.curso.horasCronologicas && (
                      <div>
                        <p className="text-xs text-gray-500">Horas Cronológicas</p>
                        <p className="font-semibold">{result.certificate.curso.horasCronologicas}</p>
                      </div>
                    )}
                    {result.certificate.curso.creditos && (
                      <div>
                        <p className="text-xs text-gray-500">Créditos</p>
                        <p className="font-semibold">{result.certificate.curso.creditos}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Modalidad</p>
                      <p className="font-semibold capitalize">{result.certificate.curso.modalidad.toLowerCase()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Fecha de Emisión
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{formatDate(result.certificate.fechas.emision)}</p>
                </div>
              </div>

              {/* Grade if exists */}
              {result.certificate.nota && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Calificación</h3>
                  <div className="bg-green-50 p-4 rounded-lg inline-block">
                    <p className="text-2xl font-bold text-green-700">
                      {result.certificate.nota}
                    </p>
                    {result.certificate.notaLetra && (
                      <p className="text-sm text-green-600">{result.certificate.notaLetra}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Issued by */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Emitido por
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">
                    {result.certificate.institucion.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    Plataforma de cursos y certificaciones
                  </p>
                </div>
              </div>

              {/* View/Download Certificate Button */}
              <Separator className="mb-6" />
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700"
                  asChild
                >
                  <a
                    href={`/api/verificar/${result.certificate.codigoVerificacion}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Ver Certificado
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                >
                  <a
                    href={`/api/verificar/${result.certificate.codigoVerificacion}/pdf?download=true`}
                    download
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Descargar PDF
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Este sistema de verificación permite confirmar la autenticidad
            de los certificados emitidos por CertificadosPerú.
          </p>
          <p className="mt-2">
            ¿Tienes dudas?{' '}
            <Link href="/contacto" className="text-violet-600 hover:underline">
              Contáctanos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
