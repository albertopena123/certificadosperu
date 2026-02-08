import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Función para normalizar texto (quitar tildes)
function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// GET - Listar cursos públicos (activos)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoria = searchParams.get('categoria');
    const tipo = searchParams.get('tipo');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '12');
    const destacados = searchParams.get('destacados') === 'true';

    const where: any = {
      activo: true,
    };

    if (categoria && categoria !== 'all') {
      where.categoria = {
        slug: categoria,
      };
    }

    if (tipo) {
      where.tipo = tipo.toUpperCase();
    }

    if (destacados) {
      where.destacado = true;
    }

    // Si hay búsqueda, obtener más resultados para filtrar
    const fetchLimit = search ? 100 : limit;

    let cursos = await prisma.curso.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        slug: true,
        descripcion: true,
        descripcionCorta: true,
        tipo: true,
        modalidad: true,
        horasAcademicas: true,
        precio: true,
        precioOriginal: true,
        imagen: true,
        destacado: true,
        createdAt: true,
        temario: true,
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
      orderBy: [
        { destacado: 'desc' },
        { createdAt: 'desc' },
      ],
      take: fetchLimit,
    });

    // Filtrar por búsqueda (insensible a tildes y mayúsculas)
    if (search) {
      const searchNormalized = removeAccents(search.toLowerCase());
      cursos = cursos.filter(curso => {
        const nombre = removeAccents(curso.nombre.toLowerCase());
        const descripcion = removeAccents((curso.descripcion || '').toLowerCase());
        const descripcionCorta = removeAccents((curso.descripcionCorta || '').toLowerCase());

        return nombre.includes(searchNormalized) ||
               descripcion.includes(searchNormalized) ||
               descripcionCorta.includes(searchNormalized);
      }).slice(0, limit);
    }

    // Transformar al formato esperado por el frontend
    const cursosFormateados = cursos.map((curso) => ({
      id: curso.id,
      title: curso.nombre,
      slug: curso.slug,
      description: curso.descripcion || '',
      shortDescription: curso.descripcionCorta || curso.descripcion?.substring(0, 150) || '',
      image: curso.imagen || '/placeholder-course.jpg',
      price: curso.precio,
      originalPrice: curso.precioOriginal,
      rating: 4.5, // TODO: Implementar sistema de ratings
      reviewCount: curso._count.inscripciones,
      studentCount: curso._count.inscripciones,
      instructor: {
        id: 'certificadosperu',
        name: 'CertificadosPerú',
        title: 'Plataforma de Cursos',
        avatar: '/logo/logocertificado.jpg',
      },
      hours: curso.horasAcademicas,
      type: curso.tipo.toLowerCase(),
      certificateType: curso.tipo === 'DIPLOMADO' ? 'diploma' :
                       curso.tipo === 'CERTIFICADO' ? 'certificado' : 'constancia',
      modality: curso.modalidad.toLowerCase(),
      featured: curso.destacado,
      bestseller: curso.destacado,
      createdAt: curso.createdAt.toISOString(),
      category: {
        id: curso.categoria?.id || '',
        name: curso.categoria?.nombre || '',
        slug: curso.categoria?.slug || '',
        description: '',
        icon: '',
        courseCount: 0,
      },
      badges: [
        curso.tipo === 'DIPLOMADO' ? 'Diplomado' :
        curso.tipo === 'CERTIFICADO' ? 'Certificado' : 'Constancia',
        `${curso.horasAcademicas} horas`,
      ],
      highlights: ((curso.temario as string[]) || []).slice(0, 4),
    }));

    return NextResponse.json(cursosFormateados);
  } catch (error) {
    console.error('Error fetching cursos:', error);
    return NextResponse.json(
      { error: 'Error al obtener cursos' },
      { status: 500 }
    );
  }
}
