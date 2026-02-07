import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cursos con Certificado para Postular a Trabajos | CertificadosPeru',
  description:
    'Explora nuestro catálogo de cursos online con certificados válidos para procesos CAS, SERVIR y convocatorias del Estado peruano. Diplomados, certificados y constancias con verificación QR.',
  keywords: [
    'cursos con certificado Peru',
    'cursos para postular trabajo estado',
    'diplomados online Peru',
    'certificados CAS SERVIR',
    'cursos virtuales con certificado',
    'capacitacion sector publico',
  ],
  openGraph: {
    title: 'Cursos con Certificado | CertificadosPeru',
    description:
      'Cursos online con certificados válidos para postular a trabajos del Estado. Verificación instantánea con código QR.',
    url: 'https://certificadosperu.com/cursos',
  },
  alternates: {
    canonical: '/cursos',
  },
};

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
