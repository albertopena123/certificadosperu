import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PromoBanner } from '@/components/layout/promo-banner';
import { HeroSection } from '@/components/landing/hero-section';
import { CategoriesSection } from '@/components/landing/categories-section';
import { FeaturedCourses } from '@/components/landing/featured-courses';
import { BenefitsSection } from '@/components/landing/benefits-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { StatsSection } from '@/components/landing/stats-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CTASection } from '@/components/landing/cta-section';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <PromoBanner />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
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
