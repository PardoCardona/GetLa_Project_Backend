const express = require("express");
const router = express.Router();
const authMidd = require("../../middleware/authMidd");
const soloAdmin = require("../../middleware/soloAdmin");
const cabeceraController = require("../../controllers/Cabeceras/cabeceraController");

// Rutas
router.get("/", authMidd, cabeceraController.listarCabecera);

router.get("/:nit", authMidd, cabeceraController.buscarCabeceraPorNit);

router.post("/", authMidd, cabeceraController.crearCabecera);

router.put("/:id", authMidd, cabeceraController.actualizarCabecera);

router.delete("/:id", authMidd, cabeceraController.eliminarCabecera);

module.exports = router;
