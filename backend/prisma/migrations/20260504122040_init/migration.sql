-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('TECNICO', 'ADMIN');

-- CreateEnum
CREATE TYPE "TipoEquipo" AS ENUM ('NUEVO', 'REPARADO_FABRICA', 'REPARADO_VIMESA');

-- CreateEnum
CREATE TYPE "EstadoInforme" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'DEVUELTO');

-- CreateEnum
CREATE TYPE "TipoMedida" AS ENUM ('PRINCIPAL', 'CAMARA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'TECNICO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Informe" (
    "id" TEXT NOT NULL,
    "equipo" TEXT NOT NULL,
    "noOrden" TEXT NOT NULL,
    "nSerie" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "sitio" TEXT NOT NULL,
    "tipoEquipo" "TipoEquipo" NOT NULL,
    "tempAmbiente" DOUBLE PRECISION NOT NULL,
    "observaciones" TEXT,
    "versionFirmware" TEXT NOT NULL,
    "versionWebServer" TEXT NOT NULL,
    "snmpV1" JSONB NOT NULL,
    "snmpV2" JSONB NOT NULL,
    "testsRealizados" TEXT[],
    "cellnexConfig" TEXT[],
    "equipoApto" BOOLEAN NOT NULL,
    "motivosNoApto" TEXT,
    "actuaciones" TEXT,
    "fechaConclusion" TIMESTAMP(3) NOT NULL,
    "firmaTecnico" TEXT NOT NULL,
    "estado" "EstadoInforme" NOT NULL DEFAULT 'PENDIENTE',
    "tecnicoId" TEXT NOT NULL,
    "revisorId" TEXT,
    "comentariosRevisor" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Informe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medida" (
    "id" TEXT NOT NULL,
    "informeId" TEXT NOT NULL,
    "tipo" "TipoMedida" NOT NULL,
    "orden" INTEGER NOT NULL,
    "frecMhz" DOUBLE PRECISION NOT NULL,
    "potW" DOUBLE PRECISION,
    "vpaV" DOUBLE PRECISION,
    "ipa1" DOUBLE PRECISION,
    "ipa2" DOUBLE PRECISION,
    "ipa3" DOUBLE PRECISION,
    "tOut" DOUBLE PRECISION,
    "tCase" DOUBLE PRECISION,
    "tPwS" DOUBLE PRECISION,
    "eff" DOUBLE PRECISION,
    "if1" DOUBLE PRECISION,
    "if2" DOUBLE PRECISION,
    "if3" DOUBLE PRECISION,

    CONSTRAINT "Medida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Informe_estado_idx" ON "Informe"("estado");

-- CreateIndex
CREATE INDEX "Informe_tecnicoId_idx" ON "Informe"("tecnicoId");

-- CreateIndex
CREATE INDEX "Medida_informeId_idx" ON "Medida"("informeId");

-- AddForeignKey
ALTER TABLE "Informe" ADD CONSTRAINT "Informe_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Informe" ADD CONSTRAINT "Informe_revisorId_fkey" FOREIGN KEY ("revisorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medida" ADD CONSTRAINT "Medida_informeId_fkey" FOREIGN KEY ("informeId") REFERENCES "Informe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
