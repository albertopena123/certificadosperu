import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || session.user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get inscription with related data
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id },
      include: {
        participante: true,
        curso: true,
      },
    });

    if (!inscripcion) {
      return NextResponse.json(
        { error: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    // Check if certificate already exists for this participant and course
    const certificadoExistente = await prisma.certificado.findFirst({
      where: {
        participanteId: inscripcion.participanteId,
        cursoId: inscripcion.cursoId,
        estado: 'EMITIDO',
      },
    });

    if (certificadoExistente) {
      return NextResponse.json(
        { error: 'Ya existe un certificado para esta inscripción', certificado: certificadoExistente },
        { status: 400 }
      );
    }

    // Only allow emission for paid inscriptions
    if (inscripcion.estado !== 'PAGADO' && inscripcion.estado !== 'CURSANDO' && inscripcion.estado !== 'COMPLETADO') {
      return NextResponse.json(
        { error: 'Solo se pueden emitir certificados para inscripciones con pago verificado' },
        { status: 400 }
      );
    }

    // Generate unique verification code
    const codigoVerificacion = generateVerificationCode();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://certificadosperu.com';
    const urlVerificacion = `${baseUrl}/verificar/${codigoVerificacion}`;

    // Get configuration
    const configs = await prisma.configuracion.findMany({
      where: {
        clave: {
          in: ['institucion_nombre', 'institucion_ruc', 'institucion_direccion', 'firma_director', 'cargo_director'],
        },
      },
    });

    const configMap = configs.reduce((acc: Record<string, string>, c) => {
      acc[c.clave] = c.valor;
      return acc;
    }, {} as Record<string, string>);

    // Calculate dates
    const fechaInicio = inscripcion.curso.fechaInicio || inscripcion.fechaInscripcion;
    const fechaFin = inscripcion.curso.fechaFin || new Date();

    // Create the certificate
    const certificado = await prisma.certificado.create({
      data: {
        participanteId: inscripcion.participanteId,
        cursoId: inscripcion.cursoId,
        nombreCurso: inscripcion.curso.nombre,
        tipoCurso: inscripcion.curso.tipo,
        modalidad: inscripcion.curso.modalidad,
        horasAcademicas: inscripcion.curso.horasAcademicas,
        horasCronologicas: inscripcion.curso.horasCronologicas,
        creditos: inscripcion.curso.creditos,
        temario: (inscripcion.curso.temario as any) || [],
        fechaInicio,
        fechaFin,
        fechaEmision: new Date(),
        institucionNombre: configMap['institucion_nombre'] || 'CertificadosPerú',
        institucionRuc: configMap['institucion_ruc'],
        institucionDireccion: configMap['institucion_direccion'],
        firmantes: [
          {
            nombre: configMap['firma_director'] || 'Director General',
            cargo: configMap['cargo_director'] || 'Director',
          },
        ],
        codigoVerificacion,
        urlVerificacion,
        estado: 'EMITIDO',
        emitidoPorId: session.user.id,
      },
      include: {
        participante: true,
        curso: true,
      },
    });

    // Update inscription status to COMPLETADO
    await prisma.inscripcion.update({
      where: { id },
      data: { estado: 'COMPLETADO' },
    });

    return NextResponse.json(certificado);
  } catch (error) {
    console.error('Error emitting certificate:', error);
    return NextResponse.json(
      { error: 'Error al emitir certificado' },
      { status: 500 }
    );
  }
}
