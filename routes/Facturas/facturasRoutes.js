const express = require("express");
const router = express.Router();
const authMidd = require("../../middleware/authMidd");
const facturaController = require("../../controllers/Facturas/facturasController");

// Obtener todas las facturas
router.get("/", authMidd, facturaController.listarFacturas);

// Obtener una factura específica por ID
router.get("/:id", authMidd, facturaController.listarFactura);

// Crear nueva factura (proceso atómico, descuenta stock)
router.post("/", authMidd, facturaController.ingresarFactura);

// Actualizar factura existente
router.put("/:id", authMidd, facturaController.actualizarFactura);

// Eliminar factura (restablece stock de productos)
router.delete("/:id", authMidd, facturaController.eliminarFactura);

module.exports = router;
