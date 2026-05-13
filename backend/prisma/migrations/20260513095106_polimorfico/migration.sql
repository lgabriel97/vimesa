/*
  Warnings:

  - You are about to drop the column `actuaciones` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `cellnexConfig` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `cliente` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `equipo` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `equipoApto` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `motivosNoApto` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `nSerie` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `noOrden` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `observaciones` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `sitio` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `snmpV1` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `snmpV2` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `tempAmbiente` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `testsRealizados` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `tipoEquipo` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `versionFirmware` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the column `versionWebServer` on the `Informe` table. All the data in the column will be lost.
  - You are about to drop the `Medida` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `datos` to the `Informe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Informe` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoFormulario" AS ENUM ('VERIFICACION_FM');

-- DropForeignKey
ALTER TABLE "Medida" DROP CONSTRAINT "Medida_informeId_fkey";

-- AlterTable
ALTER TABLE "Informe" DROP COLUMN "actuaciones",
DROP COLUMN "cellnexConfig",
DROP COLUMN "cliente",
DROP COLUMN "equipo",
DROP COLUMN "equipoApto",
DROP COLUMN "motivosNoApto",
DROP COLUMN "nSerie",
DROP COLUMN "noOrden",
DROP COLUMN "observaciones",
DROP COLUMN "sitio",
DROP COLUMN "snmpV1",
DROP COLUMN "snmpV2",
DROP COLUMN "tempAmbiente",
DROP COLUMN "testsRealizados",
DROP COLUMN "tipoEquipo",
DROP COLUMN "versionFirmware",
DROP COLUMN "versionWebServer",
ADD COLUMN     "datos" JSONB NOT NULL,
ADD COLUMN     "tipo" "TipoFormulario" NOT NULL;

-- DropTable
DROP TABLE "Medida";

-- DropEnum
DROP TYPE "TipoEquipo";

-- DropEnum
DROP TYPE "TipoMedida";

-- CreateIndex
CREATE INDEX "Informe_tipo_idx" ON "Informe"("tipo");
