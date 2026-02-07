import { NextRequest, NextResponse } from 'next/server';
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

    const participante = await prisma.participante.findUnique({
      where: { id: session.user.id },
      select: {
        nombreCompleto: true,
        tipoDocumento: true,
        numeroDocumento: true,
        email: true,
        telefono: true,
        direccion: true,
        departamento: true,
        provincia: true,
        distrito: true,
        ocupacion: true,
        centroTrabajo: true,
      },
    });

    return NextResponse.json(participante);
  } catch (error) {
    console.error('Error fetching perfil:', error);
    return NextResponse.json(
      { error: 'Error al obtener perfil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.userType !== 'participante') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const participante = await prisma.participante.update({
      where: { id: session.user.id },
      data: {
        telefono: body.telefono || null,
        direccion: body.direccion || null,
        departamento: body.departamento || null,
        provincia: body.provincia || null,
        distrito: body.distrito || null,
        ocupacion: body.ocupacion || null,
        centroTrabajo: body.centroTrabajo || null,
      },
    });

    return NextResponse.json({
      message: 'Perfil actualizado',
      participante,
    });
  } catch (error) {
    console.error('Error updating perfil:', error);
    return NextResponse.json(
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    );
  }
}
