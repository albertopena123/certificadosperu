import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST - Crear inscripción
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.userType !== 'participante') {
      return NextResponse.json(
        { error: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { cursoId } = body;

    if (!cursoId) {
      return NextResponse.json(
        { error: 'Curso requerido' },
        { status: 400 }
      );
    }

    // Verificar que el curso existe y está activo
    const curso = await prisma.curso.findFirst({
      where: { id: cursoId, activo: true },
      select: {
        id: true,
        nombre: true,
        slug: true,
        precio: true,
        cupoMaximo: true,
      },
    });

    if (!curso) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya está inscrito
    const existingInscription = await prisma.inscripcion.findUnique({
      where: {
        participanteId_cursoId: {
          participanteId: session.user.id,
          cursoId,
        },
      },
    });

    if (existingInscription) {
      return NextResponse.json(
        { error: 'Ya estás inscrito en este curso' },
        { status: 400 }
      );
    }

    // Verificar cupo máximo si existe
    if (curso.cupoMaximo) {
      const inscritosCount = await prisma.inscripcion.count({
        where: { cursoId },
      });

      if (inscritosCount >= curso.cupoMaximo) {
        return NextResponse.json(
          { error: 'El curso ha alcanzado el cupo máximo' },
          { status: 400 }
        );
      }
    }

    // Crear inscripción
    const inscripcion = await prisma.inscripcion.create({
      data: {
        participante: { connect: { id: session.user.id } },
        curso: { connect: { id: cursoId } },
        monto: curso.precio,
        estado: 'PENDIENTE',
      },
      include: {
        curso: {
          select: {
            id: true,
            nombre: true,
            slug: true,
            precio: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: inscripcion.id,
      curso: inscripcion.curso,
      estado: inscripcion.estado,
      monto: inscripcion.monto,
      message: 'Inscripción creada exitosamente',
    });
  } catch (error) {
    console.error('Error creating inscripcion:', error);
    return NextResponse.json(
      { error: 'Error al crear inscripción' },
      { status: 500 }
    );
  }
}

// GET - Obtener inscripciones del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.userType !== 'participante') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const inscripciones = await prisma.inscripcion.findMany({
      where: { participanteId: session.user.id },
      include: {
        curso: {
          select: {
            id: true,
            nombre: true,
            slug: true,
            imagen: true,
            tipo: true,
            modalidad: true,
            horasAcademicas: true,
            precio: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(inscripciones);
  } catch (error) {
    console.error('Error fetching inscripciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener inscripciones' },
      { status: 500 }
    );
  }
}
