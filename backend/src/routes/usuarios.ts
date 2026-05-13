import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  editarUsuario,
  cambiarPassword,
  eliminarUsuario,
} from "../controllers/usuarios";

const router = Router();
router.use(requireAuth);
router.use(requireRole("GOD"));

router.get("/", listarUsuarios);
router.get("/:id", obtenerUsuario);
router.post("/", crearUsuario);
router.patch("/:id", editarUsuario);
router.patch("/:id/password", cambiarPassword);
router.delete("/:id", eliminarUsuario);

export default router;
