'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Loader2, GraduationCap, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CourseCard } from '@/components/shared/course-card';
import type { Course } from '@/types';

interface Category {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
}

const tipoConfig: Record<string, { icon: any; label: string; color: string }> = {
  diplomado: { icon: GraduationCap, label: 'Diplomados', color: 'bg-violet-100 text-violet-700' },
  certificado: { icon: Award, label: 'Certificados', color: 'bg-blue-100 text-blue-700' },
  constancia: { icon: FileText, label: 'Constancias', color: 'bg-emerald-100 text-emerald-700' },
};

function CursosContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  useEffect(() => {
    Promise.all([fetchCourses(), fetchCategories()]);
  }, []);

  async function fetchCourses() {
    try {
      const response = await fetch('/api/cursos?limit=100');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categorias');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category?.slug === selectedCategory;
    const matchesType = selectedType === 'all' || course.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const counts = {
    total: courses.length,
    diplomados: courses.filter((c) => c.type === 'diplomado').length,
    certificados: courses.filter((c) => c.type === 'certificado').length,
    constancias: courses.filter((c) => c.type === 'constancia').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Catálogo de Cursos
          </h1>
          <p className="text-violet-100 text-lg max-w-2xl">
            Encuentra el curso ideal para tu desarrollo profesional. Todos nuestros
            certificados son válidos para procesos CAS, SERVIR y concursos públicos.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <span>{counts.diplomados} Diplomados</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>{counts.certificados} Certificados</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>{counts.constancias} Constancias</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name} ({cat.courseCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="diplomado">Diplomados</SelectItem>
                <SelectItem value="certificado">Certificados</SelectItem>
                <SelectItem value="constancia">Constancias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={selectedType === 'all' ? 'default' : 'outline'}
            className={`cursor-pointer ${selectedType === 'all' ? 'bg-violet-600' : ''}`}
            onClick={() => setSelectedType('all')}
          >
            Todos ({counts.total})
          </Badge>
          {Object.entries(tipoConfig).map(([key, config]) => {
            const Icon = config.icon;
            const count = counts[key + 's' as keyof typeof counts] || 0;
            return (
              <Badge
                key={key}
                variant={selectedType === key ? 'default' : 'outline'}
                className={`cursor-pointer ${selectedType === key ? config.color : ''}`}
                onClick={() => setSelectedType(key)}
              >
                <Icon className="h-3 w-3 mr-1" />
                {config.label} ({count})
              </Badge>
            );
          })}
        </div>

        {/* Results count */}
        <p className="text-gray-600 mb-6">
          {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
        </p>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron cursos</p>
            <p className="text-gray-400">Intenta con otros filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} className="h-full" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CursosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    }>
      <CursosContent />
    </Suspense>
  );
}
