const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMidd = require("../middleware/authMidd");

router.post("/", authController.autenticarUsuario);
// Se genero cambio
router.get("/", authMidd, authController.usuarioAutenticado);

//nuevos datos----------------------------------------
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
//----------------------------------------------

module.exports = router;