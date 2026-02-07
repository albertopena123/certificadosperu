'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'cursos',
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al subir imagen');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen');
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  function handleRemove() {
    onChange('');
  }

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleUpload}
        className="hidden"
        disabled={isUploading}
      />

      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-50">
          <Image
            src={value}
            alt="Imagen del curso"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-2 aspect-video w-full rounded-lg border-2 border-dashed cursor-pointer transition-colors',
            isUploading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-violet-400 hover:bg-violet-50'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
              <span className="text-sm text-gray-500">Subiendo...</span>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full bg-gray-100">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-violet-600">
                  Click para subir imagen
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WebP o GIF (máx. 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
