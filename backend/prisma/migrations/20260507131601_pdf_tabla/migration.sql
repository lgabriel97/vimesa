-- CreateEnum
CREATE TYPE "PdfTipo" AS ENUM ('PREVIEW', 'DEFINITIVO');

-- CreateTable
CREATE TABLE "Pdf" (
    "id" TEXT NOT NULL,
    "informeId" TEXT NOT NULL,
    "tipo" "PdfTipo" NOT NULL,
    "contenido" BYTEA NOT NULL,
    "generadoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pdf_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pdf_informeId_tipo_idx" ON "Pdf"("informeId", "tipo");

-- CreateIndex
CREATE INDEX "Pdf_generadoPorId_idx" ON "Pdf"("generadoPorId");

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_informeId_fkey" FOREIGN KEY ("informeId") REFERENCES "Informe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_generadoPorId_fkey" FOREIGN KEY ("generadoPorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
