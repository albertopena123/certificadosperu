import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params;

    // Check if it's a preview code
    if (codigo.startsWith('PREVIEW-')) {
      return NextResponse.json({
        isPreview: true,
        message: 'Este es un certificado de vista previa. No es válido hasta que se complete el pago.',
      });
    }

    // Find the certificate by verification code
    const certificado = await prisma.certificado.findUnique({
      where: { codigoVerificacion: codigo },
      include: {
        participante: {
          select: {
            nombreCompleto: true,
            tipoDocumento: true,
            numeroDocumento: true,
          },
        },
      },
    });

    if (!certificado) {
      return NextResponse.json(
        { error: 'Certificado no encontrado', valid: false },
        { status: 404 }
      );
    }

    if (certificado.estado === 'ANULADO') {
      return NextResponse.json({
        valid: false,
        status: 'ANULADO',
        message: 'Este certificado ha sido anulado.',
      });
    }

    // Return certificate data for verification
    return NextResponse.json({
      valid: true,
      status: certificado.estado,
      certificate: {
        id: certificado.id,
        codigoVerificacion: certificado.codigoVerificacion,
        participante: {
          nombreCompleto: certificado.participante.nombreCompleto,
          tipoDocumento: certificado.participante.tipoDocumento,
          // Only show last 4 digits of document
          numeroDocumento: `****${certificado.participante.numeroDocumento.slice(-4)}`,
        },
        curso: {
          nombre: certificado.nombreCurso,
          tipo: certificado.tipoCurso,
          modalidad: certificado.modalidad,
          horasAcademicas: certificado.horasAcademicas,
          horasCronologicas: certificado.horasCronologicas,
          creditos: certificado.creditos,
        },
        fechas: {
          inicio: certificado.fechaInicio,
          fin: certificado.fechaFin,
          emision: certificado.fechaEmision,
        },
        institucion: {
          nombre: certificado.institucionNombre,
          ruc: certificado.institucionRuc,
        },
        nota: certificado.nota,
        notaLetra: certificado.notaLetra,
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { error: 'Error al verificar certificado' },
      { status: 500 }
    );
  }
}
