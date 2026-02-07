import Link from 'next/link';
import {
  Building2,
  Heart,
  GraduationCap,
  Scale,
  Briefcase,
  Laptop,
  Calculator,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Heart,
  GraduationCap,
  Scale,
  Briefcase,
  Laptop,
  Calculator,
  Users,
};

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Building2;

  return (
    <Link href={`/categorias/${category.slug}`}>
      <Card
        className={cn(
          'group h-full transition-all hover:shadow-md hover:-translate-y-1 hover:border-primary/50',
          className
        )}
      >
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110',
              category.color || 'bg-primary/10'
            )}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {category.courseCount} cursos
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
