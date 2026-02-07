import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

// GET - Listar participantes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};

    if (search) {
      where.OR = [
        { nombreCompleto: { contains: search, mode: 'insensitive' } },
        { numeroDocumento: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [participantes, total] = await Promise.all([
      prisma.participante.findMany({
        where,
        include: {
          _count: {
            select: { inscripciones: true, certificados: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.participante.count({ where }),
    ]);

    return NextResponse.json({
      participantes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching participantes:', error);
    return NextResponse.json(
      { error: 'Error al obtener participantes' },
      { status: 500 }
    );
  }
}

// POST - Crear participante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificar si ya existe
    const existe = await prisma.participante.findFirst({
      where: {
        OR: [
          { numeroDocumento: body.numeroDocumento },
          { email: body.email },
        ],
      },
    });

    if (existe) {
      return NextResponse.json(
        { error: 'Ya existe un participante con ese documento o email' },
        { status: 400 }
      );
    }

    // Generate default password (document number)
    const defaultPassword = await hash(body.numeroDocumento, 12);

    const participante = await prisma.participante.create({
      data: {
        nombreCompleto: body.nombreCompleto,
        tipoDocumento: body.tipoDocumento,
        numeroDocumento: body.numeroDocumento,
        email: body.email,
        password: defaultPassword,
        telefono: body.telefono,
        direccion: body.direccion,
        departamento: body.departamento,
        provincia: body.provincia,
        distrito: body.distrito,
        ocupacion: body.ocupacion,
        centroTrabajo: body.centroTrabajo,
      },
    });

    return NextResponse.json(participante, { status: 201 });
  } catch (error) {
    console.error('Error creating participante:', error);
    return NextResponse.json(
      { error: 'Error al crear participante' },
      { status: 500 }
    );
  }
}
