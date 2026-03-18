const express = require("express");
const router = express.Router();
const authMidd = require("../../middleware/authMidd");
const soloAdmin = require("../../middleware/soloAdmin");

const aseoController = require("../../controllers/Productos/aseoController");

router.get(
  "/",
  authMidd,
  soloAdmin,
  aseoController.obtenerProductosAseoHome
);

router.get(
  "/porcategoria/:id",
  authMidd,
  soloAdmin,
  aseoController.obtenerListaDeProductosPorCategoriaId
);

router.get(
  "/:id",
  authMidd,
  soloAdmin,
  aseoController.obtenerProductoPorId
);

router.post(
  "/",
  authMidd,
  aseoController.crearProductosAseo
);

router.put(
  "/:id",
  authMidd,
  soloAdmin,
  aseoController.actualizarProductosAseo
);

router.delete(
  "/:id",
  authMidd,
  soloAdmin,
  aseoController.borrarProductosAseo
);

module.exports = router;
  