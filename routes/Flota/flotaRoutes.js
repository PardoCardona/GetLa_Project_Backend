const express = require("express");
const router = express.Router();
const busCtrl = require("../../controllers/Flota/busController");
const authMidd = require("../../middleware/authMidd");

router.post("/", authMidd, busCtrl.crearBus);
router.get("/", authMidd, busCtrl.obtenerBuses);
router.get("/:id", authMidd, busCtrl.obtenerBusPorId);
router.put("/:id", authMidd, busCtrl.actualizarBus);
router.delete("/:id", authMidd, busCtrl.eliminarBus);

module.exports = router;