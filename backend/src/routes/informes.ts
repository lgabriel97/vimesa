import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  crearInforme,
  editarInforme,
  listarInformes,
  obtenerInforme,
  revisarInforme,
} from "../controllers/informes";
import { generarPdf, listarPdfsDeInforme } from "../controllers/pdfs";

const router = Router();
router.use(requireAuth);

router.post("/", requireRole("TECNICO"), crearInforme);
router.put("/:id", editarInforme); // ← nuevo
router.get("/", listarInformes);
router.get("/:id", obtenerInforme);
router.patch("/:id/revisar", requireRole("ADMIN"), revisarInforme);

router.post("/:id/pdf", requireRole("ADMIN"), generarPdf); // ← solo admin
router.get("/:id/pdfs", listarPdfsDeInforme);

export default router;
