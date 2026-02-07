// Tipos para el panel de administración

// Tipo de documento de certificación
export type TipoDocumento = 'diplomado' | 'certificado' | 'constancia';

// Modalidad del curso
export type Modalidad = 'virtual' | 'presencial' | 'semipresencial';

// Estado del certificado
export type EstadoCertificado = 'emitido' | 'pendiente' | 'anulado';

// Información requerida para concursos públicos del estado peruano
export interface CertificadoPeruano {
  id: string;
  codigoVerificacion: string; // Código único para verificación QR

  // Datos del participante
  participante: {
    nombreCompleto: string;
    tipoDocumento: 'DNI' | 'CE' | 'PASAPORTE';
    numeroDocumento: string;
    email?: string;
    telefono?: string;
  };

  // Datos del curso/programa
  curso: {
    nombre: string;
    tipo: TipoDocumento;
    modalidad: Modalidad;
    horasAcademicas: number;
    horasCronologicas?: number;
    creditos?: number;
    temario: string[];
    objetivos?: string;
  };

  // Fechas importantes
  fechas: {
    inicio: string;
    fin: string;
    emision: string;
  };

  // Datos de la institución
  institucion: {
    nombre: string;
    ruc?: string;
    direccion?: string;
    logo?: string;
  };

  // Firmas y validación
  firmantes: {
    nombre: string;
    cargo: string;
    firma?: string;
  }[];

  // Metadatos
  estado: EstadoCertificado;
  urlVerificacion: string;
  qrCode?: string;
  observaciones?: string;

  // Auditoría
  creadoPor: string;
  fechaCreacion: string;
  modificadoPor?: string;
  fechaModificacion?: string;
}

// Curso/Programa para administrar
export interface CursoAdmin {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  tipo: TipoDocumento;
  modalidad: Modalidad;
  horasAcademicas: number;
  horasCronologicas?: number;
  creditos?: number;
  precio: number;
  precioOriginal?: number;
  temario: string[];
  objetivos: string;
  requisitos?: string[];
  dirigidoA?: string[];
  instructor: string;
  categoriaId: string;
  imagen?: string;
  activo: boolean;
  destacado: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  cupoMaximo?: number;
  inscritos: number;
  createdAt: string;
  updatedAt: string;
}

// Participante/Estudiante
export interface Participante {
  id: string;
  nombreCompleto: string;
  tipoDocumento: 'DNI' | 'CE' | 'PASAPORTE';
  numeroDocumento: string;
  email: string;
  telefono?: string;
  direccion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  ocupacion?: string;
  centroTrabajo?: string;
  cursosInscritos: string[];
  certificadosEmitidos: string[];
  createdAt: string;
  updatedAt: string;
}

// Estadísticas del dashboard
export interface DashboardStats {
  totalCursos: number;
  totalParticipantes: number;
  certificadosEmitidos: number;
  ingresosMes: number;
  cursosActivos: number;
  inscripcionesMes: number;
  diplomados: number;
  certificados: number;
  constancias: number;
}

// Usuario administrador
export interface AdminUser {
  id: string;
  nombre: string;
  email: string;
  rol: 'superadmin' | 'admin' | 'editor';
  avatar?: string;
  activo: boolean;
  ultimoAcceso?: string;
}
