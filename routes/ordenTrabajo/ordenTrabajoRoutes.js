const express = require("express");
const router = express.Router();
const ordenCtrl = require("../../controllers/Mantenimiento/ordenTrabajoController");
const authMidd = require("../../middleware/authMidd");

// 🔥 CREAR
router.post("/", authMidd, ordenCtrl.crearOrden);

// 🔥 OBTENER POR MANTENIMIENTO (CORRECTO)
router.get(
  "/mantenimiento/:mantenimientoId",
  authMidd,
  ordenCtrl.obtenerOrdenPorMantenimiento,
);

// 🔥 ACTUALIZAR
router.put("/:id", authMidd, ordenCtrl.actualizarOrden);

// 🔥 ELIMINAR
router.delete("/:id", authMidd, ordenCtrl.eliminarOrden);

module.exports = router;
