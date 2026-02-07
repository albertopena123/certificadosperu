import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Obtener estadísticas
    const [
      totalCursos,
      totalParticipantes,
      totalCertificados,
      cursosActivos,
      diplomados,
      certificados,
      constancias,
      ultimosInscritos,
      cursosPopulares,
    ] = await Promise.all([
      prisma.curso.count(),
      prisma.participante.count(),
      prisma.certificado.count(),
      prisma.curso.count({ where: { activo: true } }),
      prisma.curso.count({ where: { tipo: 'DIPLOMADO' } }),
      prisma.curso.count({ where: { tipo: 'CERTIFICADO' } }),
      prisma.curso.count({ where: { tipo: 'CONSTANCIA' } }),
      prisma.inscripcion.findMany({
        take: 5,
        orderBy: { fechaInscripcion: 'desc' },
        include: {
          participante: true,
          curso: true,
        },
      }),
      prisma.curso.findMany({
        take: 4,
        orderBy: { inscripciones: { _count: 'desc' } },
        include: {
          _count: { select: { inscripciones: true } },
        },
      }),
    ]);

    // Calcular ingresos del mes
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const inscripcionesMes = await prisma.inscripcion.aggregate({
      where: {
        fechaInscripcion: { gte: inicioMes },
        estado: { in: ['PAGADO', 'COMPLETADO'] },
      },
      _sum: { monto: true },
      _count: true,
    });

    return NextResponse.json({
      stats: {
        totalCursos,
        totalParticipantes,
        totalCertificados,
        cursosActivos,
        diplomados,
        certificados,
        constancias,
        ingresosMes: inscripcionesMes._sum.monto || 0,
        inscripcionesMes: inscripcionesMes._count,
      },
      ultimosInscritos: ultimosInscritos.map((i) => ({
        id: i.id,
        nombre: i.participante.nombreCompleto,
        curso: i.curso.nombre,
        tipo: i.curso.tipo.toLowerCase(),
        fecha: i.fechaInscripcion,
      })),
      cursosPopulares: cursosPopulares.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        tipo: c.tipo.toLowerCase(),
        inscritos: c._count.inscripciones,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del dashboard' },
      { status: 500 }
    );
  }
}
