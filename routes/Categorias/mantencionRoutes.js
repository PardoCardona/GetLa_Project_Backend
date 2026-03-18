const express = require("express");
const router = express.Router();
const authMidd = require("../../middleware/authMidd");
const soloAdmin = require("../../middleware/soloAdmin");
const categoriasMantencionController = require("../../controllers/Categorias/mantencionController");

router.get(
  "/",
  authMidd,
  soloAdmin,
  categoriasMantencionController.obtenerCategoriaMantencion
);

router.get(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasMantencionController.obtenerCategoriaMantencionId
);

router.post(
  "/",
  authMidd,
  categoriasMantencionController.crearCategoriaMantencion
);

router.put(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasMantencionController.actualizarCategoriaMantencion
);

router.delete(
  "/:id",
  authMidd,
  soloAdmin,
  categoriasMantencionController.borrarCategoriaMantencion
);

module.exports = router;
