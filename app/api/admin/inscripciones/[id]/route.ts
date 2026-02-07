import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
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

    return NextResponse.json(inscripcion);
  } catch (error) {
    console.error('Error fetching inscripcion:', error);
    return NextResponse.json(
      { error: 'Error al obtener inscripción' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const body = await request.json();
    const { estado, observaciones } = body;

    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id },
    });

    if (!inscripcion) {
      return NextResponse.json(
        { error: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (estado) {
      updateData.estado = estado;

      // Si se aprueba el pago, registrar la fecha
      if (estado === 'PAGADO' && inscripcion.estado === 'PENDIENTE') {
        updateData.fechaPago = new Date();
      }
    }

    if (observaciones !== undefined) {
      updateData.observaciones = observaciones;
    }

    const updatedInscripcion = await prisma.inscripcion.update({
      where: { id },
      data: updateData,
      include: {
        participante: true,
        curso: true,
        certificado: true,
      },
    });

    return NextResponse.json(updatedInscripcion);
  } catch (error) {
    console.error('Error updating inscripcion:', error);
    return NextResponse.json(
      { error: 'Error al actualizar inscripción' },
      { status: 500 }
    );
  }
}
