// Certificate Types
export type CertificateType = 'certificado' | 'constancia' | 'diploma';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  instructor: Instructor | string;
  category: Category;
  certificateType: CertificateType;
  type?: string; // Alias for filtering (diplomado, certificado, constancia)
  hours: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  image: string;
  featured: boolean;
  bestseller: boolean;
  createdAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio?: string;
  courseCount?: number;
  studentCount?: number;
  rating?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  courseCount: number;
  color?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  content: string;
  rating: number;
  certificateType?: CertificateType;
  courseName?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  icon?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

// Certificate type helpers
export const CERTIFICATE_LABELS: Record<CertificateType, string> = {
  certificado: 'Certificado',
  constancia: 'Constancia',
  diploma: 'Diploma',
};

export const CERTIFICATE_HOURS: Record<CertificateType, string> = {
  certificado: '40+ horas',
  constancia: 'Menos de 40 horas',
  diploma: '120+ horas',
};

export function getCertificateTypeByHours(hours: number): CertificateType {
  if (hours >= 120) return 'diploma';
  if (hours >= 40) return 'certificado';
  return 'constancia';
}
