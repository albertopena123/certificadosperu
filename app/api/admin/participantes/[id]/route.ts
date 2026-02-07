import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener participante por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const participante = await prisma.participante.findUnique({
      where: { id },
      include: {
        inscripciones: {
          include: {
            curso: true,
          },
          orderBy: { fechaInscripcion: 'desc' },
        },
        certificados: {
          orderBy: { fechaEmision: 'desc' },
        },
      },
    });

    if (!participante) {
      return NextResponse.json(
        { error: 'Participante no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(participante);
  } catch (error) {
    console.error('Error fetching participante:', error);
    return NextResponse.json(
      { error: 'Error al obtener participante' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar participante
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verificar si existe
    const existente = await prisma.participante.findUnique({
      where: { id },
    });

    if (!existente) {
      return NextResponse.json(
        { error: 'Participante no encontrado' },
        { status: 404 }
      );
    }

    // Verificar duplicados (excluyendo el actual)
    if (body.numeroDocumento || body.email) {
      const duplicado = await prisma.participante.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                body.numeroDocumento ? { numeroDocumento: body.numeroDocumento } : {},
                body.email ? { email: body.email } : {},
              ].filter((obj) => Object.keys(obj).length > 0),
            },
          ],
        },
      });

      if (duplicado) {
        return NextResponse.json(
          { error: 'Ya existe otro participante con ese documento o email' },
          { status: 400 }
        );
      }
    }

    const participante = await prisma.participante.update({
      where: { id },
      data: {
        nombreCompleto: body.nombreCompleto,
        tipoDocumento: body.tipoDocumento,
        numeroDocumento: body.numeroDocumento,
        email: body.email,
        telefono: body.telefono,
        direccion: body.direccion,
        departamento: body.departamento,
        provincia: body.provincia,
        distrito: body.distrito,
        ocupacion: body.ocupacion,
        centroTrabajo: body.centroTrabajo,
      },
    });

    return NextResponse.json(participante);
  } catch (error) {
    console.error('Error updating participante:', error);
    return NextResponse.json(
      { error: 'Error al actualizar participante' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar participante
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar si tiene certificados emitidos
    const participante = await prisma.participante.findUnique({
      where: { id },
      include: {
        _count: {
          select: { certificados: true, inscripciones: true },
        },
      },
    });

    if (!participante) {
      return NextResponse.json(
        { error: 'Participante no encontrado' },
        { status: 404 }
      );
    }

    if (participante._count.certificados > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un participante con certificados emitidos' },
        { status: 400 }
      );
    }

    // Eliminar inscripciones primero
    await prisma.inscripcion.deleteMany({
      where: { participanteId: id },
    });

    // Eliminar participante
    await prisma.participante.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting participante:', error);
    return NextResponse.json(
      { error: 'Error al eliminar participante' },
      { status: 500 }
    );
  }
}
