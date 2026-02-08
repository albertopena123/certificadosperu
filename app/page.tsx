import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PromoBanner } from '@/components/layout/promo-banner';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturedCourses } from '@/components/landing/featured-courses';
import { BenefitsSection } from '@/components/landing/benefits-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { StatsSection } from '@/components/landing/stats-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CTASection } from '@/components/landing/cta-section';
import { OrganizationJsonLd, WebsiteJsonLd, FAQJsonLd } from '@/components/seo/json-ld';

const faqData = [
  {
    question: '¿Los certificados son válidos para postular a trabajos del Estado?',
    answer: 'Sí, nuestros certificados digitales son válidos para procesos CAS, convocatorias SERVIR y postulaciones a entidades públicas del Perú. Incluyen código QR de verificación.',
  },
  {
    question: '¿Cómo puedo verificar un certificado?',
    answer: 'Puedes verificar cualquier certificado ingresando el código único en nuestra página de verificación o escaneando el código QR incluido en el certificado.',
  },
  {
    question: '¿Cuánto tiempo toma recibir mi certificado?',
    answer: 'El certificado digital se genera automáticamente al completar el curso y aprobar la evaluación. Lo recibes de forma inmediata en tu correo electrónico.',
  },
  {
    question: '¿Los certificados tienen horas académicas?',
    answer: 'Sí, todos nuestros cursos especifican las horas académicas certificadas, las cuales son válidas para tu evaluación curricular en postulaciones laborales.',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <FAQJsonLd questions={faqData} />
      <PromoBanner />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCourses />
        <BenefitsSection />
        <HowItWorks />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
