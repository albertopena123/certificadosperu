'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: 'default' | 'lg';
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = 'Buscar cursos, certificados...',
  className,
  size = 'default',
  onSearch,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative flex w-full', className)}>
      <div className="relative flex-1">
        <Search
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground',
            size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
          )}
        />
        <Input
          name="query"
          type="search"
          placeholder={placeholder}
          className={cn(
            'pl-10 pr-4 rounded-r-none border-r-0',
            size === 'lg' && 'h-14 text-lg'
          )}
        />
      </div>
      <Button
        type="submit"
        className={cn('rounded-l-none', size === 'lg' && 'h-14 px-8 text-lg')}
      >
        Buscar
      </Button>
    </form>
  );
}
