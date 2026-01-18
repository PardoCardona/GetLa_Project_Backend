const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMidd = require("../middleware/authMidd");

router.post("/", authController.autenticarUsuario);
// Se genero cambio
router.get("/", authMidd, authController.usuarioAutenticado);

module.exports = router;