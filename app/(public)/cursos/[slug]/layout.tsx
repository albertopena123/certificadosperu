import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const curso = await prisma.curso.findUnique({
      where: { slug },
      select: {
        nombre: true,
        descripcionCorta: true,
        descripcion: true,
        tipo: true,
        horasAcademicas: true,
        imagen: true,
        categoria: {
          select: { nombre: true },
        },
      },
    });

    if (!curso) {
      return {
        title: 'Curso no encontrado',
      };
    }

    const tipoLabel =
      curso.tipo === 'DIPLOMADO'
        ? 'Diplomado'
        : curso.tipo === 'CERTIFICADO'
        ? 'Certificado'
        : 'Constancia';

    return {
      title: `${curso.nombre} | ${tipoLabel} con Certificado`,
      description:
        curso.descripcionCorta ||
        curso.descripcion?.substring(0, 160) ||
        `${tipoLabel} en ${curso.nombre}. ${curso.horasAcademicas} horas académicas con certificado válido para procesos CAS y SERVIR.`,
      keywords: [
        curso.nombre,
        `${tipoLabel.toLowerCase()} ${curso.nombre}`,
        `curso ${curso.categoria?.nombre || ''}`,
        'certificado digital Peru',
        'cursos CAS SERVIR',
      ],
      openGraph: {
        title: `${curso.nombre} | CertificadosPeru`,
        description:
          curso.descripcionCorta ||
          `${tipoLabel} de ${curso.horasAcademicas} horas con certificado válido para postulaciones laborales.`,
        url: `https://certificadosperu.com/cursos/${slug}`,
        images: curso.imagen
          ? [{ url: curso.imagen, width: 1200, height: 630 }]
          : undefined,
        type: 'website',
      },
      alternates: {
        canonical: `/cursos/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Curso | CertificadosPeru',
    };
  }
}

export default function CursoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
