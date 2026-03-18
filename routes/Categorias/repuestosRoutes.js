const express = require("express");
const router = express.Router();
const authMidd = require("../../middleware/authMidd");
const soloAdmin = require("../../middleware/soloAdmin");

const categoriasRepuestosController = require("../../controllers/Categorias/repuestosController");

router.get(
  "/",
  authMidd,
  soloAdmin,
  categoriasRepuestosController.obtenerCategoriaRepuestos
);

router.get(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasRepuestosController.obtenerCategoriaRepuestosId
);

router.post(
  "/",
  authMidd,
  categoriasRepuestosController.crearCategoriaRepuestos
);

router.put(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasRepuestosController.actualizarCategoriaRepuestos
);

router.delete(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasRepuestosController.borrarCategoriaRepuestos
);

module.exports = router;
