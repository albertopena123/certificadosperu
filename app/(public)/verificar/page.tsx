'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, QrCode, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function VerificarPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (codigo.trim()) {
      router.push(`/verificar/${codigo.trim()}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-violet-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verificar Certificado
          </h1>
          <p className="text-gray-600">
            Ingresa el código de verificación para confirmar la autenticidad de un certificado
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Código de Verificación</CardTitle>
            <CardDescription>
              El código se encuentra en la parte inferior del certificado o al escanear el código QR
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Ej: CERT-ABC12345"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="pl-10 h-12 text-lg font-mono"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" size="lg">
                Verificar Certificado
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Verificación Instantánea</h3>
              <p className="text-sm text-gray-500">
                Resultados en segundos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <QrCode className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Código QR</h3>
              <p className="text-sm text-gray-500">
                Escanea el QR del certificado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">100% Seguro</h3>
              <p className="text-sm text-gray-500">
                Sistema antifraude
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <h3 className="font-semibold text-amber-900 mb-2">
            ¿Dónde encuentro el código?
          </h3>
          <p className="text-amber-800 text-sm">
            El código de verificación se encuentra en la parte inferior de cada certificado,
            junto al código QR. También puedes escanear el código QR con tu celular para
            acceder directamente a la página de verificación.
          </p>
        </div>
      </div>
    </div>
  );
}
