import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Función para normalizar texto (quitar tildes y minúsculas)
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Diccionario de sinónimos para expandir búsquedas
const synonyms: Record<string, string[]> = {
  'programacion': ['java', 'python', 'php', 'javascript', 'csharp', 'nodejs', 'react', 'angular', 'desarrollo', 'software', 'codigo', 'developer'],
  'desarrollo': ['programacion', 'software', 'web', 'aplicaciones'],
  'web': ['html', 'css', 'javascript', 'frontend', 'backend', 'desarrollo'],
  'ofimatica': ['excel', 'word', 'powerpoint', 'office', 'microsoft'],
  'office': ['excel', 'word', 'powerpoint', 'ofimatica'],
  'enfermeria': ['salud', 'hospital', 'uci', 'emergencia', 'cuidados', 'neonatologia'],
  'salud': ['enfermeria', 'medicina', 'hospital', 'cuidados', 'bioseguridad'],
  'administracion': ['gestion', 'publica', 'empresarial', 'siaf', 'siga', 'estado'],
  'contabilidad': ['finanzas', 'tributacion', 'sunat', 'contador', 'planilla', 'niif'],
  'marketing': ['publicidad', 'digital', 'redes sociales', 'community', 'seo', 'ads'],
  'seguridad': ['sst', 'riesgos', 'iperc', 'prevencion', 'trabajo'],
  'base de datos': ['sql', 'mysql', 'postgresql', 'mongodb', 'database'],
  'cloud': ['aws', 'azure', 'gcp', 'nube', 'devops'],
  'redes': ['networking', 'cisco', 'ccna', 'mikrotik', 'cableado'],
};

// GET - Listar cursos públicos (activos)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoria = searchParams.get('categoria');
    const tipo = searchParams.get('tipo');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '12');
    const destacados = searchParams.get('destacados') === 'true';

    const where: any = {
      activo: true,
    };

    if (categoria && categoria !== 'all') {
      where.categoria = {
        slug: categoria,
      };
    }

    if (tipo) {
      where.tipo = tipo.toUpperCase();
    }

    if (destacados) {
      where.destacado = true;
    }

    // Obtener todos los cursos activos
    let cursos = await prisma.curso.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        slug: true,
        descripcion: true,
        descripcionCorta: true,
        tipo: true,
        modalidad: true,
        horasAcademicas: true,
        precio: true,
        precioOriginal: true,
        imagen: true,
        destacado: true,
        createdAt: true,
        temario: true,
        categoria: {
          select: {
            id: true,
            nombre: true,
            slug: true,
          },
        },
        _count: {
          select: { inscripciones: true },
        },
      },
      orderBy: [
        { destacado: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Búsqueda ESTRICTA
    if (search) {
      const searchNorm = normalize(search);
      // Limpiar palabras comunes que no aportan a la búsqueda
      const stopWords = ['curso', 'cursos', 'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'para', 'con', 'en', 'y', 'o', 'que', 'te', 'digo', 'quiero', 'necesito', 'busco'];
      const searchWords = searchNorm
        .split(/\s+/)
        .filter(w => w.length >= 2 && !stopWords.includes(w));

      if (searchWords.length === 0) {
        // Si solo hay palabras vacías, no buscar
        cursos = cursos.slice(0, limit);
      } else {
        // Expandir términos con sinónimos
        const expandedTerms = new Set<string>(searchWords);
        for (const word of searchWords) {
          if (synonyms[word]) {
            synonyms[word].forEach(syn => expandedTerms.add(normalize(syn)));
          }
          // Buscar sinónimos inversos
          for (const [key, values] of Object.entries(synonyms)) {
            if (values.some(v => normalize(v).includes(word) || word.includes(normalize(v)))) {
              expandedTerms.add(normalize(key));
            }
          }
        }

        // Preparar cursos con campos normalizados
        const cursosIndexados = cursos.map(curso => {
          const nombreNorm = normalize(curso.nombre);
          const descCortaNorm = normalize(curso.descripcionCorta || '');
          const catNorm = normalize(curso.categoria?.nombre || '');

          return {
            ...curso,
            nombreNorm,
            descCortaNorm,
            catNorm,
          };
        });

        // BÚSQUEDA ESTRICTA: Solo devolver si hay coincidencia REAL
        const results: typeof cursos = [];

        for (const curso of cursosIndexados) {
          let score = 0;

          // Verificar coincidencias en el nombre (mayor peso)
          for (const term of expandedTerms) {
            if (curso.nombreNorm.includes(term)) {
              // Coincidencia directa en nombre = alta puntuación
              score += 10;
            }
          }

          // Verificar coincidencias en descripción corta (menor peso)
          for (const term of expandedTerms) {
            if (curso.descCortaNorm.includes(term)) {
              score += 3;
            }
          }

          // Verificar coincidencias en categoría
          for (const term of expandedTerms) {
            if (curso.catNorm.includes(term)) {
              score += 2;
            }
          }

          // Solo incluir si tiene puntuación significativa
          // Mínimo: debe tener al menos UNA coincidencia en el nombre
          // O múltiples coincidencias en otros campos
          if (score >= 5) {
            (curso as any)._score = score;
            results.push(curso);
          }
        }

        // Ordenar por puntuación
        results.sort((a: any, b: any) => (b._score || 0) - (a._score || 0));

        cursos = results.slice(0, limit);
      }
    } else {
      cursos = cursos.slice(0, limit);
    }

    // Transformar al formato esperado por el frontend
    const cursosFormateados = cursos.map((curso) => ({
      id: curso.id,
      title: curso.nombre,
      slug: curso.slug,
      description: curso.descripcion || '',
      shortDescription: curso.descripcionCorta || curso.descripcion?.substring(0, 150) || '',
      image: curso.imagen || '/placeholder-course.jpg',
      price: curso.precio,
      originalPrice: curso.precioOriginal,
      rating: 4.5,
      reviewCount: curso._count.inscripciones,
      studentCount: curso._count.inscripciones,
      instructor: {
        id: 'certificadosperu',
        name: 'CertificadosPerú',
        title: 'Plataforma de Cursos',
        avatar: '/logo/logocertificado.jpg',
      },
      hours: curso.horasAcademicas,
      type: curso.tipo.toLowerCase(),
      certificateType: curso.tipo === 'DIPLOMADO' ? 'diploma' :
                       curso.tipo === 'CERTIFICADO' ? 'certificado' : 'constancia',
      modality: curso.modalidad.toLowerCase(),
      featured: curso.destacado,
      bestseller: curso.destacado,
      createdAt: curso.createdAt.toISOString(),
      category: {
        id: curso.categoria?.id || '',
        name: curso.categoria?.nombre || '',
        slug: curso.categoria?.slug || '',
        description: '',
        icon: '',
        courseCount: 0,
      },
      badges: [
        curso.tipo === 'DIPLOMADO' ? 'Diplomado' :
        curso.tipo === 'CERTIFICADO' ? 'Certificado' : 'Constancia',
        `${curso.horasAcademicas} horas`,
      ],
      highlights: ((curso.temario as string[]) || []).slice(0, 4),
    }));

    return NextResponse.json(cursosFormateados);
  } catch (error) {
    console.error('Error fetching cursos:', error);
    return NextResponse.json(
      { error: 'Error al obtener cursos' },
      { status: 500 }
    );
  }
}
