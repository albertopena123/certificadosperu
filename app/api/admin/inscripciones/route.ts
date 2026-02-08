import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const estado = searchParams.get('estado');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};

    if (estado && estado !== 'TODOS') {
      where.estado = estado;
    }

    if (search) {
      where.OR = [
        { participante: { nombreCompleto: { contains: search, mode: 'insensitive' } } },
        { participante: { numeroDocumento: { contains: search } } },
        { participante: { email: { contains: search, mode: 'insensitive' } } },
        { curso: { nombre: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [inscripciones, total] = await Promise.all([
      prisma.inscripcion.findMany({
        where,
        include: {
          participante: {
            select: {
              id: true,
              nombreCompleto: true,
              email: true,
              telefono: true,
              tipoDocumento: true,
              numeroDocumento: true,
            },
          },
          curso: {
            select: {
              id: true,
              nombre: true,
              slug: true,
              tipo: true,
              modalidad: true,
              horasAcademicas: true,
              precio: true,
            },
          },
        },
        orderBy: { fechaInscripcion: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inscripcion.count({ where }),
    ]);

    // Get certificates for these inscriptions
    const participanteCursoKeys = inscripciones.map(i => ({
      participanteId: i.participanteId,
      cursoId: i.cursoId,
    }));

    const certificados = await prisma.certificado.findMany({
      where: {
        OR: participanteCursoKeys.length > 0 ? participanteCursoKeys : [{ id: 'none' }],
      },
      select: {
        id: true,
        codigoVerificacion: true,
        estado: true,
        participanteId: true,
        cursoId: true,
      },
    });

    // Map certificates to inscriptions
    const inscripcionesConCertificado = inscripciones.map(inscripcion => {
      const certificado = certificados.find(
        c => c.participanteId === inscripcion.participanteId && c.cursoId === inscripcion.cursoId
      );
      return { ...inscripcion, certificado: certificado || null };
    });

    return NextResponse.json({
      inscripciones: inscripcionesConCertificado,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching inscripciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener inscripciones' },
      { status: 500 }
    );
  }
}
