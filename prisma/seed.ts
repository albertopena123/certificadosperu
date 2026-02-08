import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Función para generar precio aleatorio entre min y max
function randomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Imágenes por categoría (Unsplash)
const imagenesPorCategoria: Record<string, string[]> = {
  'administracion-publica': [
    'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800',
    'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800',
    'https://images.unsplash.com/photo-1577415124269-fc1140815f6e?w=800',
  ],
  'salud': [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800',
  ],
  'enfermeria': [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800',
    'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800',
  ],
  'educacion': [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800',
  ],
  'derecho': [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
  ],
  'gestion-empresarial': [
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
  ],
  'tecnologia': [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
  ],
  'contabilidad': [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800',
  ],
  'recursos-humanos': [
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
  ],
  'veterinaria': [
    'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
  ],
  'ofimatica': [
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800',
    'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
  ],
  'seguridad-trabajo': [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
  ],
  'medio-ambiente': [
    'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
  ],
  'logistica': [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800',
  ],
  'marketing-digital': [
    'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800',
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  ],
  'comercio-exterior': [
    'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
  ],
  'mineria': [
    'https://images.unsplash.com/photo-1605918321755-0b5faa5e4796?w=800',
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  ],
  'calidad': [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  ],
  'construccion': [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
  ],
  'coaching': [
    'https://images.unsplash.com/photo-1475823678248-624fc6f85785?w=800',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800',
  ],
  'agronomia': [
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
  ],
  'turismo': [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  ],
  'gastronomia': [
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
  ],
};

function getImagen(categoria: string, index: number): string {
  const imgs = imagenesPorCategoria[categoria] || imagenesPorCategoria['tecnologia'];
  return imgs[index % imgs.length];
}

