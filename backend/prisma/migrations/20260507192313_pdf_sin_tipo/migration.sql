/*
  Warnings:

  - You are about to drop the column `tipo` on the `Pdf` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Pdf_informeId_tipo_idx";

-- AlterTable
ALTER TABLE "Pdf" DROP COLUMN "tipo";

-- DropEnum
DROP TYPE "PdfTipo";

-- CreateIndex
CREATE INDEX "Pdf_informeId_idx" ON "Pdf"("informeId");
