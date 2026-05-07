import "dotenv/config";
import fs from "fs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { generarPdfInforme, cerrarBrowser } from "../src/pdf/generador";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Coge cualquier informe con sus relaciones
  const informe = await prisma.informe.findFirst({
    include: {
      medidas: { orderBy: [{ tipo: "asc" }, { orden: "asc" }] },
      tecnico: { select: { id: true, nombre: true, email: true } },
    },
  });

  if (!informe) {
    console.error("No hay informes en la BD. Crea uno primero.");
    process.exit(1);
  }

  console.log("Generando PDF de informe", informe.id);

  const pdfBuffer = await generarPdfInforme({
    informe,
    esBorrador: true,
  });

  const ruta = "/tmp/test-informe.pdf";
  fs.writeFileSync(ruta, pdfBuffer);
  console.log(`✓ PDF guardado en ${ruta} (${pdfBuffer.length} bytes)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await cerrarBrowser();
    await prisma.$disconnect();
  });
