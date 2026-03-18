const express = require("express");
const router = express.Router();
const authMidd = require("../../middleware/authMidd");
const soloAdmin = require("../../middleware/soloAdmin");

// 👇 IMPORTAR EL CONTROLLER CORRECTAMENTE
const {
  obtenerProductosDotacionHome,
  obtenerListaDeProductosPorCategoriaId,
  obtenerProductoPorId,
  crearProductosDotacion,
  actualizarProductosDotacion,
  borrarProductosDotacion,
} = require("../../controllers/Productos/dotacionController");

router.get("/", authMidd, soloAdmin, obtenerProductosDotacionHome);

router.get(
  "/porcategoria/:id",
  authMidd,
  soloAdmin,
  obtenerListaDeProductosPorCategoriaId
);

router.get("/:id", authMidd, soloAdmin, obtenerProductoPorId);

router.post("/", authMidd, crearProductosDotacion);

router.put("/:id", authMidd, soloAdmin, actualizarProductosDotacion);

router.delete("/:id", authMidd, soloAdmin, borrarProductosDotacion);

module.exports = router;
