import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CertificateDocument, CertificateData } from '@/lib/certificate-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ inscripcionId: string }> }
) {
  try {
    const session = await auth();
    const { inscripcionId } = await params;

    if (!session || session.user.userType !== 'participante') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get inscription with course and participant data
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id: inscripcionId },
      include: {
        curso: true,
        participante: true,
      },
    });

    if (!inscripcion) {
      return NextResponse.json(
        { error: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    // Verify the inscription belongs to the current user
    if (inscripcion.participanteId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Generate a preview verification code
    const previewCode = `PREVIEW-${inscripcion.id.slice(0, 8).toUpperCase()}`;
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://certificadosperu.com'}/verificar/${previewCode}`;

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 150,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    // Load logos as base64
    let logoDataUrl: string | undefined;
    let logoGobDataUrl: string | undefined;
    let watermarkDataUrl: string | undefined;
    let signatureDataUrl: string | undefined;

    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo', 'logocertificado.jpg');
      const logoBuffer = fs.readFileSync(logoPath);
      logoDataUrl = `data:image/jpeg;base64,${logoBuffer.toString('base64')}`;
    } catch (e) {
      console.warn('Could not load company logo:', e);
    }

    try {
      const logoGobPath = path.join(process.cwd(), 'public', 'logo', 'logoperu.png');
      const logoGobBuffer = fs.readFileSync(logoGobPath);
      logoGobDataUrl = `data:image/png;base64,${logoGobBuffer.toString('base64')}`;
    } catch (e) {
      console.warn('Could not load government logo:', e);
    }

    try {
      const watermarkPath = path.join(process.cwd(), 'public', 'logo', 'peruaprende.png');
      const watermarkBuffer = fs.readFileSync(watermarkPath);
      watermarkDataUrl = `data:image/png;base64,${watermarkBuffer.toString('base64')}`;
    } catch (e) {
      console.warn('Could not load watermark:', e);
    }

    try {
      const signaturePath = path.join(process.cwd(), 'public', 'firma', 'firma.png');
      const signatureBuffer = fs.readFileSync(signaturePath);
      signatureDataUrl = `data:image/png;base64,${signatureBuffer.toString('base64')}`;
    } catch (e) {
      console.warn('Could not load signature:', e);
    }

    // Format dates
    const formatDate = (date: Date | null) => {
      if (!date) return 'Por definir';
      return new Date(date).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    };

    const modalityLabels: Record<string, string> = {
      VIRTUAL: 'Virtual',
      PRESENCIAL: 'Presencial',
      SEMIPRESENCIAL: 'Semipresencial',
    };

    // Prepare certificate data
    const certificateData: CertificateData = {
      participantName: inscripcion.participante.nombreCompleto,
      documentType: inscripcion.participante.tipoDocumento,
      documentNumber: inscripcion.participante.numeroDocumento,
      courseName: inscripcion.curso.nombre,
      courseType: inscripcion.curso.tipo,
      hours: inscripcion.curso.horasAcademicas,
      chronologicalHours: inscripcion.curso.horasCronologicas || undefined,
      credits: inscripcion.curso.creditos || undefined,
      syllabus: (inscripcion.curso.temario as string[]) || [],
      modality: modalityLabels[inscripcion.curso.modalidad] || inscripcion.curso.modalidad,
      startDate: formatDate(inscripcion.curso.fechaInicio),
      endDate: formatDate(inscripcion.curso.fechaFin),
      issueDate: formatDate(new Date()),
      verificationCode: previewCode,
      verificationUrl,
      qrCodeDataUrl,
      logoUrl: logoDataUrl,
      logoGobUrl: logoGobDataUrl,
      watermarkUrl: watermarkDataUrl,
      signatureUrl: signatureDataUrl,
      isPreview: true, // This is a preview, so show watermark
    };

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      <CertificateDocument data={certificateData} />
    );

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="certificado-preview-${inscripcion.curso.slug}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating certificate preview:', error);
    return NextResponse.json(
      { error: 'Error al generar vista previa del certificado' },
      { status: 500 }
    );
  }
}
