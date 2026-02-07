import {
  QrCode,
  ShieldCheck,
  Zap,
  Building2,
  Clock,
  HeadphonesIcon,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BENEFITS } from '@/lib/constants';

const iconMap: Record<string, LucideIcon> = {
  QrCode,
  ShieldCheck,
  Zap,
  Building2,
  Clock,
  HeadphonesIcon,
};

export function BenefitsSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Por qué elegir CertificadosPeru?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Certificados digitales con validez oficial, verificación instantánea
            y reconocimiento en entidades públicas y privadas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map(benefit => {
            const Icon = iconMap[benefit.icon] || ShieldCheck;
            return (
              <Card key={benefit.id} className="border-0 shadow-sm bg-muted/30">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
