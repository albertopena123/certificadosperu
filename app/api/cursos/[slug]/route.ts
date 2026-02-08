import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener curso por slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const curso = await prisma.curso.findFirst({
      where: { slug, activo: true },
      select: {
        id: true,
        nombre: true,
        slug: true,
        descripcion: true,
        descripcionCorta: true,
        tipo: true,
        modalidad: true,
        horasAcademicas: true,
        horasCronologicas: true,
        creditos: true,
        precio: true,
        precioOriginal: true,
        imagen: true,
        temario: true,
        objetivos: true,
        requisitos: true,
        dirigidoA: true,
        destacado: true,
        fechaInicio: true,
        fechaFin: true,
        cupoMaximo: true,
        categoria: {
          select: {
            id: true,
            nombre: true,
            slug: true,
          },
        },
        _count: {
          select: { inscripciones: true },
        },
      },
    });

    if (!curso) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Transformar al formato del frontend
    const cursoFormateado = {
      id: curso.id,
      title: curso.nombre,
      slug: curso.slug,
      description: curso.descripcion,
      shortDescription: curso.descripcionCorta,
      image: curso.imagen || '/placeholder-course.jpg',
      price: curso.precio,
      originalPrice: curso.precioOriginal,
      rating: 4.5,
      reviewCount: curso._count.inscripciones,
      instructor: 'CertificadosPerú',
      hours: curso.horasAcademicas,
      chronologicalHours: curso.horasCronologicas,
      credits: curso.creditos,
      type: curso.tipo.toLowerCase(),
      modality: curso.modalidad.toLowerCase(),
      category: {
        id: curso.categoria?.id,
        name: curso.categoria?.nombre,
        slug: curso.categoria?.slug,
      },
      syllabus: (curso.temario as string[]) || [],
      objectives: (curso.objetivos as string[]) || [],
      requirements: (curso.requisitos as string[]) || [],
      targetAudience: (curso.dirigidoA as string[]) || [],
      startDate: curso.fechaInicio,
      endDate: curso.fechaFin,
      maxCapacity: curso.cupoMaximo,
      enrolledCount: curso._count.inscripciones,
      featured: curso.destacado,
    };

    return NextResponse.json(cursoFormateado);
  } catch (error) {
    console.error('Error fetching curso:', error);
    return NextResponse.json(
      { error: 'Error al obtener curso' },
      { status: 500 }
    );
  }
}
