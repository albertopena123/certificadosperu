import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Award, TrendingUp, FileCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient similar to Udemy */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-500" />

      {/* Decorative circles */}
      <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-400/30 to-transparent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute right-1/4 bottom-0 w-[400px] h-[400px] bg-gradient-to-tl from-pink-400/20 to-transparent rounded-full blur-2xl translate-y-1/2" />

      <div className="container relative py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content - Card style like Udemy */}
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-xl max-w-lg">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Domina hoy las{' '}
              <span className="text-violet-600">habilidades</span>
              {' '}del mañana
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              Potencia tu carrera profesional con certificados digitales válidos para{' '}
              <strong className="text-gray-900">procesos CAS</strong>,{' '}
              <strong className="text-gray-900">SERVIR</strong> y{' '}
              <strong className="text-gray-900">entidades públicas</strong>.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white" asChild>
                <Link href="/cursos">
                  Explorar Cursos
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/verificar">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Verificar Certificado
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side - Image with floating elements */}
          <div className="hidden lg:block relative h-[450px]">
            {/* Main background image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/fondo/fondo.png"
                alt="Profesionales certificados"
                width={500}
                height={450}
                className="object-contain h-full w-auto drop-shadow-2xl"
                priority
              />
            </div>

            {/* Floating cards */}
            <div className="absolute top-4 right-4 bg-white rounded-2xl p-4 shadow-lg animate-float z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">+125,000</p>
                  <p className="text-sm text-gray-500">Certificados emitidos</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/3 -left-4 bg-white rounded-2xl p-4 shadow-lg animate-float-delayed z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Verificación QR</p>
                  <p className="text-sm text-gray-500">Validez instantánea</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 bg-white rounded-2xl p-4 shadow-lg animate-float z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Válido SERVIR</p>
                  <p className="text-sm text-gray-500">Reconocimiento oficial</p>
                </div>
              </div>
            </div>

            {/* Decorative sparkles */}
            <div className="absolute top-1/4 right-1/3 w-8 h-8 text-white/80 z-10">
              <Sparkles className="w-full h-full animate-pulse" />
            </div>
            <div className="absolute bottom-1/3 left-1/4 w-6 h-6 text-cyan-300/80 z-10">
              <Sparkles className="w-full h-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/20">
        <div className="container py-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-white text-sm">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-300" />
              <span>+125,000 certificados</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <span>Verificación instantánea</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-cyan-300" />
              <span>Válido para SERVIR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
