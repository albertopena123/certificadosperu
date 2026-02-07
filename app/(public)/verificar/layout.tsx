import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verificar Certificado Digital | CertificadosPeru',
  description:
    'Verifica la autenticidad de cualquier certificado emitido por CertificadosPeru. Ingresa el código de verificación o escanea el código QR para confirmar su validez.',
  keywords: [
    'verificar certificado',
    'validar certificado digital',
    'autenticidad certificado Peru',
    'verificacion QR certificado',
    'comprobar certificado',
  ],
  openGraph: {
    title: 'Verificar Certificado | CertificadosPeru',
    description:
      'Sistema de verificación de certificados digitales. Confirma la autenticidad de cualquier certificado en segundos.',
    url: 'https://certificadosperu.com/verificar',
  },
  alternates: {
    canonical: '/verificar',
  },
};

export default function VerificarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
