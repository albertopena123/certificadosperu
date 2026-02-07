import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.userType !== 'participante') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const participanteId = session.user.id;

    // Get inscriptions with course info
    const inscripciones = await prisma.inscripcion.findMany({
      where: { participanteId },
      include: {
        curso: {
          select: { horasAcademicas: true },
        },
      },
    });

    // Get certificates count
    const certificadosCount = await prisma.certificado.count({
      where: { participanteId },
    });

    // Calculate stats
    const totalCursos = inscripciones.length;
    const cursosCompletados = inscripciones.filter(
      (i) => i.estado === 'COMPLETADO'
    ).length;
    const horasTotales = inscripciones.reduce(
      (total, i) => total + (i.curso?.horasAcademicas || 0),
      0
    );

    return NextResponse.json({
      totalCursos,
      cursosCompletados,
      certificados: certificadosCount,
      horasTotales,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
