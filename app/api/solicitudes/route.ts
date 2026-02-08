import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST - Crear solicitud de curso
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cursoSolicitado, descripcion, nombre, email, telefono } = body;

    if (!cursoSolicitado) {
      return NextResponse.json(
        { error: 'El nombre del curso es requerido' },
        { status: 400 }
      );
    }

    // Verificar que al menos tenga un método de contacto
    if (!email && !telefono) {
      return NextResponse.json(
        { error: 'Debes proporcionar un email o teléfono de contacto' },
        { status: 400 }
      );
    }

    const solicitud = await prisma.solicitudCurso.create({
      data: {
        cursoSolicitado,
        descripcion,
        nombre,
        email,
        telefono,
        estado: 'PENDIENTE',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada correctamente',
      solicitud,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating solicitud:', error);
    return NextResponse.json(
      { error: 'Error al enviar solicitud' },
      { status: 500 }
    );
  }
}

// GET - Listar solicitudes (para admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const estado = searchParams.get('estado');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (estado && estado !== 'TODOS') {
      where.estado = estado;
    }

    const [solicitudes, total] = await Promise.all([
      prisma.solicitudCurso.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.solicitudCurso.count({ where }),
    ]);

    return NextResponse.json({
      solicitudes,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching solicitudes:', error);
    return NextResponse.json(
      { error: 'Error al obtener solicitudes' },
      { status: 500 }
    );
  }
}
