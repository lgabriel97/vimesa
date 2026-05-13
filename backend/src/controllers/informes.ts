import { Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { generarPdfInforme } from "../pdf/generador";
import { getTipoConfig, TIPOS_INFORME } from "../informes/registry";

// Schema "envoltorio": campos comunes + tipo + datos
const InformeEnvoltorioSchema = z.object({
  tipo: z.string().min(1),
  fechaConclusion: z.string().min(1),
  firmaTecnico: z.string().min(1),
  datos: z.unknown(), // se validará con el schema específico del tipo
});

const RevisionSchema = z.object({
  estado: z.enum(["APROBADO", "RECHAZADO", "DEVUELTO"]),
  comentariosRevisor: z.string().optional(),
});

/**
 * Valida el envoltorio + los datos específicos según el tipo.
 */
function parseInforme(body: unknown) {
  const envoltorio = InformeEnvoltorioSchema.parse(body);

  if (!(envoltorio.tipo in TIPOS_INFORME)) {
    throw new Error(`Tipo de informe no soportado: ${envoltorio.tipo}`);
  }

  const config = getTipoConfig(envoltorio.tipo);
  const datos = config.schema.parse(envoltorio.datos);

  return {
    tipo: envoltorio.tipo as keyof typeof TIPOS_INFORME,
    fechaConclusion: envoltorio.fechaConclusion,
    firmaTecnico: envoltorio.firmaTecnico,
    datos,
  };
}

export async function crearInforme(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = parseInforme(req.body);

    const informe = await prisma.informe.create({
      data: {
        tipo: data.tipo as any,
        fechaConclusion: new Date(data.fechaConclusion),
        firmaTecnico: data.firmaTecnico,
        datos: data.datos as any,
        tecnicoId: req.user!.id,
      },
    });

    res.status(201).json(informe);
  } catch (e) {
    next(e);
  }
}

export async function editarInforme(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    if (typeof id !== "string")
      return res.status(400).json({ error: "ID inválido" });

    const data = parseInforme(req.body);

    const informeExistente = await prisma.informe.findUnique({
      where: { id },
      select: { tecnicoId: true, estado: true, tipo: true },
    });
    if (!informeExistente)
      return res.status(404).json({ error: "No encontrado" });

    if (req.user!.rol === "TECNICO") {
      if (informeExistente.tecnicoId !== req.user!.id) {
        return res.status(403).json({ error: "No es tu informe" });
      }
      if (informeExistente.estado !== "DEVUELTO") {
        return res
          .status(403)
          .json({ error: "Solo puedes editar informes devueltos" });
      }
    }

    if (informeExistente.tipo !== data.tipo) {
      return res
        .status(400)
        .json({ error: "No se puede cambiar el tipo del informe" });
    }

    const nuevoEstado =
      req.user!.rol === "TECNICO" ? "PENDIENTE" : informeExistente.estado;

    const informe = await prisma.informe.update({
      where: { id },
      data: {
        fechaConclusion: new Date(data.fechaConclusion),
        firmaTecnico: data.firmaTecnico,
        datos: data.datos as any,
        estado: nuevoEstado,
      },
    });

    res.json(informe);
  } catch (e) {
    next(e);
  }
}

export async function listarInformes(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const estadoRaw = req.query.estado;
    const estado = typeof estadoRaw === "string" ? estadoRaw : undefined;
    const tipoRaw = req.query.tipo;
    const tipo = typeof tipoRaw === "string" ? tipoRaw : undefined;

    const where: any = {};
    if (estado) where.estado = estado.toUpperCase();
    if (tipo) where.tipo = tipo.toUpperCase();
    if (req.user!.rol === "TECNICO") where.tecnicoId = req.user!.id;

    const informes = await prisma.informe.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { tecnico: { select: { id: true, nombre: true } } },
    });

    res.json(informes);
  } catch (e) {
    next(e);
  }
}

export async function obtenerInforme(
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
      include: {
        tecnico: { select: { id: true, nombre: true, email: true } },
        revisor: { select: { id: true, nombre: true } },
      },
    });

    if (!informe) return res.status(404).json({ error: "No encontrado" });
    if (req.user!.rol === "TECNICO" && informe.tecnicoId !== req.user!.id) {
      return res.status(403).json({ error: "Sin permisos" });
    }

    res.json(informe);
  } catch (e) {
    next(e);
  }
}

export async function revisarInforme(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    if (typeof id !== "string")
      return res.status(400).json({ error: "ID inválido" });

    const data = RevisionSchema.parse(req.body);

    const informe = await prisma.informe.update({
      where: { id },
      data: {
        estado: data.estado,
        comentariosRevisor: data.comentariosRevisor ?? null,
        revisorId: req.user!.id,
        reviewedAt: new Date(),
      },
    });

    if (data.estado === "APROBADO") {
      try {
        const informeCompleto = await prisma.informe.findUnique({
          where: { id },
          include: {
            tecnico: { select: { id: true, nombre: true, email: true } },
          },
        });

        if (informeCompleto) {
          const buffer = await generarPdfInforme({
            informe: informeCompleto,
            esBorrador: false,
          });

          await prisma.pdf.create({
            data: {
              informeId: id,
              contenido: new Uint8Array(buffer),
              generadoPorId: req.user!.id,
            },
          });
        }
      } catch (pdfErr) {
        console.error("Error generando PDF al aprobar:", pdfErr);
      }
    }

    res.json(informe);
  } catch (e) {
    next(e);
  }
}
