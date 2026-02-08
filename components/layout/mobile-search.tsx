'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Clock, ArrowLeft, GraduationCap, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface Course {
  id: string;
  title: string;
  slug: string;
  image: string;
  type: string;
  category?: {
    name: string;
  };
}

const tipoConfig: Record<string, { icon: any; label: string }> = {
  diplomado: { icon: GraduationCap, label: 'Diplomado' },
  certificado: { icon: Award, label: 'Certificado' },
  constancia: { icon: FileText, label: 'Constancia' },
};

export function MobileSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setCourses([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cursos?search=${encodeURIComponent(searchTerm)}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  function saveRecentSearch(term: string) {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }

  function handleSearch(term: string) {
    if (term.trim()) {
      saveRecentSearch(term.trim());
      router.push(`/cursos?q=${encodeURIComponent(term.trim())}`);
      setOpen(false);
      setSearchTerm('');
    }
  }

  function handleCourseClick(slug: string) {
    setOpen(false);
    setSearchTerm('');
    router.push(`/cursos/${slug}`);
  }

  function clearRecentSearches() {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 gap-0 max-w-full h-full sm:max-w-full sm:h-full rounded-none border-0 [&>button]:hidden">
          <VisuallyHidden>
            <DialogTitle>Buscar cursos</DialogTitle>
          </VisuallyHidden>

          {/* Search Header */}
          <div className="flex items-center gap-2 p-3 border-b bg-white sticky top-0 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                autoFocus
                className="w-full h-10 pl-10 pr-10 rounded-full border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {/* Recent Searches */}
            {searchTerm.length === 0 && recentSearches.length > 0 && (
              <div className="bg-white">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <span className="text-sm font-medium text-gray-500">Búsquedas recientes</span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-violet-600"
                  >
                    Borrar
                  </button>
                </div>
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 border-b"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{term}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search Results */}
            {searchTerm.length > 0 && (
              <div className="bg-white">
                {/* Text suggestions */}
                <button
                  onClick={() => handleSearch(searchTerm)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 border-b"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{searchTerm}</span>
                </button>

                {searchTerm.length >= 2 && (
                  <button
                    onClick={() => handleSearch(`curso de ${searchTerm}`)}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 border-b"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">curso de {searchTerm}</span>
                  </button>
                )}

                {/* Loading */}
                {loading && (
                  <div className="p-4 text-center">
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-violet-600 border-r-transparent" />
                  </div>
                )}

                {/* Course Results */}
                {!loading && courses.length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-gray-50">
                      <span className="text-xs font-medium text-gray-500 uppercase">Cursos</span>
                    </div>
                    {courses.map((course) => {
                      const tipoInfo = tipoConfig[course.type] || tipoConfig.certificado;
                      const TipoIcon = tipoInfo.icon;

                      return (
                        <button
                          key={course.id}
                          onClick={() => handleCourseClick(course.slug)}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 border-b"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {course.image && course.image !== '/placeholder-course.jpg' ? (
                              <Image
                                src={course.image}
                                alt={course.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-violet-100">
                                <TipoIcon className="h-6 w-6 text-violet-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {course.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {tipoInfo.label} · {course.category?.name || 'General'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}

                {/* No results */}
                {!loading && searchTerm.length >= 2 && courses.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No se encontraron cursos
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {searchTerm.length === 0 && recentSearches.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Busca cursos, diplomados y certificados</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
