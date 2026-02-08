import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH - Actualizar estado de solicitud
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { estado, notas } = body;

    const solicitud = await prisma.solicitudCurso.update({
      where: { id },
      data: {
        ...(estado && { estado }),
        ...(notas !== undefined && { notas }),
      },
    });

    return NextResponse.json(solicitud);
  } catch (error) {
    console.error('Error updating solicitud:', error);
    return NextResponse.json(
      { error: 'Error al actualizar solicitud' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar solicitud
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.solicitudCurso.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting solicitud:', error);
    return NextResponse.json(
      { error: 'Error al eliminar solicitud' },
      { status: 500 }
    );
  }
}
