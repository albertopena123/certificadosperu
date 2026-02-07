import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener plantilla por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const plantilla = await prisma.plantillaCertificado.findUnique({
      where: { id },
      include: {
        creador: {
          select: { id: true, nombre: true },
        },
      },
    });

    if (!plantilla) {
      return NextResponse.json(
        { error: 'Plantilla no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(plantilla);
  } catch (error) {
    console.error('Error fetching plantilla:', error);
    return NextResponse.json(
      { error: 'Error al obtener plantilla' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar plantilla
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Si es default, quitar default de otras del mismo tipo
    if (body.esDefault) {
      const current = await prisma.plantillaCertificado.findUnique({
        where: { id },
        select: { tipo: true },
      });

      if (current) {
        await prisma.plantillaCertificado.updateMany({
          where: { tipo: current.tipo, esDefault: true, id: { not: id } },
          data: { esDefault: false },
        });
      }
    }

    const plantilla = await prisma.plantillaCertificado.update({
      where: { id },
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        tipo: body.tipo,
        orientacion: body.orientacion,
        fondoUrl: body.fondoUrl,
        fondoColor: body.fondoColor,
        config: body.config,
        activo: body.activo,
        esDefault: body.esDefault,
      },
    });

    return NextResponse.json(plantilla);
  } catch (error) {
    console.error('Error updating plantilla:', error);
    return NextResponse.json(
      { error: 'Error al actualizar plantilla' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar plantilla
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar que no sea la única default de su tipo
    const plantilla = await prisma.plantillaCertificado.findUnique({
      where: { id },
      select: { tipo: true, esDefault: true },
    });

    if (plantilla?.esDefault) {
      // Buscar otra para hacerla default
      const otra = await prisma.plantillaCertificado.findFirst({
        where: { tipo: plantilla.tipo, id: { not: id }, activo: true },
      });

      if (otra) {
        await prisma.plantillaCertificado.update({
          where: { id: otra.id },
          data: { esDefault: true },
        });
      }
    }

    await prisma.plantillaCertificado.delete({ where: { id } });

    return NextResponse.json({ message: 'Plantilla eliminada' });
  } catch (error) {
    console.error('Error deleting plantilla:', error);
    return NextResponse.json(
      { error: 'Error al eliminar plantilla' },
      { status: 500 }
    );
  }
}
