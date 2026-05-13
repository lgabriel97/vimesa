import { Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const CrearUsuarioSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nombre: z.string().min(1),
  rol: z.enum(["TECNICO", "ADMIN", "GOD"]),
});

const EditarUsuarioSchema = z.object({
  email: z.string().email().optional(),
  nombre: z.string().min(1).optional(),
  rol: z.enum(["TECNICO", "ADMIN", "GOD"]).optional(),
});

const CambiarPasswordSchema = z.object({
  password: z.string().min(6),
});

export async function listarUsuarios(
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, email: true, nombre: true, rol: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(usuarios);
  } catch (e) {
    next(e);
  }
}

export async function obtenerUsuario(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
    try {
    const { id } = req.params;
    if (typeof id !== "string") return res.status(400).json({ error: "ID inválido" });

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: { id: true, email: true, nombre: true, rol: true, createdAt: true },
    });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (e) {
    next(e);
  }
}

export async function crearUsuario
(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password, nombre, rol } = CrearUsuarioSchema.parse(req.body);

    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe)
      return res.status(409).json({ error: "El email ya está registrado" });

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: { email, passwordHash, nombre, rol: rol as any },
      select: { id: true, email: true, nombre: true, rol: true, createdAt: true },
    });

    res.status(201).json(usuario);
  } catch (e) {
    next(e);
  }
}

export async function editarUsuario(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    if (typeof id !== "string") return res.status(400).json({ error: "ID inválido" });

    const data = EditarUsuarioSchema.parse(req.body);

    const usuario = await prisma.usuario.update({
      where: { id },
      data: data as any,
      select: { id: true, email: true, nombre: true, rol: true, createdAt: true },
    });

    res.json(usuario);
  } catch (e) {
    next(e);
  }
}

export async function cambiarPassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    if (typeof id !== "string") return res.status(400).json({ error: "ID inválido" });

    const { password } = CambiarPasswordSchema.parse(req.body);

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.usuario.update({
      where: { id },
      data: { passwordHash },
    });

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function eliminarUsuario(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    if (typeof id !== "string") return res.status(400).json({ error: "ID inválido" });

    if (id === req.user!.id)
      return res.status(400).json({ error: "No puedes eliminarte a ti mismo" });

    await prisma.usuario.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
