'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
  Clock,
  Users,
  Award,
  GraduationCap,
  FileText,
  Check,
  Star,
  Play,
  ShoppingCart,
  Loader2,
  ChevronRight,
  Globe,
  MapPin,
  Monitor,
  Calendar,
  BookOpen,
  Target,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  instructor: string;
  hours: number;
  chronologicalHours?: number;
  credits?: number;
  type: string;
  modality: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  syllabus: string[];
  objectives: string[];
  requirements: string[];
  targetAudience: string[];
  startDate?: string;
  endDate?: string;
  maxCapacity?: number;
  enrolledCount: number;
  featured: boolean;
}

const tipoConfig: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
  diplomado: { icon: GraduationCap, color: 'text-violet-700', bgColor: 'bg-violet-100', label: 'Diplomado' },
  certificado: { icon: Award, color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Certificado' },
  constancia: { icon: FileText, color: 'text-emerald-700', bgColor: 'bg-emerald-100', label: 'Constancia' },
};

const modalidadConfig: Record<string, { icon: any; label: string }> = {
  virtual: { icon: Globe, label: 'Virtual' },
  presencial: { icon: MapPin, label: 'Presencial' },
  semipresencial: { icon: Monitor, label: 'Semipresencial' },
};

export default function CursoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchCourse();
    }
  }, [params.slug]);

  async function fetchCourse() {
    try {
      const response = await fetch(`/api/cursos/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      } else {
        router.push('/cursos');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      router.push('/cursos');
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll() {
    if (!session) {
      router.push(`/login?callbackUrl=/cursos/${params.slug}`);
      return;
    }

    setEnrolling(true);
    try {
      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursoId: course?.id }),
      });

      if (response.ok) {
        toast.success('¡Inscripción exitosa!', {
          description: 'Te has inscrito correctamente al curso.',
        });
        router.push('/mi-cuenta/cursos');
      } else {
        const error = await response.json();
        toast.error('Error al inscribirse', {
          description: error.error || 'No se pudo completar la inscripción.',
        });
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Error de conexión', {
        description: 'Verifica tu conexión a internet e intenta nuevamente.',
      });
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Curso no encontrado</p>
      </div>
    );
  }

  const tipoInfo = tipoConfig[course.type] || tipoConfig.certificado;
  const modalidadInfo = modalidadConfig[course.modality] || modalidadConfig.virtual;
  const TipoIcon = tipoInfo.icon;
  const ModalidadIcon = modalidadInfo.icon;

  const discountPercentage = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-violet-600">Inicio</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/cursos" className="hover:text-violet-600">Cursos</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 truncate">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className={`${tipoInfo.bgColor} ${tipoInfo.color}`}>
                  <TipoIcon className="h-3 w-3 mr-1" />
                  {tipoInfo.label}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  <ModalidadIcon className="h-3 w-3 mr-1" />
                  {modalidadInfo.label}
                </Badge>
                {course.featured && (
                  <Badge className="bg-amber-500 text-white">Destacado</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>

              {course.shortDescription && (
                <p className="text-gray-300 text-lg mb-6">
                  {course.shortDescription}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-gray-400">({course.reviewCount} estudiantes)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.hours} horas académicas</span>
                </div>
                {course.credits && course.credits > 0 && (
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>{course.credits} créditos</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Card - Hidden on mobile, shown in sidebar below */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200">
              {course.image && course.image !== '/placeholder-course.jpg' ? (
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${tipoInfo.bgColor}`}>
                  <TipoIcon className={`h-24 w-24 ${tipoInfo.color}`} />
                </div>
              )}
            </div>

            {/* Description */}
            {course.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Descripción del curso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 whitespace-pre-wrap">{course.description}</p>
                </CardContent>
              </Card>
            )}

            {/* What you'll learn */}
            {course.objectives && course.objectives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Lo que aprenderás
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600">{objective}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Syllabus */}
            {course.syllabus && course.syllabus.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Temario del curso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {course.syllabus.map((tema, index) => (
                      <AccordionItem key={index} value={`tema-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-left">{tema}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11 text-gray-500">
                            Contenido del módulo {index + 1}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requisitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Target Audience */}
            {course.targetAudience && course.targetAudience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    ¿A quién va dirigido?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.targetAudience.map((audience, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <Check className="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
                        {audience}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Price Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        S/ {course.price.toFixed(2)}
                      </span>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <span className="text-lg text-gray-400 line-through">
                          S/ {course.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {discountPercentage > 0 && (
                      <Badge className="bg-red-100 text-red-700 mt-2">
                        {discountPercentage}% de descuento
                      </Badge>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full bg-violet-600 hover:bg-violet-700 mb-3"
                    size="lg"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Inscribiendo...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Inscribirse ahora
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-500 mb-6">
                    Acceso inmediato al curso
                  </p>

                  <Separator className="mb-6" />

                  {/* Course includes */}
                  <div className="space-y-3">
                    <p className="font-semibold text-gray-900">Este curso incluye:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 text-violet-600" />
                        <span>{course.hours} horas de contenido</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="h-4 w-4 text-violet-600" />
                        <span>{tipoInfo.label} con código QR verificable</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="h-4 w-4 text-violet-600" />
                        <span>Acceso de por vida</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="h-4 w-4 text-violet-600" />
                        <span>Material descargable</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Check className="h-4 w-4 text-violet-600" />
                        <span>Válido para CAS y SERVIR</span>
                      </div>
                    </div>
                  </div>

                  {/* Alert */}
                  <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                      <p className="text-sm text-amber-800">
                        Podrás ver una vista previa de tu certificado antes de pagar
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
