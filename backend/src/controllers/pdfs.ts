import { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { generarPdfInforme } from "../pdf/generador";

/**
 * POST /api/informes/:id/pdf
 * Genera un PDF del informe. El body puede incluir { tipo: "preview" | "definitivo" }.
 * - "preview" reemplaza cualquier PDF borrador anterior del mismo informe.
 * - "definitivo" reemplaza TODOS los PDFs anteriores (borradores y definitivos).
 */
export async function generarPdf(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    if (typeof id !== "string")
      return res.status(400).json({ error: "ID inválido" });

    const tipo = req.body?.tipo === "definitivo" ? "definitivo" : "preview";

    const informe = await prisma.informe.findUnique({
      where: { id },
      include: {
        tecnico: { select: { id: true, nombre: true, email: true } },
      },
    });

    if (!informe)
      return res.status(404).json({ error: "Informe no encontrado" });

    if (tipo === "definitivo" && req.user!.rol !== "ADMIN") {
      return res.status(403).json({ error: "Solo admin puede generar PDFs definitivos" });
    }
    if (tipo === "preview" && req.user!.rol === "TECNICO" && req.user!.id !== informe.tecnicoId) {
      return res.status(403).json({ error: "Solo el autor puede generar borradores" });
    }

    const esBorrador = tipo !== "definitivo";

    if (tipo === "definitivo") {
      await prisma.pdf.deleteMany({ where: { informeId: id } });
    } else {
      await prisma.pdf.deleteMany({ where: { informeId: id, esBorrador: true } });
    }

    const buffer = await generarPdfInforme({
      informe,
      esBorrador,
    });

    const pdf = await prisma.pdf.create({
      data: {
        informeId: id,
        contenido: new Uint8Array(buffer),
        generadoPorId: req.user!.id,
        esBorrador,
      },
      select: {
        id: true,
        createdAt: true,
        esBorrador: true,
        generadoPor: { select: { id: true, nombre: true } },
      },
    });

    res.status(201).json(pdf);
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/informes/:id/pdfs
 */
export async function listarPdfsDeInforme(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    if (typeof id !== "string")
      return res.status(400).json({ error: "ID inválido" });

    const informe = await prisma.informe.findUnique({
      where: { id },
      select: { tecnicoId: true },
    });
    if (!informe)
      return res.status(404).json({ error: "Informe no encontrado" });

    if (req.user!.rol === "TECNICO" && informe.tecnicoId !== req.user!.id) {
      return res.status(403).json({ error: "Sin permisos" });
    }

    const pdfs = await prisma.pdf.findMany({
      where: { informeId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        esBorrador: true,
        generadoPor: { select: { id: true, nombre: true } },
      },
    });

    res.json(pdfs);
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/pdfs/:id/download
 */
export async function descargarPdf(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    if (typeof id !== "string")
      return res.status(400).json({ error: "ID inválido" });

    const pdf = await prisma.pdf.findUnique({
      where: { id },
      include: {
        informe: {
          select: {
            id: true,
            tecnicoId: true,
            tipo: true,
            estado: true,
          },
        },
      },
    });

    if (!pdf) return res.status(404).json({ error: "PDF no encontrado" });

    if (req.user!.rol === "TECNICO" && pdf.informe.tecnicoId !== req.user!.id) {
      return res.status(403).json({ error: "Sin permisos" });
    }

    const fecha = pdf.createdAt.toISOString().slice(0, 10);
    const sufijo = pdf.esBorrador ? "borrador" : "definitivo";
    const filename = `${pdf.informe.tipo.toLowerCase()}_${pdf.informeId.slice(0, 8)}_${sufijo}_${fecha}.pdf`;

    const bytes = Buffer.from(pdf.contenido);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", bytes.length);
    res.send(bytes);
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/pdfs
 */
export async function listarPdfs(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.user!.rol !== "ADMIN") {
      return res.status(403).json({ error: "Sin permisos" });
    }

    const pdfs = await prisma.pdf.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        esBorrador: true,
        informe: {
          select: {
            id: true,
            tipo: true,
            estado: true,
            datos: true,
          },
        },
        generadoPor: { select: { id: true, nombre: true } },
      },
    });

    res.json(pdfs);
  } catch (e) {
    next(e);
  }
}
