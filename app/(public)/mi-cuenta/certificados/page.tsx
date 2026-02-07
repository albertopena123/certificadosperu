'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Download,
  ExternalLink,
  GraduationCap,
  FileText,
  Clock,
  Calendar,
  QrCode,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Certificado {
  id: string;
  codigoVerificacion: string;
  nombreCurso: string;
  tipoCurso: string;
  horasAcademicas: number;
  horasCronologicas?: number;
  creditos?: number;
  modalidad: string;
  fechaEmision: string;
  estado: string;
  urlVerificacion: string;
}

const tipoConfig: Record<string, { icon: any; label: string; color: string }> = {
  DIPLOMADO: { icon: GraduationCap, label: 'Diplomado', color: 'bg-violet-100 text-violet-700' },
  CERTIFICADO: { icon: Award, label: 'Certificado', color: 'bg-blue-100 text-blue-700' },
  CONSTANCIA: { icon: FileText, label: 'Constancia', color: 'bg-emerald-100 text-emerald-700' },
};

export default function MisCertificadosPage() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificados();
  }, []);

  async function fetchCertificados() {
    try {
      const response = await fetch('/api/mi-cuenta/certificados');
      if (response.ok) {
        const data = await response.json();
        setCertificados(data);
      }
    } catch (error) {
      console.error('Error fetching certificados:', error);
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Certificados</h1>
        <p className="text-gray-500">Descarga y verifica tus certificados obtenidos</p>
      </div>

      {certificados.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              Aún no tienes certificados
            </p>
            <p className="text-gray-400 mb-4">
              Completa tus cursos para obtener certificados verificables
            </p>
            <Button asChild>
              <Link href="/mi-cuenta/cursos">Ver mis cursos</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certificados.map((cert) => {
            const tipoInfo = tipoConfig[cert.tipoCurso] || tipoConfig.CERTIFICADO;
            const TipoIcon = tipoInfo.icon;

            return (
              <Card key={cert.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-700 text-white pb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="bg-white/20 text-white mb-2">
                        <TipoIcon className="h-3 w-3 mr-1" />
                        {tipoInfo.label}
                      </Badge>
                      <CardTitle className="text-lg text-white">
                        {cert.nombreCurso}
                      </CardTitle>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg">
                      <QrCode className="h-6 w-6" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Clock className="h-4 w-4" />
                        Horas
                      </span>
                      <span className="font-medium">{cert.horasAcademicas} académicas</span>
                    </div>

                    {cert.creditos && cert.creditos > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-500">
                          <Award className="h-4 w-4" />
                          Créditos
                        </span>
                        <span className="font-medium">{cert.creditos}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        Fecha de emisión
                      </span>
                      <span className="font-medium">
                        {new Date(cert.fechaEmision).toLocaleDateString('es-PE')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <CheckCircle className="h-4 w-4" />
                        Código
                      </span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {cert.codigoVerificacion}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        size="sm"
                        className="flex-1 bg-violet-600 hover:bg-violet-700"
                        asChild
                      >
                        <a
                          href={`/api/certificados/download/${cert.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar PDF
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <Link href={`/verificar/${cert.codigoVerificacion}`} target="_blank">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Verificar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="p-2 bg-blue-100 rounded-lg h-fit">
              <QrCode className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Certificados con verificación QR
              </h3>
              <p className="text-sm text-blue-700">
                Todos nuestros certificados incluyen un código QR verificable.
                Cualquier persona puede verificar la autenticidad de tu certificado
                escaneando el código o ingresando el código de verificación en nuestro sitio.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
