const express = require("express");
const router = express.Router();
const authMidd = require("../../middleware/authMidd");
const soloAdmin = require("../../middleware/soloAdmin");
const categoriasAseoController = require("../../controllers/Categorias/aseoController");

router.get(
  "/",
  authMidd,
  soloAdmin,
  categoriasAseoController.obtenerCategoriaAseo
);

router.get(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasAseoController.obtenerCategoriaAseoId
);

router.post(
  "/",
  authMidd,
  categoriasAseoController.crearCategoriaAseo
);

router.put(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasAseoController.actualizarCategoriaAseo
);

router.delete(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasAseoController.borrarCategoriaAseo
);

module.exports = router;
