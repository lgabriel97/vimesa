import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.usuario.upsert({
    where: { email: "admin@vimesa.com" },
    update: {},
    create: {
      email: "admin@vimesa.com",
      nombre: "Admin",
      passwordHash,
      rol: "ADMIN",
    },
  });

  await prisma.usuario.upsert({
    where: { email: "tecnico@vimesa.com" },
    update: {},
    create: {
      email: "tecnico@vimesa.com",
      nombre: "Técnico",
      passwordHash,
      rol: "TECNICO",
    },
  });

  console.log("✓ Usuarios sembrados");
}

main().finally(() => prisma.$disconnect());
