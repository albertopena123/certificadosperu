import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed...');

  // Hash de la contraseña del admin
  const hashedPassword = await bcrypt.hash('admin123', 12);

  // Crear usuario administrador
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@certificadosperu.com' },
    update: {
      password: hashedPassword, // Actualizar password hasheado
    },
    create: {
      nombre: 'Administrador',
      email: 'admin@certificadosperu.com',
      password: hashedPassword,
      rol: 'SUPERADMIN',
      activo: true,
    },
  });
  console.log('✅ Usuario admin creado:', admin.email);

  // Crear categorías
  const categorias = [
    { nombre: 'Administración Pública', slug: 'administracion-publica', icono: 'Building2', color: 'bg-blue-500', descripcion: 'Cursos especializados en gestión y administración del sector público peruano.' },
    { nombre: 'Salud', slug: 'salud', icono: 'Heart', color: 'bg-red-500', descripcion: 'Formación para profesionales de la salud con certificación válida.' },
    { nombre: 'Educación', slug: 'educacion', icono: 'GraduationCap', color: 'bg-green-500', descripcion: 'Capacitación docente y pedagógica con horas cronológicas certificadas.' },
    { nombre: 'Derecho', slug: 'derecho', icono: 'Scale', color: 'bg-purple-500', descripcion: 'Actualización jurídica y legal para profesionales del derecho.' },
    { nombre: 'Gestión Empresarial', slug: 'gestion-empresarial', icono: 'Briefcase', color: 'bg-orange-500', descripcion: 'Habilidades de gestión y liderazgo para el mundo empresarial.' },
    { nombre: 'Tecnología', slug: 'tecnologia', icono: 'Laptop', color: 'bg-cyan-500', descripcion: 'Cursos de tecnología, programación y transformación digital.' },
    { nombre: 'Contabilidad', slug: 'contabilidad', icono: 'Calculator', color: 'bg-emerald-500', descripcion: 'Contabilidad, finanzas y normativa tributaria actualizada.' },
    { nombre: 'Recursos Humanos', slug: 'recursos-humanos', icono: 'Users', color: 'bg-pink-500', descripcion: 'Gestión del talento humano y desarrollo organizacional.' },
  ];

  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categorías creadas:', categorias.length);

  // Obtener la categoría de Administración Pública para crear cursos
  const catAdminPublica = await prisma.categoria.findUnique({
    where: { slug: 'administracion-publica' },
  });

  const catSalud = await prisma.categoria.findUnique({
    where: { slug: 'salud' },
  });

  const catTecnologia = await prisma.categoria.findUnique({
    where: { slug: 'tecnologia' },
  });

  if (catAdminPublica && catSalud && catTecnologia) {
    // Crear cursos de ejemplo
    const cursos = [
      {
        nombre: 'Gestión Pública y Modernización del Estado',
        slug: 'gestion-publica-modernizacion-estado',
        descripcion: 'Aprende los fundamentos de la gestión pública moderna y las reformas del Estado peruano. Curso completo con enfoque práctico.',
        descripcionCorta: 'Fundamentos de la gestión pública moderna en Perú.',
        tipo: 'DIPLOMADO' as const,
        modalidad: 'VIRTUAL' as const,
        horasAcademicas: 120,
        horasCronologicas: 90,
        creditos: 4,
        precio: 299,
        precioOriginal: 499,
        temario: [
          'Módulo 1: Introducción a la Gestión Pública',
          'Módulo 2: Modernización del Estado Peruano',
          'Módulo 3: Políticas Públicas',
          'Módulo 4: Gestión por Resultados',
          'Módulo 5: Ética en la Función Pública',
        ],
        objetivos: ['Formar profesionales capaces de gestionar eficientemente las entidades públicas.'],
        requisitos: ['Título profesional o bachiller', 'Experiencia mínima de 1 año en sector público'],
        dirigidoA: ['Servidores públicos', 'Profesionales que desean ingresar al sector público'],
        activo: true,
        destacado: true,
        categoriaId: catAdminPublica.id,
        creadorId: admin.id,
      },
      {
        nombre: 'SIAF - Sistema Integrado de Administración Financiera',
        slug: 'siaf-sistema-integrado-administracion-financiera',
        descripcion: 'Domina el SIAF-SP: registro de operaciones, ejecución presupuestal y reportes financieros del sector público.',
        descripcionCorta: 'Aprende a usar el SIAF-SP de manera práctica.',
        tipo: 'CERTIFICADO' as const,
        modalidad: 'VIRTUAL' as const,
        horasAcademicas: 60,
        horasCronologicas: 45,
        creditos: 2,
        precio: 149,
        precioOriginal: 249,
        temario: [
          'Módulo 1: Introducción al SIAF-SP',
          'Módulo 2: Registro de Operaciones',
          'Módulo 3: Ejecución Presupuestal',
          'Módulo 4: Reportes y Consultas',
        ],
        objetivos: ['Capacitar en el uso del Sistema Integrado de Administración Financiera.'],
        requisitos: ['Conocimientos básicos de contabilidad'],
        dirigidoA: ['Contadores', 'Personal administrativo del sector público'],
        activo: true,
        destacado: true,
        categoriaId: catAdminPublica.id,
        creadorId: admin.id,
      },
      {
        nombre: 'Primeros Auxilios y RCP Básico',
        slug: 'primeros-auxilios-rcp-basico',
        descripcion: 'Aprende técnicas de primeros auxilios y reanimación cardiopulmonar. Certificado válido para trabajadores de salud.',
        descripcionCorta: 'Primeros auxilios y RCP con certificación.',
        tipo: 'CONSTANCIA' as const,
        modalidad: 'PRESENCIAL' as const,
        horasAcademicas: 16,
        horasCronologicas: 12,
        precio: 59,
        precioOriginal: 99,
        temario: [
          'Tema 1: Evaluación de la escena',
          'Tema 2: RCP Básico',
          'Tema 3: Atragantamiento',
          'Tema 4: Hemorragias y heridas',
        ],
        objetivos: ['Capacitar en técnicas básicas de primeros auxilios.'],
        requisitos: [],
        dirigidoA: ['Público en general', 'Personal de salud', 'Brigadistas'],
        activo: true,
        destacado: false,
        categoriaId: catSalud.id,
        creadorId: admin.id,
      },
      {
        nombre: 'Excel Avanzado para la Gestión Pública',
        slug: 'excel-avanzado-gestion-publica',
        descripcion: 'Excel avanzado con enfoque en reportes, dashboards y automatización para el sector público.',
        descripcionCorta: 'Excel avanzado aplicado al sector público.',
        tipo: 'CONSTANCIA' as const,
        modalidad: 'VIRTUAL' as const,
        horasAcademicas: 24,
        horasCronologicas: 18,
        precio: 79,
        precioOriginal: 149,
        temario: [
          'Tema 1: Funciones avanzadas',
          'Tema 2: Tablas dinámicas',
          'Tema 3: Dashboards',
          'Tema 4: Macros básicas',
        ],
        objetivos: ['Dominar Excel para la gestión y análisis de datos.'],
        requisitos: ['Conocimientos básicos de Excel'],
        dirigidoA: ['Personal administrativo', 'Analistas'],
        activo: true,
        destacado: true,
        categoriaId: catTecnologia.id,
        creadorId: admin.id,
      },
    ];

    for (const curso of cursos) {
      await prisma.curso.upsert({
        where: { slug: curso.slug },
        update: {},
        create: curso,
      });
    }
    console.log('✅ Cursos creados:', cursos.length);
  }

  // Crear configuraciones iniciales
  const configs = [
    { clave: 'institucion_nombre', valor: 'CertificadosPerú', descripcion: 'Nombre de la institución' },
    { clave: 'institucion_ruc', valor: '20123456789', descripcion: 'RUC de la institución' },
    { clave: 'institucion_direccion', valor: 'Av. Principal 123, Lima, Perú', descripcion: 'Dirección de la institución' },
    { clave: 'firma_director', valor: 'Dr. Juan Pérez García', descripcion: 'Nombre del director para firmas' },
    { clave: 'cargo_director', valor: 'Director General', descripcion: 'Cargo del director' },
  ];

  for (const config of configs) {
    await prisma.configuracion.upsert({
      where: { clave: config.clave },
      update: {},
      create: config,
    });
  }
  console.log('✅ Configuraciones creadas:', configs.length);

  console.log('🎉 Seed completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
