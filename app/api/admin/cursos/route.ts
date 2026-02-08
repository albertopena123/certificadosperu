import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Listar cursos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get('tipo');
    const activo = searchParams.get('activo');
    const search = searchParams.get('search');

    const where: any = {};

    if (tipo && tipo !== 'todos') {
      where.tipo = tipo.toUpperCase();
    }

    if (activo !== null) {
      where.activo = activo === 'true';
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
      ];
    }

    const cursos = await prisma.curso.findMany({
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
        horasCronologicas: true,
        creditos: true,
        precio: true,
        precioOriginal: true,
        imagen: true,
        temario: true,
        objetivos: true,
        requisitos: true,
        dirigidoA: true,
        activo: true,
        destacado: true,
        fechaInicio: true,
        fechaFin: true,
        cupoMaximo: true,
        createdAt: true,
        updatedAt: true,
        categoriaId: true,
        creadorId: true,
        categoria: {
          select: {
            id: true,
            nombre: true,
            slug: true,
          },
        },
        _count: {
          select: { inscripciones: true, certificados: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(cursos);
  } catch (error) {
    console.error('Error fetching cursos:', error);
    return NextResponse.json(
      { error: 'Error al obtener cursos' },
      { status: 500 }
    );
  }
}

// POST - Crear curso
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generar slug
    const slug = body.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Obtener creador (usar admin por defecto si no se especifica)
    let creadorId = body.creadorId;
    if (!creadorId) {
      const admin = await prisma.usuario.findFirst({
        where: { rol: 'SUPERADMIN' },
      });
      creadorId = admin?.id;
    }

    if (!creadorId) {
      return NextResponse.json(
        { error: 'No se encontró un usuario para asignar como creador' },
        { status: 400 }
      );
    }

    const curso = await prisma.curso.create({
      data: {
        nombre: body.nombre,
        slug,
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
        objetivos: body.objetivos,
        requisitos: body.requisitos || [],
        dirigidoA: body.dirigidoA || [],
        activo: body.activo ?? true,
        destacado: body.destacado ?? false,
        fechaInicio: body.fechaInicio ? new Date(body.fechaInicio) : null,
        fechaFin: body.fechaFin ? new Date(body.fechaFin) : null,
        cupoMaximo: body.cupoMaximo,
        categoria: {
          connect: { id: body.categoriaId }
        },
        creador: {
          connect: { id: creadorId }
        },
      },
      select: { id: true, nombre: true, slug: true },
    });

    return NextResponse.json(curso, { status: 201 });
  } catch (error) {
    console.error('Error creating curso:', error);
    return NextResponse.json(
      { error: 'Error al crear curso' },
      { status: 500 }
    );
  }
}
