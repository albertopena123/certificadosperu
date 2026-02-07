import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FOOTER_SECTIONS, SITE_CONFIG } from '@/lib/constants';

const socialIcons = {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
};

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/logo/logocertificado.jpg"
                alt="CertificadosPerú"
                width={200}
                height={55}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Plataforma de certificados digitales verificables para el mercado peruano.
              Compatibles con procesos CAS, SERVIR y entidades publicas.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="https://facebook.com/certificadosperu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://instagram.com/certificadosperu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://linkedin.com/company/certificadosperu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://youtube.com/certificadosperu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {FOOTER_SECTIONS.map(section => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CertificadosPeru. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terminos" className="hover:text-foreground transition-colors">
              Terminos
            </Link>
            <Link href="/privacidad" className="hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="/reclamaciones" className="hover:text-foreground transition-colors">
              Libro de Reclamaciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
