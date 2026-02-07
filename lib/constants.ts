import type { NavItem, FooterSection, SocialLink, Benefit, Step, Stat } from '@/types';

export const SITE_CONFIG = {
  name: 'CertificadosPeru',
  description: 'Plataforma de certificados digitales verificables para el mercado peruano. Compatibles con procesos CAS, SERVIR y entidades publicas.',
  url: 'https://certificadosperu.com',
  ogImage: '/og-image.jpg',
  contact: {
    email: 'contacto@certificadosperu.com',
    phone: '+51 999 999 999',
    whatsapp: '+51999999999',
  },
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Categorias',
    href: '/categorias',
    children: [
      { label: 'Administracion Publica', href: '/categorias/administracion-publica' },
      { label: 'Salud', href: '/categorias/salud' },
      { label: 'Educacion', href: '/categorias/educacion' },
      { label: 'Derecho', href: '/categorias/derecho' },
      { label: 'Gestion Empresarial', href: '/categorias/gestion-empresarial' },
      { label: 'Tecnologia', href: '/categorias/tecnologia' },
      { label: 'Contabilidad', href: '/categorias/contabilidad' },
      { label: 'Recursos Humanos', href: '/categorias/recursos-humanos' },
    ],
  },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Verificar Certificado', href: '/verificar' },
  { label: 'Para Empresas', href: '/empresas' },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Categorias Populares',
    links: [
      { label: 'Administracion Publica', href: '/categorias/administracion-publica' },
      { label: 'Salud', href: '/categorias/salud' },
      { label: 'Educacion', href: '/categorias/educacion' },
      { label: 'Derecho', href: '/categorias/derecho' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Centro de Ayuda', href: '/ayuda' },
      { label: 'Verificar Certificado', href: '/verificar' },
      { label: 'Para Empresas', href: '/empresas' },
      { label: 'Preguntas Frecuentes', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terminos y Condiciones', href: '/terminos' },
      { label: 'Politica de Privacidad', href: '/privacidad' },
      { label: 'Politica de Reembolso', href: '/reembolso' },
      { label: 'Libro de Reclamaciones', href: '/reclamaciones' },
    ],
  },
  {
    title: 'Contacto',
    links: [
      { label: 'contacto@certificadosperu.com', href: 'mailto:contacto@certificadosperu.com' },
      { label: '+51 999 999 999', href: 'tel:+51999999999' },
      { label: 'WhatsApp', href: 'https://wa.me/51999999999' },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Facebook', href: 'https://facebook.com/certificadosperu', icon: 'Facebook' },
  { name: 'Instagram', href: 'https://instagram.com/certificadosperu', icon: 'Instagram' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/certificadosperu', icon: 'Linkedin' },
  { name: 'YouTube', href: 'https://youtube.com/certificadosperu', icon: 'Youtube' },
];

export const BENEFITS: Benefit[] = [
  {
    id: '1',
    title: 'Verificacion QR Instantanea',
    description: 'Cada certificado incluye un codigo QR unico que permite verificar su autenticidad en segundos desde cualquier dispositivo.',
    icon: 'QrCode',
  },
  {
    id: '2',
    title: 'Compatible con SERVIR y CAS',
    description: 'Nuestros certificados cumplen con los requisitos de SERVIR y son aceptados en procesos CAS de entidades publicas.',
    icon: 'ShieldCheck',
  },
  {
    id: '3',
    title: 'Emision Digital Inmediata',
    description: 'Recibe tu certificado en formato digital inmediatamente despues de completar el curso. Sin esperas ni tramites.',
    icon: 'Zap',
  },
  {
    id: '4',
    title: 'Respaldo Institucional',
    description: 'Certificados respaldados por instituciones educativas reconocidas y registrados en nuestra plataforma de verificacion.',
    icon: 'Building2',
  },
  {
    id: '5',
    title: 'Horas Academicas Certificadas',
    description: 'Las horas academicas de cada curso estan claramente especificadas y son validas para procesos de evaluacion curricular.',
    icon: 'Clock',
  },
  {
    id: '6',
    title: 'Soporte Permanente',
    description: 'Equipo de soporte disponible para ayudarte con cualquier consulta sobre tus certificados o el proceso de verificacion.',
    icon: 'HeadphonesIcon',
  },
];

export const STEPS: Step[] = [
  {
    id: '1',
    number: 1,
    title: 'Elige tu Curso',
    description: 'Explora nuestro catalogo de cursos y elige el que mejor se adapte a tus necesidades profesionales.',
    icon: 'Search',
  },
  {
    id: '2',
    number: 2,
    title: 'Estudia a tu Ritmo',
    description: 'Accede al contenido desde cualquier dispositivo las 24 horas. Avanza segun tu disponibilidad.',
    icon: 'BookOpen',
  },
  {
    id: '3',
    number: 3,
    title: 'Completa la Evaluacion',
    description: 'Demuestra lo aprendido con nuestra evaluacion final. Puedes intentarlo las veces que necesites.',
    icon: 'FileCheck',
  },
  {
    id: '4',
    number: 4,
    title: 'Obtén tu Certificado',
    description: 'Recibe tu certificado digital verificable inmediatamente. Listo para incluir en tu CV y postulaciones.',
    icon: 'Award',
  },
];

export const STATS: Stat[] = [
  {
    id: '1',
    value: '+125,000',
    label: 'Certificados Emitidos',
    icon: 'Award',
  },
  {
    id: '2',
    value: '+85,000',
    label: 'Estudiantes Activos',
    icon: 'Users',
  },
  {
    id: '3',
    value: '98%',
    label: 'Satisfaccion',
    icon: 'ThumbsUp',
  },
  {
    id: '4',
    value: '+200',
    label: 'Cursos Disponibles',
    icon: 'BookOpen',
  },
];
