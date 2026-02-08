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
  { params }: { params: Promise<{ certificadoId: string }> }
) {
  try {
    const session = await auth();
    const { certificadoId } = await params;

    if (!session || session.user.userType !== 'participante') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get certificate with participant data
    const certificado = await prisma.certificado.findUnique({
      where: { id: certificadoId },
      include: {
        participante: true,
        curso: true,
      },
    });

    if (!certificado) {
      return NextResponse.json(
        { error: 'Certificado no encontrado' },
        { status: 404 }
      );
    }

    // Verify the certificate belongs to the current user
    if (certificado.participanteId !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Verify certificate is issued (not draft or cancelled)
    if (certificado.estado !== 'EMITIDO') {
      return NextResponse.json(
        { error: 'Este certificado no está disponible para descarga' },
        { status: 400 }
      );
    }

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(certificado.urlVerificacion, {
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

    // Prepare certificate data - NO WATERMARK (isPreview = false)
    const certificateData: CertificateData = {
      participantName: certificado.participante.nombreCompleto,
      documentType: certificado.participante.tipoDocumento,
      documentNumber: certificado.participante.numeroDocumento,
      courseName: certificado.nombreCurso,
      courseType: certificado.tipoCurso,
      hours: certificado.horasAcademicas,
      chronologicalHours: certificado.horasCronologicas || undefined,
      credits: certificado.creditos || undefined,
      syllabus: (certificado.temario as string[]) || [],
      modality: modalityLabels[certificado.modalidad] || certificado.modalidad,
      startDate: formatDate(certificado.fechaInicio),
      endDate: formatDate(certificado.fechaFin),
      issueDate: formatDate(certificado.fechaEmision),
      verificationCode: certificado.codigoVerificacion,
      verificationUrl: certificado.urlVerificacion,
      qrCodeDataUrl,
      logoUrl: logoDataUrl,
      logoGobUrl: logoGobDataUrl,
      watermarkUrl: watermarkDataUrl,
      signatureUrl: signatureDataUrl,
      isPreview: false, // Final certificate - no "VISTA PREVIA" text
    };

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      <CertificateDocument data={certificateData} />
    );

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificado-${certificado.codigoVerificacion}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating certificate download:', error);
    return NextResponse.json(
      { error: 'Error al generar el certificado' },
      { status: 500 }
    );
  }
}
