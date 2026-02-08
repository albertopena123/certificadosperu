'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Clock, X, GraduationCap, Award, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  slug: string;
  image: string;
  type: string;
  instructor?: string;
  category?: {
    name: string;
  };
}

const tipoConfig: Record<string, { icon: any; label: string }> = {
  diplomado: { icon: GraduationCap, label: 'Diplomado' },
  certificado: { icon: Award, label: 'Certificado' },
  constancia: { icon: FileText, label: 'Constancia' },
};

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Search courses when searchTerm changes
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

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
    if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const showDropdown = open && (searchTerm.length > 0 || recentSearches.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full h-10 pl-10 pr-4 border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors",
            showDropdown ? "rounded-t-2xl rounded-b-none border-b-0" : "rounded-full"
          )}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-white border border-t-0 border-gray-300 rounded-b-2xl shadow-lg z-50 max-h-[70vh] overflow-y-auto">
          {/* Recent Searches */}
          {searchTerm.length === 0 && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Búsquedas recientes</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-violet-600 hover:text-violet-700"
                >
                  Borrar
                </button>
              </div>
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(term)}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{term}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search Suggestions */}
          {searchTerm.length > 0 && (
            <>
              {/* Text suggestions */}
              <div className="p-2 border-b">
                <button
                  onClick={() => handleSearch(searchTerm)}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{searchTerm}</span>
                </button>
                {searchTerm.length >= 2 && (
                  <button
                    onClick={() => handleSearch(`curso de ${searchTerm}`)}
                    className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">curso de {searchTerm}</span>
                  </button>
                )}
              </div>

              {/* Course Results */}
              {loading ? (
                <div className="p-4 text-center">
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-violet-600 border-r-transparent" />
                </div>
              ) : courses.length > 0 ? (
                <div className="p-2">
                  <span className="px-3 py-2 text-xs font-medium text-gray-500 uppercase block">Cursos</span>
                  {courses.map((course) => {
                    const tipoInfo = tipoConfig[course.type] || tipoConfig.certificado;
                    const TipoIcon = tipoInfo.icon;

                    return (
                      <button
                        key={course.id}
                        onClick={() => handleCourseClick(course.slug)}
                        className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {/* Course Image */}
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {course.image && course.image !== '/placeholder-course.jpg' ? (
                            <Image
                              src={course.image}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-violet-100">
                              <TipoIcon className="h-5 w-5 text-violet-600" />
                            </div>
                          )}
                        </div>

                        {/* Course Info */}
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
                </div>
              ) : searchTerm.length >= 2 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No se encontraron cursos
                </div>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
}