async function main() {
  console.log('🌱 Iniciando seed completo para el mercado peruano...');

  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@certificadosperu.com' },
    update: { password: hashedPassword },
    create: {
      nombre: 'Administrador',
      email: 'admin@certificadosperu.com',
      password: hashedPassword,
      rol: 'SUPERADMIN',
      activo: true,
    },
  });
  console.log('✅ Usuario admin creado:', admin.email);

  // CATEGORÍAS
  const categorias = [
    { nombre: 'Administración Pública', slug: 'administracion-publica', icono: 'Building2', color: 'bg-blue-500', descripcion: 'Gestión pública, SERVIR, CAS y modernización del Estado.' },
    { nombre: 'Salud', slug: 'salud', icono: 'Heart', color: 'bg-red-500', descripcion: 'Formación para profesionales de la salud.' },
    { nombre: 'Enfermería', slug: 'enfermeria', icono: 'Heart', color: 'bg-pink-500', descripcion: 'Cursos para profesionales y técnicos de enfermería.' },
    { nombre: 'Educación', slug: 'educacion', icono: 'GraduationCap', color: 'bg-green-500', descripcion: 'Capacitación docente con horas cronológicas.' },
    { nombre: 'Derecho', slug: 'derecho', icono: 'Scale', color: 'bg-purple-500', descripcion: 'Actualización jurídica y legal.' },
    { nombre: 'Gestión Empresarial', slug: 'gestion-empresarial', icono: 'Briefcase', color: 'bg-orange-500', descripcion: 'Gestión, liderazgo y emprendimiento.' },
    { nombre: 'Tecnología', slug: 'tecnologia', icono: 'Laptop', color: 'bg-cyan-500', descripcion: 'Programación, desarrollo web y transformación digital.' },
    { nombre: 'Contabilidad y Finanzas', slug: 'contabilidad', icono: 'Calculator', color: 'bg-emerald-500', descripcion: 'Contabilidad, tributación SUNAT y finanzas.' },
    { nombre: 'Recursos Humanos', slug: 'recursos-humanos', icono: 'Users', color: 'bg-pink-500', descripcion: 'Gestión del talento humano y planillas.' },
    { nombre: 'Veterinaria', slug: 'veterinaria', icono: 'Heart', color: 'bg-amber-500', descripcion: 'Formación para médicos veterinarios.' },
    { nombre: 'Ofimática', slug: 'ofimatica', icono: 'Laptop', color: 'bg-blue-400', descripcion: 'Microsoft Office y herramientas de productividad.' },
    { nombre: 'Seguridad y Salud en el Trabajo', slug: 'seguridad-trabajo', icono: 'Shield', color: 'bg-yellow-500', descripcion: 'SST, IPERC y ley 29783.' },
    { nombre: 'Medio Ambiente', slug: 'medio-ambiente', icono: 'Leaf', color: 'bg-green-600', descripcion: 'Gestión ambiental y normativa peruana.' },
    { nombre: 'Logística y Compras Públicas', slug: 'logistica', icono: 'Truck', color: 'bg-indigo-500', descripcion: 'OSCE, SEACE y contrataciones del estado.' },
    { nombre: 'Marketing Digital', slug: 'marketing-digital', icono: 'TrendingUp', color: 'bg-rose-500', descripcion: 'Redes sociales, SEO y e-commerce.' },
    { nombre: 'Comercio Exterior', slug: 'comercio-exterior', icono: 'Globe', color: 'bg-teal-500', descripcion: 'Importación, exportación y aduanas.' },
    { nombre: 'Minería', slug: 'mineria', icono: 'Mountain', color: 'bg-stone-500', descripcion: 'Seguridad minera y operaciones.' },
    { nombre: 'Calidad', slug: 'calidad', icono: 'CheckCircle', color: 'bg-sky-500', descripcion: 'ISO 9001, ISO 14001 e ISO 45001.' },
    { nombre: 'Construcción', slug: 'construccion', icono: 'Building', color: 'bg-amber-600', descripcion: 'Supervisión de obras y metrados.' },
    { nombre: 'Coaching', slug: 'coaching', icono: 'Users', color: 'bg-fuchsia-500', descripcion: 'Coaching e inteligencia emocional.' },
    { nombre: 'Agronomía', slug: 'agronomia', icono: 'Leaf', color: 'bg-lime-500', descripcion: 'Agricultura y riego tecnificado.' },
    { nombre: 'Turismo y Hotelería', slug: 'turismo', icono: 'Plane', color: 'bg-cyan-500', descripcion: 'Gestión hotelera y turismo.' },
    { nombre: 'Gastronomía', slug: 'gastronomia', icono: 'ChefHat', color: 'bg-orange-500', descripcion: 'Cocina, pastelería y bartender.' },
  ];

  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Categorías creadas:', categorias.length);

  const cats = await prisma.categoria.findMany();
  const catMap: Record<string, string> = {};
  for (const c of cats) {
    catMap[c.slug] = c.id;
  }

  // DEFINICIÓN DE CURSOS SIMPLIFICADA
  interface CursoData {
    nombre: string;
    slug: string;
    descripcion: string;
    descripcionCorta: string;
    tipo: 'DIPLOMADO' | 'CERTIFICADO' | 'CONSTANCIA';
    horasAcademicas: number;
    temario: string[];
    categoria: string;
    destacado?: boolean;
  }

  const cursosData: CursoData[] = [
    // ADMINISTRACIÓN PÚBLICA
    { nombre: 'Gestión Pública y Modernización del Estado', slug: 'gestion-publica-modernizacion-estado', descripcion: 'Programa integral sobre gestión pública moderna, políticas públicas y reforma del Estado peruano.', descripcionCorta: 'Gestión pública moderna en Perú.', tipo: 'DIPLOMADO', horasAcademicas: 420, temario: ['Marco Normativo', 'Modernización del Estado', 'Políticas Públicas', 'Gestión por Resultados', 'Presupuesto por Resultados', 'Control Gubernamental', 'Gobierno Digital'], categoria: 'administracion-publica', destacado: true },
    { nombre: 'SIAF - Sistema Integrado de Administración Financiera', slug: 'siaf-sp', descripcion: 'Curso práctico del SIAF-SP: registro de operaciones y ejecución presupuestal.', descripcionCorta: 'Domina el SIAF-SP.', tipo: 'CERTIFICADO', horasAcademicas: 120, temario: ['Introducción al SIAF', 'Módulo Administrativo', 'Operaciones de Gasto', 'Operaciones de Ingreso', 'Conciliación'], categoria: 'administracion-publica', destacado: true },
    { nombre: 'SIGA - Sistema de Gestión Administrativa', slug: 'siga-sp', descripcion: 'Gestión logística, patrimonial y de personal con SIGA.', descripcionCorta: 'Sistema SIGA para gestión pública.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Introducción al SIGA', 'Módulo Logística', 'Módulo Patrimonio', 'Módulo Tesorería', 'Reportes'], categoria: 'administracion-publica' },
    { nombre: 'Ley SERVIR y Gestión de RRHH Públicos', slug: 'ley-servir-rrhh', descripcion: 'Ley del Servicio Civil, régimen CAS, D.L. 276 y D.L. 728.', descripcionCorta: 'Ley SERVIR y regímenes laborales.', tipo: 'DIPLOMADO', horasAcademicas: 300, temario: ['Marco Legal', 'Ley 30057', 'Régimen CAS', 'D.L. 276', 'D.L. 728', 'Evaluación del Desempeño'], categoria: 'administracion-publica', destacado: true },
    { nombre: 'Procedimiento Administrativo - Ley 27444', slug: 'ley-27444', descripcion: 'TUO de la Ley 27444, procedimientos y recursos administrativos.', descripcionCorta: 'Procedimiento Administrativo General.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Principios', 'Actos Administrativos', 'Recursos', 'Silencio Administrativo'], categoria: 'administracion-publica' },

    // LOGÍSTICA
    { nombre: 'Contrataciones del Estado - Ley 30225', slug: 'contrataciones-estado', descripcion: 'Ley de Contrataciones, Reglamento, OSCE y procedimientos de selección.', descripcionCorta: 'Contrataciones del Estado actualizado.', tipo: 'DIPLOMADO', horasAcademicas: 360, temario: ['Marco Normativo', 'Plan Anual', 'Procedimientos de Selección', 'SEACE', 'Ejecución Contractual', 'Arbitraje'], categoria: 'logistica', destacado: true },
    { nombre: 'SEACE - Sistema Electrónico de Contrataciones', slug: 'seace', descripcion: 'Operación del SEACE: registro de procesos y gestión de contratos.', descripcionCorta: 'Manejo práctico del SEACE.', tipo: 'CERTIFICADO', horasAcademicas: 40, temario: ['Introducción', 'Registro de Procedimientos', 'Gestión de Bases', 'Evaluación', 'Contratos'], categoria: 'logistica' },
    { nombre: 'Gestión de Almacenes e Inventarios', slug: 'almacenes-inventarios', descripcion: 'Técnicas de gestión de almacenes y control de inventarios.', descripcionCorta: 'Gestión de almacenes e inventarios.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Fundamentos', 'Recepción', 'Control de Inventarios', 'Kardex', 'Indicadores'], categoria: 'logistica' },

    // SALUD Y ENFERMERÍA
    { nombre: 'Cuidados de Enfermería en UCI', slug: 'enfermeria-uci', descripcion: 'Cuidados intensivos: monitoreo hemodinámico, ventilación mecánica, drogas vasoactivas.', descripcionCorta: 'Enfermería en cuidados intensivos.', tipo: 'DIPLOMADO', horasAcademicas: 400, temario: ['Organización UCI', 'Monitoreo Hemodinámico', 'Ventilación Mecánica', 'Drogas Vasoactivas', 'Sepsis', 'Nutrición'], categoria: 'enfermeria', destacado: true },
    { nombre: 'Primeros Auxilios y RCP', slug: 'primeros-auxilios-rcp', descripcion: 'Técnicas de primeros auxilios y reanimación cardiopulmonar.', descripcionCorta: 'Primeros auxilios y RCP certificado.', tipo: 'CONSTANCIA', horasAcademicas: 24, temario: ['Evaluación de Escena', 'RCP Adulto', 'RCP Pediátrico', 'DEA', 'Hemorragias'], categoria: 'salud', destacado: true },
    { nombre: 'Administración de Medicamentos', slug: 'administracion-medicamentos', descripcion: 'Vías de administración, cálculo de dosis y diluciones.', descripcionCorta: 'Farmacología práctica.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Farmacología', 'Vías de Administración', 'Cálculo de Dosis', 'Dilución', 'Medicamentos de Alto Riesgo'], categoria: 'enfermeria' },
    { nombre: 'Enfermería en Neonatología', slug: 'enfermeria-neonatologia', descripcion: 'Cuidados del recién nacido: termorregulación, CPAP, reanimación neonatal.', descripcionCorta: 'Enfermería neonatal.', tipo: 'DIPLOMADO', horasAcademicas: 380, temario: ['Adaptación del RN', 'Termorregulación', 'Alimentación', 'Prematuro', 'CPAP', 'Reanimación Neonatal'], categoria: 'enfermeria', destacado: true },
    { nombre: 'Bioseguridad Hospitalaria', slug: 'bioseguridad-hospitalaria', descripcion: 'Normas de bioseguridad, manejo de residuos y uso de EPP.', descripcionCorta: 'Bioseguridad y prevención.', tipo: 'CONSTANCIA', horasAcademicas: 30, temario: ['Principios', 'Precauciones Estándar', 'EPP', 'Residuos Hospitalarios'], categoria: 'salud' },
    { nombre: 'Enfermería en Emergencias', slug: 'enfermeria-emergencias', descripcion: 'Atención de emergencias: triage, trauma, emergencias cardiovasculares.', descripcionCorta: 'Enfermería de emergencias.', tipo: 'DIPLOMADO', horasAcademicas: 360, temario: ['Organización de Emergencia', 'Triage', 'Soporte Vital', 'Trauma', 'Emergencias Cardiovasculares'], categoria: 'enfermeria', destacado: true },
    { nombre: 'Cuidados del Adulto Mayor', slug: 'cuidados-adulto-mayor', descripcion: 'Atención geriátrica: valoración, síndromes geriátricos, cuidados paliativos.', descripcionCorta: 'Enfermería geriátrica.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Envejecimiento', 'Valoración Geriátrica', 'Síndromes', 'Nutrición', 'Cuidados Paliativos'], categoria: 'enfermeria' },
    { nombre: 'Salud Mental y Psiquiatría', slug: 'salud-mental-psiquiatria', descripcion: 'Trastornos mentales, intervención en crisis y psicofarmacología.', descripcionCorta: 'Salud mental.', tipo: 'DIPLOMADO', horasAcademicas: 280, temario: ['Fundamentos', 'Trastornos de Ansiedad', 'Trastornos del Ánimo', 'Adicciones', 'Intervención en Crisis'], categoria: 'salud' },

    // VETERINARIA
    { nombre: 'Ecografía Veterinaria', slug: 'ecografia-veterinaria', descripcion: 'Ecografía abdominal y reproductiva en caninos y felinos.', descripcionCorta: 'Ecografía para perros y gatos.', tipo: 'DIPLOMADO', horasAcademicas: 300, temario: ['Principios de Ultrasonografía', 'Ecografía Hepática', 'Ecografía Renal', 'Ecografía Reproductiva', 'Ecocardiografía'], categoria: 'veterinaria', destacado: true },
    { nombre: 'Anestesiología Veterinaria', slug: 'anestesiologia-veterinaria', descripcion: 'Protocolos anestésicos, monitoreo y manejo del dolor.', descripcionCorta: 'Anestesia en animales.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Evaluación Preanestésica', 'Premedicación', 'Inducción', 'Monitoreo', 'Emergencias'], categoria: 'veterinaria' },
    { nombre: 'Dermatología en Perros y Gatos', slug: 'dermatologia-veterinaria', descripcion: 'Diagnóstico y tratamiento de enfermedades dermatológicas.', descripcionCorta: 'Enfermedades de piel en mascotas.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Anatomía de la Piel', 'Métodos Diagnósticos', 'Alergias', 'Piodermias', 'Micosis'], categoria: 'veterinaria' },

    // TECNOLOGÍA
    { nombre: 'Excel Avanzado para la Gestión', slug: 'excel-avanzado', descripcion: 'Fórmulas avanzadas, tablas dinámicas, dashboards y macros VBA.', descripcionCorta: 'Excel avanzado con macros.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Fórmulas Avanzadas', 'Tablas Dinámicas', 'Dashboards', 'Power Query', 'Macros VBA'], categoria: 'ofimatica', destacado: true },
    { nombre: 'Power BI - Business Intelligence', slug: 'power-bi', descripcion: 'Reportes interactivos y dashboards profesionales con Power BI.', descripcionCorta: 'Visualización con Power BI.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['Introducción', 'Conexión de Datos', 'Transformación', 'Modelado', 'Visualizaciones', 'DAX'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Python para Análisis de Datos', slug: 'python-analisis-datos', descripcion: 'Python con pandas, numpy y matplotlib para data science.', descripcionCorta: 'Python para data science.', tipo: 'DIPLOMADO', horasAcademicas: 200, temario: ['Fundamentos', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Análisis Exploratorio'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Inteligencia Artificial con ChatGPT', slug: 'ia-chatgpt', descripcion: 'ChatGPT, Midjourney, Claude y herramientas de IA para productividad.', descripcionCorta: 'IA aplicada.', tipo: 'CERTIFICADO', horasAcademicas: 40, temario: ['IA Generativa', 'ChatGPT', 'Prompts Efectivos', 'Midjourney', 'Automatización'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Desarrollo Web HTML, CSS y JavaScript', slug: 'desarrollo-web-basico', descripcion: 'Páginas web desde cero con HTML5, CSS3 y JavaScript.', descripcionCorta: 'Fundamentos web.', tipo: 'DIPLOMADO', horasAcademicas: 180, temario: ['HTML5', 'CSS3', 'Flexbox y Grid', 'Responsive', 'JavaScript', 'DOM'], categoria: 'tecnologia' },
    { nombre: 'Ciberseguridad Básica', slug: 'ciberseguridad-basica', descripcion: 'Amenazas, contraseñas seguras, phishing y buenas prácticas.', descripcionCorta: 'Seguridad informática.', tipo: 'CONSTANCIA', horasAcademicas: 30, temario: ['Amenazas', 'Contraseñas', 'Phishing', 'Malware', 'Redes Sociales'], categoria: 'tecnologia' },
    { nombre: 'Redes - Fundamentos CCNA', slug: 'redes-ccna', descripcion: 'Modelo OSI, TCP/IP, switching, routing y configuración Cisco.', descripcionCorta: 'Fundamentos de redes.', tipo: 'DIPLOMADO', horasAcademicas: 300, temario: ['Introducción a Redes', 'Modelo OSI', 'TCP/IP', 'Subnetting', 'Switching', 'Routing', 'OSPF'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Cableado Estructurado', slug: 'cableado-estructurado', descripcion: 'Normas TIA/EIA, categorías de cable y fibra óptica.', descripcionCorta: 'Instalación de cableado.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Normas TIA/EIA', 'Tipos de Cable', 'Ponchado', 'Fibra Óptica', 'Certificación'], categoria: 'tecnologia' },
    { nombre: 'MikroTik Administración', slug: 'mikrotik', descripcion: 'RouterOS, firewall, NAT, VPN, hotspot y balanceo.', descripcionCorta: 'Routers MikroTik.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['RouterOS', 'Interfaces', 'Firewall', 'DHCP', 'Hotspot', 'VPN', 'QoS'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Mantenimiento de Computadoras', slug: 'mantenimiento-pcs', descripcion: 'Diagnóstico, mantenimiento preventivo y correctivo de PCs.', descripcionCorta: 'Reparación de PCs.', tipo: 'DIPLOMADO', horasAcademicas: 200, temario: ['Arquitectura PC', 'Hardware', 'Ensamblaje', 'BIOS', 'Windows', 'Diagnóstico'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Reparación de Laptops', slug: 'reparacion-laptops', descripcion: 'Diagnóstico y reparación: pantallas, teclados, baterías.', descripcionCorta: 'Reparación de laptops.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Anatomía Laptop', 'Desarme', 'Pantallas', 'Teclados', 'Baterías', 'Soldadura'], categoria: 'tecnologia' },
    { nombre: 'Reparación de Celulares', slug: 'reparacion-celulares', descripcion: 'Reparación de smartphones: pantallas, software, liberación.', descripcionCorta: 'Reparación de celulares.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Componentes', 'Herramientas', 'Pantallas', 'Software', 'Liberación'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Prompt Engineering', slug: 'prompt-engineering', descripcion: 'Técnicas avanzadas de prompts para ChatGPT, Claude y Gemini.', descripcionCorta: 'Domina los prompts de IA.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['Fundamentos', 'Anatomía del Prompt', 'Chain of Thought', 'Role Prompting', 'Few-Shot'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Automatización con Make y Zapier', slug: 'automatizacion-nocode', descripcion: 'Automatiza procesos con herramientas no-code y APIs de IA.', descripcionCorta: 'Automatización no-code.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Introducción', 'Make', 'Zapier', 'APIs de IA', 'Webhooks'], categoria: 'tecnologia' },
    { nombre: 'Machine Learning con Python', slug: 'machine-learning', descripcion: 'Algoritmos de ML, scikit-learn y redes neuronales.', descripcionCorta: 'Machine Learning.', tipo: 'DIPLOMADO', horasAcademicas: 280, temario: ['Fundamentos ML', 'Regresión', 'Clasificación', 'Clustering', 'Redes Neuronales', 'Deep Learning'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Java Programación', slug: 'java-programacion', descripcion: 'Java desde cero: POO, colecciones, excepciones y JDBC.', descripcionCorta: 'Programación Java.', tipo: 'DIPLOMADO', horasAcademicas: 240, temario: ['Fundamentos', 'POO', 'Colecciones', 'Excepciones', 'Archivos', 'JDBC'], categoria: 'tecnologia', destacado: true },
    { nombre: 'C# y .NET', slug: 'csharp-dotnet', descripcion: 'Desarrollo con C# y .NET: escritorio, web y APIs.', descripcionCorta: 'Programación C#.', tipo: 'DIPLOMADO', horasAcademicas: 240, temario: ['Fundamentos C#', 'POO', 'LINQ', 'Entity Framework', 'ASP.NET Core', 'Web API'], categoria: 'tecnologia' },
    { nombre: 'PHP y Laravel', slug: 'php-laravel', descripcion: 'Backend con PHP y Laravel: MVC, Eloquent, APIs.', descripcionCorta: 'Backend con Laravel.', tipo: 'DIPLOMADO', horasAcademicas: 200, temario: ['PHP Fundamentos', 'POO', 'MySQL', 'Laravel', 'Eloquent', 'APIs REST'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Node.js y Express', slug: 'nodejs-express', descripcion: 'Backend JavaScript con Node.js, Express y MongoDB.', descripcionCorta: 'Backend con Node.js.', tipo: 'DIPLOMADO', horasAcademicas: 200, temario: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'JWT', 'WebSockets'], categoria: 'tecnologia', destacado: true },
    { nombre: 'React.js Frontend', slug: 'reactjs', descripcion: 'Desarrollo frontend con React: hooks, estado, routing.', descripcionCorta: 'Frontend con React.', tipo: 'DIPLOMADO', horasAcademicas: 180, temario: ['JavaScript ES6+', 'React', 'Componentes', 'Hooks', 'React Router', 'APIs'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Angular', slug: 'angular', descripcion: 'Aplicaciones web empresariales con Angular y TypeScript.', descripcionCorta: 'Desarrollo con Angular.', tipo: 'DIPLOMADO', horasAcademicas: 200, temario: ['TypeScript', 'Angular', 'Componentes', 'Servicios', 'Routing', 'HTTP Client'], categoria: 'tecnologia' },
    { nombre: 'Vue.js', slug: 'vuejs', descripcion: 'Frontend progresivo con Vue.js y Pinia.', descripcionCorta: 'Desarrollo con Vue.js.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Vue.js', 'Componentes', 'Composition API', 'Vue Router', 'Pinia'], categoria: 'tecnologia' },
    { nombre: 'SQL Server Administración', slug: 'sql-server', descripcion: 'Administración SQL Server: T-SQL, backups, seguridad.', descripcionCorta: 'SQL Server completo.', tipo: 'DIPLOMADO', horasAcademicas: 240, temario: ['Introducción', 'T-SQL', 'Índices', 'Procedimientos', 'Triggers', 'Backups', 'Seguridad'], categoria: 'tecnologia', destacado: true },
    { nombre: 'MySQL Administración', slug: 'mysql', descripcion: 'Base de datos MySQL: diseño, consultas, optimización.', descripcionCorta: 'MySQL desde cero.', tipo: 'DIPLOMADO', horasAcademicas: 180, temario: ['Introducción', 'Diseño', 'SQL', 'Joins', 'Procedimientos', 'Replicación'], categoria: 'tecnologia', destacado: true },
    { nombre: 'PostgreSQL', slug: 'postgresql', descripcion: 'PostgreSQL: administración, PL/pgSQL y optimización.', descripcionCorta: 'PostgreSQL profesional.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Introducción', 'SQL', 'PL/pgSQL', 'Índices', 'Backup', 'Replicación'], categoria: 'tecnologia' },
    { nombre: 'MongoDB NoSQL', slug: 'mongodb', descripcion: 'Base de datos NoSQL: CRUD, agregaciones, índices.', descripcionCorta: 'MongoDB NoSQL.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['NoSQL', 'MongoDB', 'CRUD', 'Modelado', 'Agregaciones', 'Índices'], categoria: 'tecnologia' },
    { nombre: 'Windows Server', slug: 'windows-server', descripcion: 'Administración Windows Server: AD, GPO, DNS, DHCP.', descripcionCorta: 'Windows Server.', tipo: 'DIPLOMADO', horasAcademicas: 280, temario: ['Instalación', 'Active Directory', 'GPO', 'DNS', 'DHCP', 'File Server', 'Hyper-V'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Linux Administración', slug: 'linux-admin', descripcion: 'Administración de servidores Linux: comandos, servicios, scripting.', descripcionCorta: 'Linux completo.', tipo: 'DIPLOMADO', horasAcademicas: 240, temario: ['Línea de Comandos', 'Sistema de Archivos', 'Usuarios', 'Servicios', 'Networking', 'Bash Scripting'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Docker y Contenedores', slug: 'docker', descripcion: 'Containerización: imágenes, Docker Compose, networking.', descripcionCorta: 'Docker.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Contenedores', 'Docker', 'Imágenes', 'Dockerfile', 'Docker Compose', 'Networking'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Kubernetes', slug: 'kubernetes', descripcion: 'Orquestación: pods, deployments, services, ingress.', descripcionCorta: 'Kubernetes.', tipo: 'DIPLOMADO', horasAcademicas: 180, temario: ['Arquitectura', 'Pods', 'Deployments', 'Services', 'Ingress', 'Helm'], categoria: 'tecnologia' },
    { nombre: 'AWS Cloud', slug: 'aws', descripcion: 'Amazon Web Services: EC2, S3, RDS, Lambda, IAM.', descripcionCorta: 'Cloud con AWS.', tipo: 'DIPLOMADO', horasAcademicas: 200, temario: ['Cloud Computing', 'EC2', 'S3', 'VPC', 'RDS', 'Lambda', 'CloudFormation'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Microsoft Azure', slug: 'azure', descripcion: 'Azure: VMs, Storage, App Services, Azure AD.', descripcionCorta: 'Cloud con Azure.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Azure Portal', 'Virtual Machines', 'Storage', 'App Services', 'Azure AD'], categoria: 'tecnologia' },
    { nombre: 'Google Cloud Platform', slug: 'gcp', descripcion: 'GCP: Compute Engine, Cloud Storage, BigQuery.', descripcionCorta: 'Cloud con Google.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['GCP', 'Compute Engine', 'Cloud Storage', 'BigQuery', 'Cloud Functions'], categoria: 'tecnologia' },
    { nombre: 'DevOps', slug: 'devops', descripcion: 'Cultura DevOps: CI/CD, Git, Jenkins, Ansible, Terraform.', descripcionCorta: 'DevOps completo.', tipo: 'DIPLOMADO', horasAcademicas: 240, temario: ['DevOps', 'Git', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Docker', 'Ansible', 'Terraform'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Git y GitHub', slug: 'git-github', descripcion: 'Control de versiones: branches, merges, pull requests.', descripcionCorta: 'Git y GitHub.', tipo: 'CERTIFICADO', horasAcademicas: 40, temario: ['Git', 'Repositorios', 'Branches', 'Merge', 'GitHub', 'Pull Requests'], categoria: 'tecnologia' },
    { nombre: 'Ethical Hacking', slug: 'ethical-hacking', descripcion: 'Hacking ético: Kali Linux, pentesting, explotación.', descripcionCorta: 'Hacking ético.', tipo: 'DIPLOMADO', horasAcademicas: 300, temario: ['Introducción', 'Kali Linux', 'Reconocimiento', 'Escaneo', 'Explotación', 'Hacking Web'], categoria: 'tecnologia', destacado: true },
    { nombre: 'Seguridad en Redes', slug: 'seguridad-redes', descripcion: 'Firewalls, IDS/IPS, VPN, WAF y arquitecturas seguras.', descripcionCorta: 'Seguridad de redes.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Fundamentos', 'Firewalls', 'pfSense', 'IDS/IPS', 'VPN', 'WAF'], categoria: 'tecnologia' },

    // OFIMÁTICA
    { nombre: 'Microsoft Office Completo', slug: 'microsoft-office', descripcion: 'Word, Excel, PowerPoint y Outlook profesional.', descripcionCorta: 'Office completo.', tipo: 'DIPLOMADO', horasAcademicas: 200, temario: ['Word Completo', 'Excel Completo', 'PowerPoint Completo', 'Outlook', 'OneDrive', 'Proyecto Integrador'], categoria: 'ofimatica', destacado: true },
    { nombre: 'Google Workspace', slug: 'google-workspace', descripcion: 'Gmail, Drive, Docs, Sheets, Meet para trabajo colaborativo.', descripcionCorta: 'Google Workspace.', tipo: 'CONSTANCIA', horasAcademicas: 30, temario: ['Gmail', 'Drive', 'Docs', 'Sheets', 'Meet', 'Calendar'], categoria: 'ofimatica' },

    // Ofimática por niveles (Word + Excel + PowerPoint)
    { nombre: 'Ofimática Básica', slug: 'ofimatica-basica', descripcion: 'Curso integral de ofimática básica: aprende Word, Excel y PowerPoint desde cero. Ideal para principiantes que desean dominar las herramientas esenciales de oficina.', descripcionCorta: 'Word, Excel y PowerPoint básico.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Word Básico: Edición y formato de texto', 'Word Básico: Tablas e imágenes', 'Excel Básico: Interfaz y fórmulas', 'Excel Básico: Gráficos simples', 'PowerPoint Básico: Crear presentaciones', 'PowerPoint Básico: Transiciones y diseño', 'Proyecto integrador'], categoria: 'ofimatica', destacado: true },
    { nombre: 'Ofimática Intermedia', slug: 'ofimatica-intermedia', descripcion: 'Curso integral de ofimática intermedia: Word, Excel y PowerPoint a nivel intermedio. Funciones avanzadas, tablas dinámicas y presentaciones profesionales.', descripcionCorta: 'Word, Excel y PowerPoint intermedio.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Word Intermedio: Estilos y tabla de contenidos', 'Word Intermedio: Combinar correspondencia', 'Excel Intermedio: BUSCARV y funciones lógicas', 'Excel Intermedio: Tablas dinámicas', 'PowerPoint Intermedio: Animaciones y multimedia', 'PowerPoint Intermedio: Diseño profesional', 'Proyecto integrador'], categoria: 'ofimatica', destacado: true },
    { nombre: 'Ofimática Avanzada', slug: 'ofimatica-avanzada', descripcion: 'Curso integral de ofimática avanzada: domina Word, Excel y PowerPoint a nivel experto. Macros, automatización, documentos maestros y presentaciones ejecutivas.', descripcionCorta: 'Word, Excel y PowerPoint avanzado.', tipo: 'DIPLOMADO', horasAcademicas: 120, temario: ['Word Avanzado: Documentos maestros y formularios', 'Word Avanzado: Macros y automatización', 'Excel Avanzado: Power Query y Power Pivot', 'Excel Avanzado: Macros VBA y dashboards', 'PowerPoint Avanzado: Storytelling visual', 'PowerPoint Avanzado: Presentaciones ejecutivas', 'Integración Office 365', 'Proyecto integrador final'], categoria: 'ofimatica', destacado: true },

    // Excel por niveles
    { nombre: 'Excel Básico', slug: 'excel-basico', descripcion: 'Fundamentos de Excel: interfaz, fórmulas básicas, formato de celdas y gráficos simples.', descripcionCorta: 'Aprende Excel desde cero.', tipo: 'CONSTANCIA', horasAcademicas: 24, temario: ['Interfaz de Excel', 'Ingreso de Datos', 'Fórmulas Básicas', 'Formato de Celdas', 'Gráficos Simples', 'Impresión'], categoria: 'ofimatica', destacado: true },
    { nombre: 'Excel Intermedio', slug: 'excel-intermedio', descripcion: 'Fórmulas avanzadas, funciones lógicas, tablas y gráficos dinámicos.', descripcionCorta: 'Nivel intermedio de Excel.', tipo: 'CERTIFICADO', horasAcademicas: 40, temario: ['Funciones SI, Y, O', 'BUSCARV y BUSCARH', 'Funciones de Texto', 'Tablas Dinámicas', 'Gráficos Avanzados', 'Validación de Datos'], categoria: 'ofimatica', destacado: true },
    { nombre: 'Excel Avanzado', slug: 'excel-avanzado-pro', descripcion: 'Macros VBA, Power Query, dashboards y análisis de datos profesional.', descripcionCorta: 'Excel profesional con macros.', tipo: 'DIPLOMADO', horasAcademicas: 80, temario: ['Funciones Avanzadas', 'Tablas Dinámicas Avanzadas', 'Power Query', 'Power Pivot', 'Macros y VBA', 'Dashboards', 'Automatización'], categoria: 'ofimatica', destacado: true },
    { nombre: 'Excel para Finanzas', slug: 'excel-finanzas', descripcion: 'Excel aplicado a finanzas: funciones financieras, análisis, proyecciones.', descripcionCorta: 'Excel financiero.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['Funciones Financieras', 'VAN y TIR', 'Tablas de Amortización', 'Análisis de Escenarios', 'Proyecciones', 'Reportes Financieros'], categoria: 'ofimatica' },

    // Word por niveles
    { nombre: 'Word Básico', slug: 'word-basico', descripcion: 'Fundamentos de Word: edición de texto, formato, tablas e imágenes.', descripcionCorta: 'Aprende Word desde cero.', tipo: 'CONSTANCIA', horasAcademicas: 20, temario: ['Interfaz de Word', 'Edición de Texto', 'Formato de Párrafos', 'Tablas', 'Imágenes', 'Impresión'], categoria: 'ofimatica' },
    { nombre: 'Word Intermedio', slug: 'word-intermedio', descripcion: 'Estilos, tabla de contenidos, referencias, combinar correspondencia.', descripcionCorta: 'Word nivel intermedio.', tipo: 'CERTIFICADO', horasAcademicas: 30, temario: ['Estilos y Temas', 'Tabla de Contenidos', 'Encabezados y Pies', 'Referencias', 'Combinar Correspondencia', 'Revisión de Documentos'], categoria: 'ofimatica' },
    { nombre: 'Word Avanzado', slug: 'word-avanzado', descripcion: 'Documentos profesionales, formularios, macros y automatización.', descripcionCorta: 'Word profesional.', tipo: 'CERTIFICADO', horasAcademicas: 40, temario: ['Documentos Maestros', 'Formularios', 'Macros', 'Plantillas Profesionales', 'Índices', 'Documentos Legales'], categoria: 'ofimatica' },

    // PowerPoint por niveles
    { nombre: 'PowerPoint Básico', slug: 'powerpoint-basico', descripcion: 'Creación de presentaciones: diapositivas, texto, imágenes y transiciones.', descripcionCorta: 'Aprende PowerPoint.', tipo: 'CONSTANCIA', horasAcademicas: 16, temario: ['Interfaz', 'Diapositivas', 'Texto e Imágenes', 'Formas', 'Transiciones', 'Presentar'], categoria: 'ofimatica' },
    { nombre: 'PowerPoint Intermedio', slug: 'powerpoint-intermedio', descripcion: 'Animaciones, multimedia, gráficos SmartArt y diseño profesional.', descripcionCorta: 'PowerPoint intermedio.', tipo: 'CERTIFICADO', horasAcademicas: 24, temario: ['Animaciones', 'Videos y Audio', 'SmartArt', 'Gráficos', 'Patrón de Diapositivas', 'Diseño Profesional'], categoria: 'ofimatica' },
    { nombre: 'PowerPoint Avanzado', slug: 'powerpoint-avanzado', descripcion: 'Presentaciones ejecutivas, storytelling visual y técnicas de impacto.', descripcionCorta: 'Presentaciones de alto impacto.', tipo: 'CERTIFICADO', horasAcademicas: 30, temario: ['Storytelling Visual', 'Diseño Ejecutivo', 'Infografías', 'Interactividad', 'Presentaciones Corporativas', 'Tips de Oratoria'], categoria: 'ofimatica' },

    // Asistente Administrativo y Secretariado
    { nombre: 'Asistente Administrativo', slug: 'asistente-administrativo', descripcion: 'Formación integral para asistentes: ofimática, redacción, archivo y atención.', descripcionCorta: 'Asistente de oficina.', tipo: 'DIPLOMADO', horasAcademicas: 200, temario: ['Ofimática', 'Redacción Comercial', 'Gestión Documental', 'Atención al Cliente', 'Agenda y Organización', 'Protocolo Empresarial'], categoria: 'ofimatica', destacado: true },
    { nombre: 'Secretariado Ejecutivo', slug: 'secretariado-ejecutivo', descripcion: 'Secretariado de alta dirección: protocolo, organización de eventos, idiomas.', descripcionCorta: 'Secretaria ejecutiva.', tipo: 'DIPLOMADO', horasAcademicas: 280, temario: ['Gestión Ejecutiva', 'Protocolo y Etiqueta', 'Organización de Eventos', 'Redacción Ejecutiva', 'Manejo de Agenda', 'Inglés Empresarial'], categoria: 'ofimatica', destacado: true },
    { nombre: 'Oficinista Integral', slug: 'oficinista', descripcion: 'Curso completo para trabajo de oficina: computación, archivo, trámites.', descripcionCorta: 'Trabajo de oficina.', tipo: 'CERTIFICADO', horasAcademicas: 120, temario: ['Computación Básica', 'Microsoft Office', 'Archivo', 'Trámite Documentario', 'Atención al Público', 'Ética Laboral'], categoria: 'ofimatica' },

    // Gestión Documental
    { nombre: 'Gestión de Documentos', slug: 'gestion-documentos', descripcion: 'Administración de documentos físicos y digitales, archivo y conservación.', descripcionCorta: 'Gestión documental.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Fundamentos', 'Clasificación', 'Archivo Físico', 'Archivo Digital', 'Conservación', 'Normativa'], categoria: 'ofimatica', destacado: true },
    { nombre: 'Trámite Documentario', slug: 'tramite-documentario', descripcion: 'Gestión de trámites: mesa de partes, seguimiento y archivo.', descripcionCorta: 'Trámite documentario.', tipo: 'CERTIFICADO', horasAcademicas: 40, temario: ['Mesa de Partes', 'Registro', 'Seguimiento', 'Despacho', 'Archivo', 'Sistemas de Gestión'], categoria: 'ofimatica' },
    { nombre: 'Redacción Administrativa', slug: 'redaccion-administrativa', descripcion: 'Redacción de documentos oficiales: oficios, memorandos, informes.', descripcionCorta: 'Redacción de documentos.', tipo: 'CERTIFICADO', horasAcademicas: 40, temario: ['Principios de Redacción', 'Oficios', 'Memorandos', 'Informes', 'Actas', 'Cartas Comerciales'], categoria: 'ofimatica' },

    // Otras herramientas de oficina
    { nombre: 'Access - Base de Datos', slug: 'access-base-datos', descripcion: 'Microsoft Access: tablas, consultas, formularios e informes.', descripcionCorta: 'Base de datos con Access.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['Fundamentos', 'Tablas', 'Relaciones', 'Consultas', 'Formularios', 'Informes', 'Macros'], categoria: 'ofimatica' },
    { nombre: 'Outlook y Productividad', slug: 'outlook-productividad', descripcion: 'Gestión de correo, calendario, tareas y productividad con Outlook.', descripcionCorta: 'Outlook profesional.', tipo: 'CONSTANCIA', horasAcademicas: 16, temario: ['Correo Electrónico', 'Calendario', 'Tareas', 'Contactos', 'Reglas', 'Productividad'], categoria: 'ofimatica' },
    { nombre: 'Mecanografía Computarizada', slug: 'mecanografia', descripcion: 'Técnicas de digitación rápida y precisa en teclado.', descripcionCorta: 'Aprende a digitar rápido.', tipo: 'CONSTANCIA', horasAcademicas: 30, temario: ['Postura Correcta', 'Fila Base', 'Fila Superior', 'Fila Inferior', 'Números', 'Velocidad y Precisión'], categoria: 'ofimatica' },
    { nombre: 'Computación Básica', slug: 'computacion-basica', descripcion: 'Introducción a la computadora: Windows, internet, correo y seguridad.', descripcionCorta: 'Aprende a usar la PC.', tipo: 'CONSTANCIA', horasAcademicas: 30, temario: ['Hardware y Software', 'Windows', 'Navegación Internet', 'Correo Electrónico', 'Descargas', 'Seguridad Básica'], categoria: 'ofimatica' },

    // SST
    { nombre: 'Seguridad y Salud en el Trabajo - Ley 29783', slug: 'sst-ley-29783', descripcion: 'SST completo: Ley 29783, IPERC, plan SST, fiscalización SUNAFIL.', descripcionCorta: 'SST y normativa peruana.', tipo: 'DIPLOMADO', horasAcademicas: 240, temario: ['Marco Legal', 'Ley 29783', 'Sistema de Gestión', 'IPERC', 'Comité SST', 'Plan SST', 'SUNAFIL'], categoria: 'seguridad-trabajo', destacado: true },
    { nombre: 'IPERC', slug: 'iperc', descripcion: 'Matriz IPERC: identificación de peligros y evaluación de riesgos.', descripcionCorta: 'Matriz IPERC.', tipo: 'CERTIFICADO', horasAcademicas: 40, temario: ['Conceptos', 'Metodología', 'Identificación', 'Evaluación', 'Controles', 'Matriz'], categoria: 'seguridad-trabajo' },
    { nombre: 'Trabajos en Altura', slug: 'trabajos-altura', descripcion: 'Prevención de caídas, EPP y sistemas de protección.', descripcionCorta: 'Seguridad en altura.', tipo: 'CONSTANCIA', horasAcademicas: 20, temario: ['Normativa', 'Equipos', 'Sistemas de Detención', 'Procedimientos', 'Rescate'], categoria: 'seguridad-trabajo' },

    // EDUCACIÓN
    { nombre: 'Didáctica y Estrategias de Enseñanza', slug: 'didactica', descripcion: 'Metodologías activas, ABP, gamificación y evaluación formativa.', descripcionCorta: 'Estrategias pedagógicas.', tipo: 'DIPLOMADO', horasAcademicas: 300, temario: ['Didáctica', 'Metodologías Activas', 'ABP', 'Gamificación', 'Aula Invertida', 'Evaluación'], categoria: 'educacion', destacado: true },
    { nombre: 'Educación Inclusiva', slug: 'educacion-inclusiva', descripcion: 'Atención a la diversidad, adaptaciones curriculares y NEE.', descripcionCorta: 'Inclusión educativa.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Marco Legal', 'NEE', 'Adaptaciones Curriculares', 'Estrategias', 'Evaluación Diferenciada'], categoria: 'educacion' },
    { nombre: 'Herramientas Digitales para Docentes', slug: 'herramientas-docentes', descripcion: 'Canva, Genially, Kahoot, Google Classroom para clases.', descripcionCorta: 'TIC para docentes.', tipo: 'CONSTANCIA', horasAcademicas: 40, temario: ['Google Classroom', 'Canva', 'Genially', 'Kahoot', 'Padlet'], categoria: 'educacion', destacado: true },

    // CONTABILIDAD
    { nombre: 'Tributación y SUNAT', slug: 'tributacion-sunat', descripcion: 'Impuesto a la Renta, IGV, PDT y fiscalización SUNAT.', descripcionCorta: 'Tributación peruana.', tipo: 'DIPLOMADO', horasAcademicas: 280, temario: ['Sistema Tributario', 'Código Tributario', 'IR', 'IGV', 'Comprobantes', 'PDT', 'Fiscalización'], categoria: 'contabilidad', destacado: true },
    { nombre: 'Planilla Electrónica y T-Registro', slug: 'planilla-t-registro', descripcion: 'T-Registro, PLAME, AFP, CTS y beneficios laborales.', descripcionCorta: 'Planillas electrónicas.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Marco Legal', 'T-Registro', 'PLAME', 'AFP/ONP', 'CTS', 'Liquidación'], categoria: 'contabilidad' },
    { nombre: 'NIIF para PYMES', slug: 'niif-pymes', descripcion: 'Normas Internacionales de Información Financiera para PYMES.', descripcionCorta: 'NIIF para PYMES.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['Introducción', 'Estados Financieros', 'Activos', 'Pasivos', 'Ingresos'], categoria: 'contabilidad' },

    // GESTIÓN EMPRESARIAL
    { nombre: 'Liderazgo y Gestión de Equipos', slug: 'liderazgo', descripcion: 'Habilidades de liderazgo, comunicación y equipos de alto rendimiento.', descripcionCorta: 'Liderazgo efectivo.', tipo: 'DIPLOMADO', horasAcademicas: 200, temario: ['Fundamentos', 'Estilos', 'Comunicación', 'Motivación', 'Conflictos', 'Coaching'], categoria: 'gestion-empresarial', destacado: true },
    { nombre: 'Atención al Cliente', slug: 'atencion-cliente', descripcion: 'Técnicas de atención, manejo de quejas y fidelización.', descripcionCorta: 'Servicio al cliente.', tipo: 'CONSTANCIA', horasAcademicas: 24, temario: ['Fundamentos', 'Comunicación', 'Quejas', 'Satisfacción', 'Fidelización'], categoria: 'gestion-empresarial' },
    { nombre: 'Metodologías Ágiles - Scrum', slug: 'scrum-agile', descripcion: 'Scrum, Kanban y metodologías ágiles para proyectos.', descripcionCorta: 'Scrum y Agile.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Agile', 'Scrum', 'Roles', 'Eventos', 'Artefactos', 'Kanban'], categoria: 'gestion-empresarial', destacado: true },

    // MEDIO AMBIENTE
    { nombre: 'Gestión Ambiental y Fiscalización', slug: 'gestion-ambiental', descripcion: 'Sistema Nacional de Gestión Ambiental, EIA y fiscalización OEFA.', descripcionCorta: 'Gestión ambiental.', tipo: 'DIPLOMADO', horasAcademicas: 280, temario: ['Marco Legal', 'SNGA', 'EIA', 'Instrumentos', 'OEFA', 'Residuos', 'ISO 14001'], categoria: 'medio-ambiente', destacado: true },
    { nombre: 'Manejo de Residuos Sólidos', slug: 'residuos-solidos', descripcion: 'Gestión integral de residuos municipales e industriales.', descripcionCorta: 'Gestión de residuos.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['Marco Legal', 'Clasificación', 'Segregación', 'Recolección', 'Tratamiento', 'Plan de Manejo'], categoria: 'medio-ambiente' },

    // MARKETING DIGITAL
    { nombre: 'Marketing Digital y Redes Sociales', slug: 'marketing-digital', descripcion: 'Estrategias de marketing: Facebook, Instagram, TikTok, publicidad.', descripcionCorta: 'Marketing digital.', tipo: 'DIPLOMADO', horasAcademicas: 240, temario: ['Fundamentos', 'Contenidos', 'Facebook', 'Instagram', 'TikTok', 'Email Marketing', 'Ads'], categoria: 'marketing-digital', destacado: true },
    { nombre: 'Community Manager', slug: 'community-manager', descripcion: 'Gestión de redes sociales, contenido, calendario y crisis.', descripcionCorta: 'Community Manager.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Rol del CM', 'Estrategia', 'Herramientas', 'Contenido Visual', 'Copywriting', 'Métricas'], categoria: 'marketing-digital', destacado: true },
    { nombre: 'SEO y Posicionamiento Web', slug: 'seo', descripcion: 'SEO on-page, off-page, técnico y herramientas.', descripcionCorta: 'Posicionamiento web.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Fundamentos', 'Keywords', 'SEO On-Page', 'SEO Técnico', 'Link Building', 'Tools'], categoria: 'marketing-digital' },
    { nombre: 'E-commerce y Ventas Online', slug: 'ecommerce', descripcion: 'Tiendas online: plataformas, pasarelas de pago, logística.', descripcionCorta: 'E-commerce.', tipo: 'DIPLOMADO', horasAcademicas: 180, temario: ['Fundamentos', 'Plataformas', 'Catálogo', 'Pasarelas de Pago', 'Logística', 'Marketplaces'], categoria: 'marketing-digital', destacado: true },
    { nombre: 'Google Ads', slug: 'google-ads', descripcion: 'Campañas en Google: búsqueda, display, shopping, YouTube.', descripcionCorta: 'Publicidad en Google.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['Introducción', 'Búsqueda', 'Display', 'Shopping', 'YouTube', 'Remarketing'], categoria: 'marketing-digital' },
    { nombre: 'Facebook e Instagram Ads', slug: 'meta-ads', descripcion: 'Publicidad en Meta: objetivos, audiencias, creativos.', descripcionCorta: 'Publicidad en Meta.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['Meta Business', 'Objetivos', 'Audiencias', 'Creativos', 'Pixel', 'Optimización'], categoria: 'marketing-digital' },

    // COMERCIO EXTERIOR
    { nombre: 'Comercio Exterior y Aduanas', slug: 'comercio-exterior-aduanas', descripcion: 'Importación, exportación: regímenes aduaneros, documentos, INCOTERMS.', descripcionCorta: 'Comercio internacional.', tipo: 'DIPLOMADO', horasAcademicas: 280, temario: ['Fundamentos', 'Regímenes Aduaneros', 'Clasificación Arancelaria', 'INCOTERMS 2020', 'Documentos', 'Logística'], categoria: 'comercio-exterior', destacado: true },
    { nombre: 'INCOTERMS 2020', slug: 'incoterms', descripcion: 'Términos de comercio internacional y transferencia de riesgo.', descripcionCorta: 'INCOTERMS 2020.', tipo: 'CERTIFICADO', horasAcademicas: 30, temario: ['Introducción', 'Grupo E', 'Grupo F', 'Grupo C', 'Grupo D', 'Casos Prácticos'], categoria: 'comercio-exterior' },
    { nombre: 'Importación desde China', slug: 'importacion-china', descripcion: 'Proveedores, Alibaba, negociación, logística y aduanas.', descripcionCorta: 'Importa desde China.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['Mercado Chino', 'Proveedores', 'Alibaba', 'Negociación', 'Control de Calidad', 'Aduanas'], categoria: 'comercio-exterior', destacado: true },
    { nombre: 'Exportación para PYMES', slug: 'exportacion-pymes', descripcion: 'Cómo exportar siendo pequeña empresa: mercados, documentos.', descripcionCorta: 'Exporta tus productos.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Por qué Exportar', 'Análisis Producto', 'Mercados', 'Requisitos', 'Costos', 'PromPerú'], categoria: 'comercio-exterior' },

    // MINERÍA
    { nombre: 'Seguridad Minera - DS 024', slug: 'seguridad-minera', descripcion: 'Reglamento de seguridad: gestión de riesgos, IPERC, geomecánica.', descripcionCorta: 'SSO en minería.', tipo: 'DIPLOMADO', horasAcademicas: 300, temario: ['Marco Legal', 'DS 024', 'Sistema de Gestión', 'IPERC', 'Geomecánica', 'Ventilación', 'Explosivos'], categoria: 'mineria', destacado: true },
    { nombre: 'Operador de Maquinaria Pesada', slug: 'maquinaria-pesada', descripcion: 'Operación de excavadoras, cargadores y volquetes.', descripcionCorta: 'Maquinaria pesada.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Tipos de Maquinaria', 'Componentes', 'Inspección', 'Operación', 'Seguridad', 'Mantenimiento'], categoria: 'mineria', destacado: true },
    { nombre: 'Geología y Exploración', slug: 'geologia-minera', descripcion: 'Exploración, muestreo, análisis y evaluación de yacimientos.', descripcionCorta: 'Geología minera.', tipo: 'DIPLOMADO', horasAcademicas: 240, temario: ['Geología', 'Mineralogía', 'Yacimientos', 'Exploración', 'Mapeo', 'Perforación'], categoria: 'mineria' },
    { nombre: 'Gestión Ambiental en Minería', slug: 'ambiental-mineria', descripcion: 'EIA, plan de cierre, monitoreo y fiscalización ambiental.', descripcionCorta: 'Medio ambiente minero.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Marco Legal', 'EIA', 'Plan de Manejo', 'Aguas', 'Relaves', 'Plan de Cierre', 'OEFA'], categoria: 'mineria' },

    // CALIDAD
    { nombre: 'ISO 9001:2015 Gestión de Calidad', slug: 'iso-9001', descripcion: 'Implementación y auditoría de sistemas de gestión de calidad.', descripcionCorta: 'ISO 9001.', tipo: 'DIPLOMADO', horasAcademicas: 200, temario: ['Fundamentos', 'Estructura', 'Contexto', 'Liderazgo', 'Operación', 'Mejora', 'Auditoría'], categoria: 'calidad', destacado: true },
    { nombre: 'ISO 45001:2018 Gestión de SST', slug: 'iso-45001', descripcion: 'Sistemas de gestión de seguridad y salud en el trabajo.', descripcionCorta: 'ISO 45001.', tipo: 'DIPLOMADO', horasAcademicas: 180, temario: ['Estructura', 'Contexto', 'Liderazgo', 'Planificación', 'Operación', 'Evaluación', 'Mejora'], categoria: 'calidad', destacado: true },
    { nombre: 'ISO 14001:2015 Gestión Ambiental', slug: 'iso-14001', descripcion: 'Sistemas de gestión ambiental según ISO 14001.', descripcionCorta: 'ISO 14001.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Fundamentos', 'Aspectos Ambientales', 'Requisitos Legales', 'Objetivos', 'Control', 'Auditoría'], categoria: 'calidad' },
    { nombre: 'Auditor Interno Sistemas Integrados', slug: 'auditor-interno', descripcion: 'Formación de auditores para ISO 9001, 14001 y 45001.', descripcionCorta: 'Auditoría interna.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Principios', 'Programa', 'Planificación', 'Ejecución', 'Hallazgos', 'Informe'], categoria: 'calidad' },

    // CONSTRUCCIÓN
    { nombre: 'Supervisión y Residencia de Obras', slug: 'supervision-obras', descripcion: 'Control de calidad, valorizaciones, cuaderno de obra, liquidación.', descripcionCorta: 'Supervisión de obras.', tipo: 'DIPLOMADO', horasAcademicas: 280, temario: ['Marco Legal', 'Expediente Técnico', 'Supervisor', 'Cuaderno de Obra', 'Valorizaciones', 'Recepción', 'Liquidación'], categoria: 'construccion', destacado: true },
    { nombre: 'Metrados y Presupuestos con S10', slug: 'metrados-s10', descripcion: 'Metrados, análisis de precios unitarios y presupuestos.', descripcionCorta: 'Metrados y costos.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Fundamentos', 'Metrado Estructuras', 'Metrado Arquitectura', 'Precios Unitarios', 'S10'], categoria: 'construccion', destacado: true },
    { nombre: 'AutoCAD para Construcción', slug: 'autocad', descripcion: 'AutoCAD 2D para planos arquitectónicos y estructurales.', descripcionCorta: 'AutoCAD.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Interfaz', 'Dibujo', 'Edición', 'Capas', 'Acotado', 'Planos', 'Impresión'], categoria: 'construccion' },
    { nombre: 'Seguridad en Construcción - G.050', slug: 'seguridad-construccion', descripcion: 'Norma G.050, trabajos de alto riesgo y plan de SST.', descripcionCorta: 'SST en construcción.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Norma G.050', 'Plan SST', 'IPERC', 'Altura', 'Excavaciones', 'Andamios'], categoria: 'construccion' },
    { nombre: 'Revit BIM', slug: 'revit-bim', descripcion: 'Modelado BIM con Revit: arquitectura, estructura, MEP.', descripcionCorta: 'Modelado BIM.', tipo: 'DIPLOMADO', horasAcademicas: 180, temario: ['Introducción BIM', 'Revit', 'Modelado Arquitectónico', 'Modelado Estructural', 'MEP', 'Documentación'], categoria: 'construccion', destacado: true },

    // COACHING
    { nombre: 'Coaching Profesional', slug: 'coaching-profesional', descripcion: 'Formación en coaching: metodologías, herramientas, sesiones.', descripcionCorta: 'Coach profesional.', tipo: 'DIPLOMADO', horasAcademicas: 240, temario: ['Fundamentos', 'Competencias', 'Escucha Activa', 'Preguntas Poderosas', 'GROW', 'Práctica'], categoria: 'coaching', destacado: true },
    { nombre: 'Inteligencia Emocional', slug: 'inteligencia-emocional', descripcion: 'Autoconocimiento, autorregulación, empatía y habilidades sociales.', descripcionCorta: 'Inteligencia emocional.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['Qué es IE', 'Autoconocimiento', 'Autorregulación', 'Motivación', 'Empatía', 'Habilidades Sociales'], categoria: 'coaching', destacado: true },
    { nombre: 'Oratoria y Comunicación Efectiva', slug: 'oratoria', descripcion: 'Habla en público: técnicas, presentaciones y persuasión.', descripcionCorta: 'Habla en público.', tipo: 'CERTIFICADO', horasAcademicas: 40, temario: ['Fundamentos', 'Voz y Dicción', 'Lenguaje Corporal', 'Estructura', 'Miedo Escénico', 'Storytelling'], categoria: 'coaching' },
    { nombre: 'Programación Neurolingüística - PNL', slug: 'pnl', descripcion: 'Técnicas de PNL: rapport, anclajes, reencuadre.', descripcionCorta: 'PNL.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Fundamentos', 'Sistemas Representacionales', 'Rapport', 'Anclajes', 'Submodalidades', 'Reencuadre'], categoria: 'coaching' },

    // AGRONOMÍA
    { nombre: 'Riego Tecnificado', slug: 'riego-tecnificado', descripcion: 'Sistemas de riego: goteo, aspersión, fertirriego.', descripcionCorta: 'Riego moderno.', tipo: 'DIPLOMADO', horasAcademicas: 180, temario: ['Fundamentos', 'Riego por Goteo', 'Riego por Aspersión', 'Fertirriego', 'Diseño', 'Automatización'], categoria: 'agronomia', destacado: true },
    { nombre: 'Agricultura Orgánica', slug: 'agricultura-organica', descripcion: 'Producción orgánica: certificación, abonos, control biológico.', descripcionCorta: 'Cultivos orgánicos.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Principios', 'Manejo del Suelo', 'Abonos Orgánicos', 'Control Biológico', 'Certificación'], categoria: 'agronomia' },
    { nombre: 'Cultivo de Palta para Exportación', slug: 'cultivo-palta', descripcion: 'Palta Hass: manejo agronómico, fitosanidad, post-cosecha.', descripcionCorta: 'Palta de exportación.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['Mercado', 'Variedades', 'Instalación', 'Manejo Agronómico', 'Sanidad', 'Cosecha', 'Exportación'], categoria: 'agronomia', destacado: true },

    // TURISMO
    { nombre: 'Gestión Hotelera', slug: 'gestion-hotelera', descripcion: 'Administración de hoteles: recepción, housekeeping, revenue.', descripcionCorta: 'Administración hotelera.', tipo: 'DIPLOMADO', horasAcademicas: 200, temario: ['Industria Hotelera', 'Recepción', 'Housekeeping', 'A&B', 'Revenue', 'Marketing', 'Calidad'], categoria: 'turismo', destacado: true },
    { nombre: 'Guía de Turismo', slug: 'guia-turismo', descripcion: 'Formación para guías: patrimonio, técnicas de guiado.', descripcionCorta: 'Guía de turismo.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Turismo en Perú', 'Patrimonio Cultural', 'Patrimonio Natural', 'Técnicas de Guiado', 'Primeros Auxilios'], categoria: 'turismo' },
    { nombre: 'Turismo Rural Comunitario', slug: 'turismo-rural', descripcion: 'Proyectos de turismo rural y sostenibilidad.', descripcionCorta: 'Turismo sostenible.', tipo: 'CERTIFICADO', horasAcademicas: 50, temario: ['TRC', 'Desarrollo Sostenible', 'Organización', 'Productos Turísticos', 'Comercialización'], categoria: 'turismo' },

    // GASTRONOMÍA
    { nombre: 'Cocina Peruana Tradicional', slug: 'cocina-peruana', descripcion: 'Platos representativos de la gastronomía peruana.', descripcionCorta: 'Cocina peruana.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['Historia', 'Insumos', 'Ceviches', 'Arroces', 'Anticuchos', 'Postres'], categoria: 'gastronomia', destacado: true },
    { nombre: 'Pastelería y Repostería', slug: 'pasteleria', descripcion: 'Técnicas de pastelería: masas, cremas, decoración.', descripcionCorta: 'Pastelería profesional.', tipo: 'DIPLOMADO', horasAcademicas: 180, temario: ['Fundamentos', 'Masas Básicas', 'Cremas', 'Bizcochos', 'Chocolatería', 'Fondant', 'Emprendimiento'], categoria: 'gastronomia', destacado: true },
    { nombre: 'Bartender Profesional', slug: 'bartender', descripcion: 'Coctelería clásica y moderna, servicio de bar.', descripcionCorta: 'Coctelería.', tipo: 'CERTIFICADO', horasAcademicas: 60, temario: ['El Bar', 'Destilados', 'Técnicas', 'Cócteles Clásicos', 'Coctelería Peruana', 'Servicio'], categoria: 'gastronomia' },
    { nombre: 'Manipulación de Alimentos - BPM', slug: 'bpm-alimentos', descripcion: 'Buenas prácticas: higiene, HACCP, normativa sanitaria.', descripcionCorta: 'Inocuidad alimentaria.', tipo: 'CONSTANCIA', horasAcademicas: 20, temario: ['Higiene Personal', 'Contaminación', 'Temperaturas', 'Almacenamiento', 'Normativa'], categoria: 'gastronomia' },

    // DERECHO
    { nombre: 'Derecho Laboral y Procesal Laboral', slug: 'derecho-laboral', descripcion: 'Legislación laboral: contratos, beneficios, despido, NLPT.', descripcionCorta: 'Derecho laboral.', tipo: 'DIPLOMADO', horasAcademicas: 280, temario: ['Fuentes', 'Contrato', 'Jornada', 'Remuneraciones', 'Beneficios', 'Despido', 'NLPT', 'SUNAFIL'], categoria: 'derecho', destacado: true },
    { nombre: 'Derecho Administrativo', slug: 'derecho-administrativo', descripcion: 'Procedimiento administrativo y contencioso administrativo.', descripcionCorta: 'Derecho administrativo.', tipo: 'DIPLOMADO', horasAcademicas: 240, temario: ['Derecho Administrativo', 'Acto Administrativo', 'Procedimiento', 'Recursos', 'Contencioso'], categoria: 'derecho' },
    { nombre: 'Derecho de Familia y Sucesiones', slug: 'derecho-familia', descripcion: 'Matrimonio, divorcio, filiación, alimentos, sucesiones.', descripcionCorta: 'Derecho de familia.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Matrimonio', 'Régimen Patrimonial', 'Divorcio', 'Filiación', 'Alimentos', 'Sucesiones'], categoria: 'derecho' },

    // RRHH
    { nombre: 'Gestión del Talento Humano', slug: 'gestion-talento-humano', descripcion: 'Gestión integral: reclutamiento, selección, capacitación, evaluación.', descripcionCorta: 'Gestión de RRHH.', tipo: 'DIPLOMADO', horasAcademicas: 240, temario: ['Gestión Estratégica', 'Diseño de Puestos', 'Reclutamiento', 'Selección', 'Capacitación', 'Evaluación', 'HR Analytics'], categoria: 'recursos-humanos', destacado: true },
    { nombre: 'Nóminas y Legislación Laboral', slug: 'nominas', descripcion: 'Cálculo de remuneraciones, beneficios, AFP, CTS.', descripcionCorta: 'Nóminas y beneficios.', tipo: 'CERTIFICADO', horasAcademicas: 80, temario: ['Remuneración', 'Jornada', 'Horas Extras', 'Vacaciones', 'Gratificaciones', 'CTS', 'AFP/ONP', 'Liquidación'], categoria: 'recursos-humanos' },
  ];

  // Eliminar datos existentes (en orden por foreign keys)
  await prisma.inscripcion.deleteMany({});
  await prisma.certificado.deleteMany({});
  await prisma.curso.deleteMany({});
  console.log('🗑️ Datos anteriores eliminados');

  // Crear cursos con precios 20-40 soles
  let cursoIndex = 0;
  for (const cursoData of cursosData) {
    const precio = randomPrice(20, 40);
    const precioOriginal = precio + randomPrice(10, 30);

    const curso = {
      nombre: cursoData.nombre,
      slug: cursoData.slug,
      descripcion: cursoData.descripcion,
      descripcionCorta: cursoData.descripcionCorta,
      tipo: cursoData.tipo,
      modalidad: 'VIRTUAL' as const,
      horasAcademicas: cursoData.horasAcademicas,
      horasCronologicas: Math.floor(cursoData.horasAcademicas * 0.75),
      creditos: cursoData.tipo === 'DIPLOMADO' ? Math.floor(cursoData.horasAcademicas / 30) : cursoData.tipo === 'CERTIFICADO' ? Math.floor(cursoData.horasAcademicas / 20) : undefined,
      precio,
      precioOriginal,
      imagen: getImagen(cursoData.categoria, cursoIndex),
      temario: cursoData.temario.map((t, i) => `Módulo ${i + 1}: ${t}`),
      objetivos: [`Dominar los conceptos de ${cursoData.nombre.toLowerCase()}`, 'Aplicar conocimientos en situaciones reales'],
      requisitos: ['Ninguno'],
      dirigidoA: ['Profesionales', 'Estudiantes', 'Público en general'],
      activo: true,
      destacado: cursoData.destacado || false,
      categoriaId: catMap[cursoData.categoria],
      creadorId: admin.id,
    };

    try {
      await prisma.curso.create({
        data: curso,
        select: { id: true },
      });
      cursoIndex++;
    } catch (error) {
      console.error(`Error creando ${cursoData.slug}:`, error);
    }
  }
  console.log('✅ Cursos creados:', cursosData.length);

  // Configuraciones
  const configs = [
    { clave: 'institucion_nombre', valor: 'CertificadosPerú', descripcion: 'Nombre de la institución' },
    { clave: 'institucion_ruc', valor: '20123456789', descripcion: 'RUC' },
    { clave: 'institucion_direccion', valor: 'Lima, Perú', descripcion: 'Dirección' },
    { clave: 'firma_director', valor: 'Dr. Juan Pérez García', descripcion: 'Director' },
    { clave: 'cargo_director', valor: 'Director General', descripcion: 'Cargo' },
  ];

  for (const config of configs) {
    await prisma.configuracion.upsert({
      where: { clave: config.clave },
      update: {},
      create: config,
    });
  }
  console.log('✅ Configuraciones creadas');

  console.log('🎉 Seed completado!');
  console.log(`   - ${categorias.length} categorías`);
  console.log(`   - ${cursosData.length} cursos con precios S/. 20-40`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
