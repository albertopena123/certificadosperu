import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      nombreCompleto,
      tipoDocumento,
      numeroDocumento,
      email,
      password,
      telefono,
    } = body;

    // Validaciones básicas
    if (!nombreCompleto || !tipoDocumento || !numeroDocumento || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados' },
        { status: 400 }
      );
    }

    // Verificar si ya existe el email
    const existingEmail = await prisma.participante.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'El correo electrónico ya está registrado' },
        { status: 400 }
      );
    }

    // Verificar si ya existe el documento
    const existingDoc = await prisma.participante.findUnique({
      where: { numeroDocumento },
    });

    if (existingDoc) {
      return NextResponse.json(
        { error: 'El número de documento ya está registrado' },
        { status: 400 }
      );
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear participante
    const participante = await prisma.participante.create({
      data: {
        nombreCompleto,
        tipoDocumento,
        numeroDocumento,
        email,
        password: hashedPassword,
        telefono,
      },
    });

    return NextResponse.json({
      id: participante.id,
      nombreCompleto: participante.nombreCompleto,
      email: participante.email,
      message: 'Registro exitoso',
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
