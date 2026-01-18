const express = require("express");
const router = express.Router();
const authMidd = require("../middleware/authMidd");
const soloAdmin = require("../middleware/soloAdmin");
const usuarioController = require("../controllers/usuariosController");

// Obtener todos
router.get("/", authMidd, soloAdmin, usuarioController.obtenerUsuarioHome);

// 🔥 Nuevo → Obtener usuario por ID
router.get("/:id", authMidd, soloAdmin, usuarioController.obtenerUsuarioPorId);

router.post("/", authMidd, soloAdmin, usuarioController.crearUsuario);
router.put("/:id", authMidd, soloAdmin, usuarioController.actualizarUsuario);
router.delete("/:id", authMidd, soloAdmin, usuarioController.borrarUsuario);

module.exports = router;
