const express = require("express");
const router = express.Router();
const mantenimientoCtrl = require("../../controllers/Mantenimiento/mantenimientoController");
const authMidd = require("../../middleware/authMidd");

router.post("/", authMidd, mantenimientoCtrl.crearMantenimiento);
router.get("/", authMidd, mantenimientoCtrl.obtenerMantenimientos);
router.get("/:id", authMidd, mantenimientoCtrl.obtenerMantenimientoPorId);
router.put("/:id", authMidd, mantenimientoCtrl.actualizarMantenimiento);
router.delete("/:id", authMidd, mantenimientoCtrl.eliminarMantenimiento);

module.exports = router;