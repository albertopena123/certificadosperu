'use client';

import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { TESTIMONIALS } from '@/lib/mock-data';
import { CERTIFICATE_LABELS } from '@/types';

export function TestimonialsSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Lo que dicen nuestros estudiantes
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Historias de éxito de profesionales que impulsaron su carrera con nuestros certificados
          </p>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {TESTIMONIALS.map(testimonial => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-2">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <Quote className="h-8 w-8 text-primary/20 mb-4" />
                      <p className="text-muted-foreground mb-6">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? 'fill-peru-gold text-peru-gold'
                                : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={testimonial.avatar}
                            alt={testimonial.name}
                          />
                          <AvatarFallback>
                            {testimonial.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {testimonial.role}
                            {testimonial.company && ` - ${testimonial.company}`}
                          </p>
                        </div>
                      </div>
                      {testimonial.certificateType && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-muted-foreground">
                            Obtuvo:{' '}
                            <Badge variant="secondary" className="ml-1">
                              {CERTIFICATE_LABELS[testimonial.certificateType]}
                            </Badge>
                          </p>
                          {testimonial.courseName && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Curso: {testimonial.courseName}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>
      </div>
    </section>
  );
}
