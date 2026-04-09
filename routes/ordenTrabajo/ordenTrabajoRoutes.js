const express = require("express");
const router = express.Router();
const ordenCtrl = require("../../controllers/Mantenimiento/ordenTrabajoController");
const authMidd = require("../../middleware/authMidd");

router.post("/", authMidd, ordenCtrl.crearOrden);
router.get("/:mantenimientoId", authMidd, ordenCtrl.obtenerOrdenPorMantenimiento);
router.put("/:id", authMidd, ordenCtrl.actualizarOrden);
router.delete("/:id", authMidd, ordenCtrl.eliminarOrden);

module.exports = router;