-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPERADMIN', 'ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "TipoCurso" AS ENUM ('DIPLOMADO', 'CERTIFICADO', 'CONSTANCIA');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('VIRTUAL', 'PRESENCIAL', 'SEMIPRESENCIAL');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('DNI', 'CE', 'PASAPORTE');

-- CreateEnum
CREATE TYPE "EstadoInscripcion" AS ENUM ('PENDIENTE', 'PAGADO', 'CURSANDO', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoCertificado" AS ENUM ('EMITIDO', 'PENDIENTE', 'ANULADO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'ADMIN',
    "avatar" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcceso" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "icono" TEXT,
    "color" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "descripcionCorta" TEXT,
    "tipo" "TipoCurso" NOT NULL,
    "modalidad" "Modalidad" NOT NULL,
    "horasAcademicas" INTEGER NOT NULL,
    "horasCronologicas" INTEGER,
    "creditos" DOUBLE PRECISION,
    "precio" DOUBLE PRECISION NOT NULL,
    "precioOriginal" DOUBLE PRECISION,
    "imagen" TEXT,
    "temario" TEXT[],
    "objetivos" TEXT,
    "requisitos" TEXT[],
    "dirigidoA" TEXT[],
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "cupoMaximo" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "creadorId" TEXT NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participante" (
    "id" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "departamento" TEXT,
    "provincia" TEXT,
    "distrito" TEXT,
    "ocupacion" TEXT,
    "centroTrabajo" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" TEXT NOT NULL,
    "estado" "EstadoInscripcion" NOT NULL DEFAULT 'PENDIENTE',
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaPago" TIMESTAMP(3),
    "metodoPago" TEXT,
    "comprobante" TEXT,
    "monto" DOUBLE PRECISION NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "participanteId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificado" (
    "id" TEXT NOT NULL,
    "codigoVerificacion" TEXT NOT NULL,
    "nombreCurso" TEXT NOT NULL,
    "tipoCurso" "TipoCurso" NOT NULL,
    "modalidad" "Modalidad" NOT NULL,
    "horasAcademicas" INTEGER NOT NULL,
    "horasCronologicas" INTEGER,
    "creditos" DOUBLE PRECISION,
    "temario" TEXT[],
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "institucionNombre" TEXT NOT NULL DEFAULT 'CertificadosPerú',
    "institucionRuc" TEXT,
    "institucionDireccion" TEXT,
    "institucionLogo" TEXT,
    "firmantes" JSONB NOT NULL,
    "estado" "EstadoCertificado" NOT NULL DEFAULT 'EMITIDO',
    "urlVerificacion" TEXT NOT NULL,
    "qrCode" TEXT,
    "observaciones" TEXT,
    "nota" DOUBLE PRECISION,
    "notaLetra" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "participanteId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "emitidoPorId" TEXT NOT NULL,

    CONSTRAINT "Certificado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_slug_key" ON "Categoria"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_slug_key" ON "Curso"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Participante_numeroDocumento_key" ON "Participante"("numeroDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "Participante_email_key" ON "Participante"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_participanteId_cursoId_key" ON "Inscripcion"("participanteId", "cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificado_codigoVerificacion_key" ON "Certificado"("codigoVerificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Configuracion_clave_key" ON "Configuracion"("clave");

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_emitidoPorId_fkey" FOREIGN KEY ("emitidoPorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
