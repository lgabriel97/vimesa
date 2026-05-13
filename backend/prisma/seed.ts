import "dotenv/config";
import fs from "fs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CREDENTIALS = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Usuarios del sistema:
  god@vimesa.com   / admin123  (Super Admin)
  admin@vimesa.com / admin123  (Administrador)
  tecnico@vimesa.com / admin123 (Técnico)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

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

  await prisma.usuario.upsert({
    where: { email: "god@vimesa.com" },
    update: {},
    create: {
      email: "god@vimesa.com",
      nombre: "Super Admin",
      passwordHash,
      rol: "GOD",
    },
  });

  try {
    fs.writeFileSync("/app/seed-info", CREDENTIALS.trim());
  } catch {}

  console.log(CREDENTIALS);
}

main().finally(() => prisma.$disconnect());
