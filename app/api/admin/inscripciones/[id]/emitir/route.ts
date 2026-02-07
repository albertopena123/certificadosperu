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
        certificado: true,
      },
    });

    if (!inscripcion) {
      return NextResponse.json(
        { error: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    // Check if certificate already exists
    if (inscripcion.certificado) {
      return NextResponse.json(
        { error: 'Ya existe un certificado para esta inscripción', certificado: inscripcion.certificado },
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

    // Create the certificate
    const certificado = await prisma.certificado.create({
      data: {
        participanteId: inscripcion.participanteId,
        cursoId: inscripcion.cursoId,
        inscripcionId: inscripcion.id,
        nombreCurso: inscripcion.curso.nombre,
        tipoCurso: inscripcion.curso.tipo,
        modalidad: inscripcion.curso.modalidad,
        horasAcademicas: inscripcion.curso.horasAcademicas,
        horasCronologicas: inscripcion.curso.horasCronologicas,
        creditos: inscripcion.curso.creditos,
        temario: inscripcion.curso.temario || [],
        fechaEmision: new Date(),
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
