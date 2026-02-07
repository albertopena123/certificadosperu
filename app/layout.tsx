import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CertificadosPeru - Certificados Digitales Verificables",
    template: "%s | CertificadosPeru",
  },
  description:
    "Plataforma de certificados digitales verificables para el mercado peruano. Certificados compatibles con procesos CAS, SERVIR y entidades publicas. Verificacion instantanea con codigo QR.",
  keywords: [
    "certificados digitales",
    "certificados Peru",
    "certificados SERVIR",
    "certificados CAS",
    "cursos online Peru",
    "capacitacion online",
    "certificados verificables",
    "diplomas digitales",
    "constancias digitales",
    "educacion continua Peru",
  ],
  authors: [{ name: "CertificadosPeru" }],
  creator: "CertificadosPeru",
  publisher: "CertificadosPeru",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://certificadosperu.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CertificadosPeru - Certificados Digitales Verificables",
    description:
      "Obtén certificados digitales válidos para procesos CAS, SERVIR y entidades públicas. Verificación instantánea con código QR.",
    url: "https://certificadosperu.com",
    siteName: "CertificadosPeru",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CertificadosPeru - Certificados Digitales Verificables",
    description:
      "Obtén certificados digitales válidos para procesos CAS, SERVIR y entidades públicas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
