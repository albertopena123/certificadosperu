import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Listar plantillas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get('tipo');

    const where: any = {};
    if (tipo) {
      where.tipo = tipo;
    }

    const plantillas = await prisma.plantillaCertificado.findMany({
      where,
      orderBy: [
        { esDefault: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        creador: {
          select: { id: true, nombre: true },
        },
      },
    });

    return NextResponse.json(plantillas);
  } catch (error) {
    console.error('Error fetching plantillas:', error);
    return NextResponse.json(
      { error: 'Error al obtener plantillas' },
      { status: 500 }
    );
  }
}

// POST - Crear plantilla
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Si es default, quitar default de otras del mismo tipo
    if (body.esDefault) {
      await prisma.plantillaCertificado.updateMany({
        where: { tipo: body.tipo, esDefault: true },
        data: { esDefault: false },
      });
    }

    const plantilla = await prisma.plantillaCertificado.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        tipo: body.tipo,
        orientacion: body.orientacion || 'HORIZONTAL',
        fondoUrl: body.fondoUrl,
        fondoColor: body.fondoColor,
        config: body.config || getDefaultConfig(),
        activo: body.activo ?? true,
        esDefault: body.esDefault ?? false,
        creadorId: body.creadorId,
      },
    });

    return NextResponse.json(plantilla);
  } catch (error) {
    console.error('Error creating plantilla:', error);
    return NextResponse.json(
      { error: 'Error al crear plantilla' },
      { status: 500 }
    );
  }
}

// Configuración default de posiciones
function getDefaultConfig() {
  return {
    // Fuentes
    fonts: {
      title: { family: 'serif', size: 48, weight: 'bold', color: '#1a1a1a' },
      subtitle: { family: 'serif', size: 24, color: '#4a4a4a' },
      name: { family: 'serif', size: 36, weight: 'bold', color: '#1a1a1a' },
      course: { family: 'sans-serif', size: 20, weight: 'bold', color: '#333333' },
      body: { family: 'sans-serif', size: 12, color: '#555555' },
      small: { family: 'sans-serif', size: 10, color: '#777777' },
    },
    // Elementos y sus posiciones (en porcentaje del documento)
    elements: {
      logo: {
        enabled: true,
        x: 5,
        y: 3,
        width: 15,
        height: 10,
      },
      title: {
        enabled: true,
        x: 50,
        y: 18,
        align: 'center',
        text: 'CERTIFICADO', // Se sobrescribe según tipo
      },
      subtitle: {
        enabled: true,
        x: 50,
        y: 25,
        align: 'center',
        text: 'Otorgado por CertificadosPerú',
      },
      certifyText: {
        enabled: true,
        x: 50,
        y: 33,
        align: 'center',
        text: 'Se certifica que:',
      },
      participantName: {
        enabled: true,
        x: 50,
        y: 42,
        align: 'center',
      },
      participantDocument: {
        enabled: true,
        x: 50,
        y: 48,
        align: 'center',
      },
      courseLabel: {
        enabled: true,
        x: 50,
        y: 55,
        align: 'center',
        text: 'Ha culminado satisfactoriamente el programa de:',
      },
      courseName: {
        enabled: true,
        x: 50,
        y: 62,
        align: 'center',
      },
      courseDetails: {
        enabled: true,
        x: 50,
        y: 70,
        align: 'center',
      },
      syllabus: {
        enabled: true,
        x: 10,
        y: 75,
        width: 80,
        maxItems: 6,
      },
      dates: {
        enabled: true,
        x: 50,
        y: 85,
        align: 'center',
      },
      qrCode: {
        enabled: true,
        x: 8,
        y: 85,
        width: 12,
        height: 12,
      },
      verificationCode: {
        enabled: true,
        x: 8,
        y: 98,
        align: 'center',
      },
      signature1: {
        enabled: true,
        x: 75,
        y: 88,
        width: 20,
        label: 'Director Académico',
        name: 'CertificadosPerú',
      },
      signature2: {
        enabled: false,
        x: 50,
        y: 88,
        width: 20,
        label: '',
        name: '',
      },
      footer: {
        enabled: true,
        x: 50,
        y: 98,
        align: 'center',
        text: 'Verificar en: www.certificadosperu.com/verificar',
      },
    },
    // Decoraciones
    decorations: {
      border: {
        enabled: true,
        color: '#d4af37',
        width: 3,
        style: 'double',
        margin: 15,
      },
      innerBorder: {
        enabled: true,
        color: '#d4af37',
        width: 1,
        style: 'solid',
        margin: 25,
      },
      cornerOrnaments: {
        enabled: true,
        style: 'classic',
        color: '#d4af37',
      },
    },
  };
}
