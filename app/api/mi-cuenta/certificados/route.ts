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

    const certificados = await prisma.certificado.findMany({
      where: {
        participanteId: session.user.id,
        estado: 'EMITIDO',
      },
      orderBy: { fechaEmision: 'desc' },
    });

    return NextResponse.json(certificados);
  } catch (error) {
    console.error('Error fetching certificados:', error);
    return NextResponse.json(
      { error: 'Error al obtener certificados' },
      { status: 500 }
    );
  }
}
