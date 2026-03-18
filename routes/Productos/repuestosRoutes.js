const express = require("express");
const router = express.Router();
const authMidd = require("../../middleware/authMidd");
const soloAdmin = require("../../middleware/soloAdmin");

// 👇 IMPORTAR EL CONTROLLER CORRECTAMENTE
const {
  obtenerProductosRepuestosHome,
  obtenerListaDeProductosPorCategoriaId,
  obtenerProductoPorId,
  crearProductosRepuestos,
  actualizarProductosRepuestos,
  borrarProductosRepuestos,
} = require("../../controllers/Productos/repuestosController");

// ============================================
// OBTENER TODOS LOS PRODUCTOS (opcional)
// ============================================
router.get("/", authMidd, obtenerProductosRepuestosHome);

// ============================================
// OBTENER PRODUCTOS POR CATEGORÍA
// ============================================
router.get("/categoria/:id", authMidd, obtenerListaDeProductosPorCategoriaId);

// ============================================
// OBTENER PRODUCTO POR ID
// ============================================
router.get("/:id", authMidd, obtenerProductoPorId);

// ============================================
// CREAR PRODUCTO
// ============================================
router.post("/", authMidd, soloAdmin, crearProductosRepuestos);

// ============================================
// ACTUALIZAR PRODUCTO
// ============================================
router.put("/:id", authMidd, soloAdmin, actualizarProductosRepuestos);

// ============================================
// ELIMINAR PRODUCTO
// ============================================
router.delete("/:id", authMidd, soloAdmin, borrarProductosRepuestos);

module.exports = router;
