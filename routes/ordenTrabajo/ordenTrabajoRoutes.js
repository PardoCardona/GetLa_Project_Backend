const express = require("express");
const router = express.Router();
const ordenCtrl = require("../../controllers/Mantenimiento/ordenTrabajoController");
const authMidd = require("../../middleware/authMidd");

// 🔥 CREAR
router.post("/", authMidd, ordenCtrl.crearOrden);

// 🔥 OBTENER POR MANTENIMIENTO
router.get(
  "/mantenimiento/:mantenimientoId",
  authMidd,
  ordenCtrl.obtenerOrdenPorMantenimiento
);

// 🔥 ACTUALIZAR
router.put("/:id", authMidd, ordenCtrl.actualizarOrden);

// 🔥 🔥 NUEVO — CERRAR ORDEN (CLAVE)
router.put("/:id/cerrar", authMidd, ordenCtrl.cerrarOrden);

// 🔥 ELIMINAR
router.delete("/:id", authMidd, ordenCtrl.eliminarOrden);

module.exports = router;