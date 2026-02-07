import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

// Generar código de verificación único
function generarCodigoVerificacion(): string {
  const codigo = randomBytes(6).toString('hex').toUpperCase();
  return `CP-${codigo}`;
}

// GET - Listar certificados
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const tipo = searchParams.get('tipo');
    const estado = searchParams.get('estado');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};

    if (search) {
      where.OR = [
        { codigoVerificacion: { contains: search, mode: 'insensitive' } },
        { nombreCurso: { contains: search, mode: 'insensitive' } },
        { participante: { nombreCompleto: { contains: search, mode: 'insensitive' } } },
        { participante: { numeroDocumento: { contains: search } } },
      ];
    }

    if (tipo && tipo !== 'todos') {
      where.tipoCurso = tipo.toUpperCase();
    }

    if (estado && estado !== 'todos') {
      where.estado = estado.toUpperCase();
    }

    const [certificados, total] = await Promise.all([
      prisma.certificado.findMany({
        where,
        include: {
          participante: true,
          curso: true,
          emitidoPor: {
            select: { id: true, nombre: true },
          },
        },
        orderBy: { fechaEmision: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.certificado.count({ where }),
    ]);

    return NextResponse.json({
      certificados,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching certificados:', error);
    return NextResponse.json(
      { error: 'Error al obtener certificados' },
      { status: 500 }
    );
  }
}

// POST - Emitir certificado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Obtener datos del curso
    const curso = await prisma.curso.findUnique({
      where: { id: body.cursoId },
    });

    if (!curso) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el participante existe
    const participante = await prisma.participante.findUnique({
      where: { id: body.participanteId },
    });

    if (!participante) {
      return NextResponse.json(
        { error: 'Participante no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya tiene certificado para este curso
    const certificadoExistente = await prisma.certificado.findFirst({
      where: {
        participanteId: body.participanteId,
        cursoId: body.cursoId,
        estado: 'EMITIDO',
      },
    });

    if (certificadoExistente) {
      return NextResponse.json(
        { error: 'El participante ya tiene un certificado emitido para este curso' },
        { status: 400 }
      );
    }

    // Generar código único
    let codigoVerificacion = generarCodigoVerificacion();

    // Asegurar que sea único
    let intentos = 0;
    while (intentos < 10) {
      const existe = await prisma.certificado.findUnique({
        where: { codigoVerificacion },
      });
      if (!existe) break;
      codigoVerificacion = generarCodigoVerificacion();
      intentos++;
    }

    // Obtener configuración de la institución
    const configs = await prisma.configuracion.findMany({
      where: {
        clave: {
          in: ['institucion_nombre', 'institucion_ruc', 'institucion_direccion', 'firma_director', 'cargo_director'],
        },
      },
    });

    const configMap = configs.reduce((acc: Record<string, string>, c: { clave: string; valor: string }) => {
      acc[c.clave] = c.valor;
      return acc;
    }, {} as Record<string, string>);

    const urlVerificacion = `${process.env.NEXT_PUBLIC_URL || 'https://certificadosperu.com'}/verificar/${codigoVerificacion}`;

    const certificado = await prisma.certificado.create({
      data: {
        codigoVerificacion,
        nombreCurso: curso.nombre,
        tipoCurso: curso.tipo,
        modalidad: curso.modalidad,
        horasAcademicas: curso.horasAcademicas,
        horasCronologicas: curso.horasCronologicas,
        creditos: curso.creditos,
        temario: curso.temario,
        fechaInicio: body.fechaInicio ? new Date(body.fechaInicio) : new Date(),
        fechaFin: body.fechaFin ? new Date(body.fechaFin) : new Date(),
        institucionNombre: configMap['institucion_nombre'] || 'CertificadosPerú',
        institucionRuc: configMap['institucion_ruc'],
        institucionDireccion: configMap['institucion_direccion'],
        firmantes: body.firmantes || [
          {
            nombre: configMap['firma_director'] || 'Director General',
            cargo: configMap['cargo_director'] || 'Director',
          },
        ],
        estado: 'EMITIDO',
        urlVerificacion,
        nota: body.nota,
        notaLetra: body.notaLetra || 'Aprobado',
        observaciones: body.observaciones,
        participanteId: body.participanteId,
        cursoId: body.cursoId,
        emitidoPorId: body.emitidoPorId,
      },
      include: {
        participante: true,
        curso: true,
      },
    });

    return NextResponse.json(certificado, { status: 201 });
  } catch (error) {
    console.error('Error creating certificado:', error);
    return NextResponse.json(
      { error: 'Error al emitir certificado' },
      { status: 500 }
    );
  }
}
