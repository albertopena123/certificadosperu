import {
  Award,
  Users,
  ThumbsUp,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { STATS } from '@/lib/constants';

const iconMap: Record<string, LucideIcon> = {
  Award,
  Users,
  ThumbsUp,
  BookOpen,
};

export function StatsSection() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Cifras que nos respaldan
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Miles de profesionales peruanos confían en nosotros para impulsar su carrera
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(stat => {
            const Icon = iconMap[stat.icon || ''] || Award;
            return (
              <div key={stat.id} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
