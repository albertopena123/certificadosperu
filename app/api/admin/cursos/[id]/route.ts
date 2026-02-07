import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener curso por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const curso = await prisma.curso.findUnique({
      where: { id },
      include: {
        categoria: true,
        creador: {
          select: { id: true, nombre: true, email: true },
        },
        _count: {
          select: { inscripciones: true, certificados: true },
        },
      },
    });

    if (!curso) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(curso);
  } catch (error) {
    console.error('Error fetching curso:', error);
    return NextResponse.json(
      { error: 'Error al obtener curso' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar curso
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Generate slug if name changed and slug not provided
    let slug = body.slug;
    if (body.nombre && !slug) {
      slug = body.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const curso = await prisma.curso.update({
      where: { id },
      data: {
        nombre: body.nombre,
        slug: slug,
        descripcion: body.descripcion,
        descripcionCorta: body.descripcionCorta,
        tipo: body.tipo,
        modalidad: body.modalidad,
        horasAcademicas: body.horasAcademicas,
        horasCronologicas: body.horasCronologicas,
        creditos: body.creditos,
        precio: body.precio,
        precioOriginal: body.precioOriginal,
        imagen: body.imagen,
        temario: body.temario || [],
        objetivos: body.objetivos || [],
        requisitos: body.requisitos || [],
        dirigidoA: body.dirigidoA || [],
        activo: body.activo,
        destacado: body.destacado,
        fechaInicio: body.fechaInicio ? new Date(body.fechaInicio) : null,
        fechaFin: body.fechaFin ? new Date(body.fechaFin) : null,
        cupoMaximo: body.cupoMaximo,
        categoria: body.categoriaId ? { connect: { id: body.categoriaId } } : undefined,
      },
    });

    return NextResponse.json(curso);
  } catch (error) {
    console.error('Error updating curso:', error);
    return NextResponse.json(
      { error: 'Error al actualizar curso' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar curso
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar si tiene inscripciones o certificados
    const curso = await prisma.curso.findUnique({
      where: { id },
      include: {
        _count: {
          select: { inscripciones: true, certificados: true },
        },
      },
    });

    if (!curso) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    if (curso._count.inscripciones > 0 || curso._count.certificados > 0) {
      // Solo desactivar si tiene datos relacionados
      await prisma.curso.update({
        where: { id },
        data: { activo: false },
      });
      return NextResponse.json({ message: 'Curso desactivado (tiene inscripciones/certificados)' });
    }

    await prisma.curso.delete({ where: { id } });

    return NextResponse.json({ message: 'Curso eliminado' });
  } catch (error) {
    console.error('Error deleting curso:', error);
    return NextResponse.json(
      { error: 'Error al eliminar curso' },
      { status: 500 }
    );
  }
}
