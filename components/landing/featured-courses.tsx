'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/shared/course-card';
import { cn } from '@/lib/utils';
import type { Course } from '@/types';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function FeaturedCourses() {
  const [activeTab, setActiveTab] = useState('all');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cursosRes, categoriasRes] = await Promise.all([
          fetch('/api/cursos?limit=12'),
          fetch('/api/categorias'),
        ]);

        if (cursosRes.ok) {
          const cursosData = await cursosRes.json();
          setCourses(cursosData);
        }

        if (categoriasRes.ok) {
          const categoriasData = await categoriasRes.json();
          setCategories(categoriasData.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const categoryTabs = [
    { id: 'all', name: 'Todos' },
    ...categories.map(cat => ({ id: cat.slug, name: cat.name })),
  ];

  const filteredCourses = activeTab === 'all'
    ? courses
    : courses.filter(course => course.category?.slug === activeTab);

  const displayedCourses = filteredCourses.slice(0, 8);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Habilidades para transformar tu carrera profesional
            </h2>
            <p className="text-gray-600">
              Próximamente tendremos cursos disponibles para ti.
            </p>
          </div>
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No hay cursos disponibles aún.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Habilidades para transformar tu carrera profesional
          </h2>
          <p className="text-gray-600">
            Desde habilidades esenciales hasta temas técnicos, CertificadosPerú respalda tu desarrollo profesional.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6 overflow-x-auto pb-px scrollbar-hide">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setScrollPosition(0);
                }}
                className={cn(
                  'whitespace-nowrap pb-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid with Navigation */}
        <div className="relative">
          {/* Navigation Arrows */}
          {displayedCourses.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border-gray-200 hover:bg-gray-50 hidden lg:flex h-12 w-12 rounded-full"
                onClick={() => setScrollPosition(Math.max(0, scrollPosition - 1))}
                disabled={scrollPosition === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border-gray-200 hover:bg-gray-50 hidden lg:flex h-12 w-12 rounded-full"
                onClick={() => setScrollPosition(Math.min(displayedCourses.length - 4, scrollPosition + 1))}
                disabled={scrollPosition >= displayedCourses.length - 4}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Courses */}
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(-${scrollPosition * (100 / 4 + 1)}%)`,
              }}
            >
              {displayedCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] h-full"
                >
                  <CourseCard course={course} className="h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Link */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" className="border-gray-900 text-gray-900 hover:bg-gray-100" asChild>
            <Link href="/cursos">
              Ver todos los cursos
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
