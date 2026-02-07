'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Heart, GraduationCap, Scale, Briefcase, Laptop, Calculator, Users, BookOpen, Loader2, type LucideIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
  courseCount: number;
}

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Heart,
  GraduationCap,
  Scale,
  Briefcase,
  Laptop,
  Calculator,
  Users,
  BookOpen,
};

const gradientMap: Record<string, string> = {
  'bg-blue-500': 'from-blue-500 to-blue-600',
  'bg-red-500': 'from-rose-500 to-red-600',
  'bg-green-500': 'from-emerald-500 to-green-600',
  'bg-purple-500': 'from-violet-500 to-purple-600',
  'bg-orange-500': 'from-orange-500 to-amber-600',
  'bg-cyan-500': 'from-cyan-500 to-teal-600',
  'bg-emerald-500': 'from-emerald-500 to-teal-600',
  'bg-pink-500': 'from-pink-500 to-rose-600',
};

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categorias');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container">
        {/* Header with text on left */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-start">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Aprende habilidades{' '}
              <em className="not-italic text-violet-600">esenciales</em> para tu
              carrera profesional
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              CertificadosPerú te ayuda a desarrollar competencias demandadas y a
              avanzar en tu carrera en el sector público y privado.
            </p>
            <Link
              href="/categorias"
              className="inline-flex items-center gap-2 mt-6 text-violet-600 font-semibold hover:text-violet-700 transition-colors group"
            >
              Ver todas las categorías
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Category cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.slice(0, 6).map((category) => {
              const Icon = iconMap[category.icon] || BookOpen;
              const gradient = category.color ? (gradientMap[category.color] || 'from-gray-500 to-gray-600') : 'from-gray-500 to-gray-600';

              return (
                <Link
                  key={category.id}
                  href={`/categorias/${category.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-violet-300 hover:shadow-lg transition-all duration-300"
                >
                  {/* Gradient header */}
                  <div className={`h-32 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full" />
                      <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-4 left-4 w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7 text-gray-800" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        {category.courseCount} cursos
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
