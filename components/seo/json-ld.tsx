export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'CertificadosPeru',
    alternateName: 'Certificados Peru',
    url: 'https://certificadosperu.com',
    logo: 'https://certificadosperu.com/logo/logoperu.png',
    description:
      'Plataforma de certificados digitales verificables para profesionales peruanos. Cursos con certificación válida para procesos CAS, SERVIR y entidades públicas.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PE',
      addressLocality: 'Lima',
    },
    sameAs: [
      'https://facebook.com/certificadosperu',
      'https://instagram.com/certificadosperu',
      'https://linkedin.com/company/certificadosperu',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CertificadosPeru',
    url: 'https://certificadosperu.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://certificadosperu.com/cursos?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function CourseJsonLd({
  name,
  description,
  provider,
  url,
  image,
  price,
  duration,
}: {
  name: string;
  description: string;
  provider?: string;
  url: string;
  image?: string;
  price?: number;
  duration?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider || 'CertificadosPeru',
      sameAs: 'https://certificadosperu.com',
    },
    url,
    image,
    offers: price
      ? {
          '@type': 'Offer',
          price,
          priceCurrency: 'PEN',
          availability: 'https://schema.org/InStock',
        }
      : undefined,
    hasCourseInstance: duration
      ? {
          '@type': 'CourseInstance',
          courseMode: 'online',
          duration,
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
