import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener certificado por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const certificado = await prisma.certificado.findUnique({
      where: { id },
      include: {
        participante: true,
        curso: {
          include: {
            categoria: true,
          },
        },
        emitidoPor: {
          select: { id: true, nombre: true, email: true },
        },
      },
    });

    if (!certificado) {
      return NextResponse.json(
        { error: 'Certificado no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(certificado);
  } catch (error) {
    console.error('Error fetching certificado:', error);
    return NextResponse.json(
      { error: 'Error al obtener certificado' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar certificado (solo datos editables)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existente = await prisma.certificado.findUnique({
      where: { id },
    });

    if (!existente) {
      return NextResponse.json(
        { error: 'Certificado no encontrado' },
        { status: 404 }
      );
    }

    const certificado = await prisma.certificado.update({
      where: { id },
      data: {
        nota: body.nota,
        notaLetra: body.notaLetra,
        observaciones: body.observaciones,
        fechaInicio: body.fechaInicio ? new Date(body.fechaInicio) : undefined,
        fechaFin: body.fechaFin ? new Date(body.fechaFin) : undefined,
      },
      include: {
        participante: true,
        curso: true,
      },
    });

    return NextResponse.json(certificado);
  } catch (error) {
    console.error('Error updating certificado:', error);
    return NextResponse.json(
      { error: 'Error al actualizar certificado' },
      { status: 500 }
    );
  }
}

// PATCH - Anular o reactivar certificado
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existente = await prisma.certificado.findUnique({
      where: { id },
    });

    if (!existente) {
      return NextResponse.json(
        { error: 'Certificado no encontrado' },
        { status: 404 }
      );
    }

    if (body.action === 'anular') {
      const certificado = await prisma.certificado.update({
        where: { id },
        data: {
          estado: 'ANULADO',
          observaciones: existente.observaciones
            ? `${existente.observaciones}\n[ANULADO: ${body.motivo || 'Sin motivo especificado'}]`
            : `[ANULADO: ${body.motivo || 'Sin motivo especificado'}]`,
        },
      });
      return NextResponse.json(certificado);
    }

    if (body.action === 'reactivar') {
      const certificado = await prisma.certificado.update({
        where: { id },
        data: {
          estado: 'EMITIDO',
        },
      });
      return NextResponse.json(certificado);
    }

    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error patching certificado:', error);
    return NextResponse.json(
      { error: 'Error al modificar certificado' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar certificado (solo si está anulado)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const certificado = await prisma.certificado.findUnique({
      where: { id },
    });

    if (!certificado) {
      return NextResponse.json(
        { error: 'Certificado no encontrado' },
        { status: 404 }
      );
    }

    if (certificado.estado === 'EMITIDO') {
      return NextResponse.json(
        { error: 'No se puede eliminar un certificado emitido. Primero debe anularlo.' },
        { status: 400 }
      );
    }

    await prisma.certificado.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificado:', error);
    return NextResponse.json(
      { error: 'Error al eliminar certificado' },
      { status: 500 }
    );
  }
}
