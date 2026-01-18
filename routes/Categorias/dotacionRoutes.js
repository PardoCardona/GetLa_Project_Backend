const express = require("express");
const router = express.Router();
const authMidd = require("../../middleware/authMidd");
const soloAdmin = require("../../middleware/soloAdmin");
const categoriasDotacionController = require("../../controllers/Categorias/dotacionController");

router.get(
  "/",
  authMidd,
  soloAdmin,
  categoriasDotacionController.obtenerCategoriaDotacion
);

router.get(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasDotacionController.obtenerCategoriaDotacionId
);

router.post(
  "/",
  authMidd,
  categoriasDotacionController.crearCategoriaDotacion
);

router.put(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasDotacionController.actualizarCategoriaDotacion
);

router.delete(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasDotacionController.borrarCategoriaDotacion
);

module.exports = router;
