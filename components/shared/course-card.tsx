'use client';

import Link from 'next/link';
import { Star, Clock, Users, Check, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import type { Course } from '@/types';
import { CERTIFICATE_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  const discountPercentage = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  // Course highlights for the popover
  const highlights = [
    `${course.hours} horas de contenido`,
    'Certificado con código QR verificable',
    'Acceso de por vida',
    'Válido para procesos CAS y SERVIR',
    'Material descargable incluido',
  ];

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href={`/cursos/${course.slug}`} className={cn('block group h-full', className)}>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow h-full flex flex-col">
            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-gray-100 flex-shrink-0">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                style={{
                  backgroundImage: `url(${course.image})`,
                  backgroundColor: '#f3f4f6',
                }}
              />
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-grow">
              <h3 className="font-bold text-gray-900 line-clamp-2 text-sm leading-snug mb-1 min-h-[2.5rem]">
                {course.title}
              </h3>

              <p className="text-xs text-gray-500 mb-1.5 truncate">
                {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'CertificadosPerú'}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-1.5">
                <span className="font-bold text-sm text-amber-700">{course.rating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < Math.floor(course.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200'
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  ({course.reviewCount?.toLocaleString() || 0})
                </span>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-2">
                {course.bestseller && (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs px-1.5 py-0 font-medium">
                    Lo más vendido
                  </Badge>
                )}
                <span className="text-xs text-gray-500">
                  {course.hours} horas
                </span>
              </div>

              {/* Price - pushed to bottom */}
              <div className="flex items-baseline gap-2 mt-auto pt-2">
                <span className="font-bold text-gray-900">
                  S/ {course.price?.toFixed(2) || '0.00'}
                </span>
                {course.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    S/ {course.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </HoverCardTrigger>

      {/* Hover Popover */}
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-80 p-0 shadow-xl border-0 z-50"
      >
        <div className="p-4">
          {/* Title */}
          <h4 className="font-bold text-gray-900 text-base mb-1 leading-tight">
            {course.title}
          </h4>

          {/* Meta info */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-xs">
              {CERTIFICATE_LABELS[course.certificateType]}
            </Badge>
            <span>{course.hours} horas totales</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Highlights */}
          <ul className="space-y-2 mb-4">
            {highlights.slice(0, 4).map((highlight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-gray-700 mt-0.5 shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold" asChild>
              <Link href={`/cursos/${course.slug}`}>
                Añadir al carrito
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="shrink-0 border-gray-900">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
