import { Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { InformeSchema, RevisionSchema } from "../schemas/informe";
import { AuthRequest } from "../middleware/auth";
import { generarPdfInforme } from "../pdf/generador";

const tipoEquipoMap = {
  nuevo: "NUEVO",
  reparado_fabrica: "REPARADO_FABRICA",
  reparado_vimesa: "REPARADO_VIMESA",
} as const;

/**
 * PUT /api/informes/:id
 * Edita un informe existente.
 * - Técnico: solo si es el autor Y el informe está DEVUELTO. Al guardar, vuelve a PENDIENTE.
 * - Admin: cualquier informe en cualquier estado. Mantiene el estado actual.
 */
export async function editarInforme(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    if (typeof id !== "string")
      return res.status(400).json({ error: "ID inválido" });

    const data = InformeSchema.parse(req.body);

    const informeExistente = await prisma.informe.findUnique({
      where: { id },
      select: { tecnicoId: true, estado: true },
    });

    if (!informeExistente)
      return res.status(404).json({ error: "No encontrado" });

    // Permisos
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
    // Admin puede editar siempre

    // Tras la edición:
    // - Si edita técnico: vuelve a PENDIENTE
    // - Si edita admin: mantiene el estado
    const nuevoEstado =
      req.user!.rol === "TECNICO" ? "PENDIENTE" : informeExistente.estado;

    const informe = await prisma.$transaction(async (tx) => {
      // Borra las medidas existentes y crea las nuevas (más simple que diff)
      await tx.medida.deleteMany({ where: { informeId: id } });

      return tx.informe.update({
        where: { id },
        data: {
          equipo: data.equipo,
          noOrden: data.noOrden,
          nSerie: data.nSerie,
          cliente: data.cliente,
          sitio: data.sitio,
          tipoEquipo: data.tipoEquipo ? tipoEquipoMap[data.tipoEquipo] : null,
          tempAmbiente: data.tempAmbiente,
          observaciones: data.observaciones,
          versionFirmware: data.versionFirmware,
          versionWebServer: data.versionWebServer,
          snmpV1: data.snmpV1 ?? Prisma.JsonNull,
          snmpV2: data.snmpV2 ?? Prisma.JsonNull,
          testsRealizados: data.testsRealizados,
          cellnexConfig: data.cellnexConfig,
          equipoApto: data.equipoApto,
          motivosNoApto: data.motivosNoApto,
          actuaciones: data.actuaciones,
          fechaConclusion: new Date(data.fechaConclusion),
          firmaTecnico: data.firmaTecnico,
          estado: nuevoEstado,
          medidas: {
            create: [
              ...data.medidas.map((m, i) => ({
                ...m,
                tipo: "PRINCIPAL" as const,
                orden: i,
              })),
              ...data.medidasCamara.map((m, i) => ({
                ...m,
                tipo: "CAMARA" as const,
                orden: i,
              })),
            ],
          },
        },
        include: { medidas: true },
      });
    });

    res.json(informe);
  } catch (e) {
    next(e);
  }
}

export async function crearInforme(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = InformeSchema.parse(req.body);

    const informe = await prisma.informe.create({
      data: {
        equipo: data.equipo,
        noOrden: data.noOrden,
        nSerie: data.nSerie,
        cliente: data.cliente,
        sitio: data.sitio,
        tipoEquipo: data.tipoEquipo ? tipoEquipoMap[data.tipoEquipo] : null,
        tempAmbiente: data.tempAmbiente,
        observaciones: data.observaciones,
        versionFirmware: data.versionFirmware,
        versionWebServer: data.versionWebServer,
        snmpV1: data.snmpV1 ?? Prisma.JsonNull,
        snmpV2: data.snmpV2 ?? Prisma.JsonNull,
        testsRealizados: data.testsRealizados,
        cellnexConfig: data.cellnexConfig,
        equipoApto: data.equipoApto,
        motivosNoApto: data.motivosNoApto,
        actuaciones: data.actuaciones,
        fechaConclusion: new Date(data.fechaConclusion),
        firmaTecnico: data.firmaTecnico,
        tecnicoId: req.user!.id,
        medidas: {
          create: [
            ...data.medidas.map((m, i) => ({
              ...m,
              tipo: "PRINCIPAL" as const,
              orden: i,
            })),
            ...data.medidasCamara.map((m, i) => ({
              ...m,
              tipo: "CAMARA" as const,
              orden: i,
            })),
          ],
        },
      },
      include: { medidas: true },
    });

    res.status(201).json(informe);
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

    const where: any = {};
    if (estado) where.estado = estado.toUpperCase();
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
        medidas: { orderBy: [{ tipo: "asc" }, { orden: "asc" }] },
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

    // Si se aprueba, generamos el PDF definitivo automáticamente.
    // Si falla, lo logueamos pero no rompemos la aprobación.
    if (data.estado === "APROBADO") {
      try {
        const informeCompleto = await prisma.informe.findUnique({
          where: { id },
          include: {
            medidas: { orderBy: [{ tipo: "asc" }, { orden: "asc" }] },
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
              // tipo: "DEFINITIVO",   ← ELIMINA esta línea
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
