import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { descargarPdf, listarPdfs } from "../controllers/pdfs";

const router = Router();
router.use(requireAuth);

router.get("/", listarPdfs);
router.get("/:id/download", descargarPdf);

export default router;
