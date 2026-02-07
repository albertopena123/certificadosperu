import Link from 'next/link';
import { Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const enterpriseBenefits = [
  'Certificados personalizados con tu marca',
  'Panel de administración y reportes',
  'Integración con tu plataforma LMS',
  'Verificación pública de certificados',
  'Soporte prioritario dedicado',
];

export function CTASection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary to-peru-red-dark text-primary-foreground">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">Para Empresas e Instituciones</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              ¿Necesitas emitir certificados para tu organización?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              Ofrece certificados digitales verificables a tus colaboradores, estudiantes o clientes.
              Personaliza con tu marca y gestiona todo desde un panel centralizado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/empresas">
                  Conocer más
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/contacto">Solicitar demo</Link>
              </Button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="font-semibold text-xl mb-6">Incluye:</h3>
            <ul className="space-y-4">
              {enterpriseBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-peru-gold shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
