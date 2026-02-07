import {
  Search,
  BookOpen,
  FileCheck,
  Award,
  type LucideIcon,
} from 'lucide-react';
import { STEPS } from '@/lib/constants';

const iconMap: Record<string, LucideIcon> = {
  Search,
  BookOpen,
  FileCheck,
  Award,
};

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Cómo funciona?
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            Obtén tu certificado digital en 4 simples pasos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, index) => {
            const Icon = iconMap[step.icon] || Search;
            return (
              <div key={step.id} className="relative">
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary-foreground/20" />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-foreground text-primary flex items-center justify-center mb-4 relative z-10">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-peru-gold text-black text-sm font-bold flex items-center justify-center z-20">
                    {step.number}
                  </span>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
