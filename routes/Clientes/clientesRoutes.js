const express = require("express");
const router = express.Router();
const authMidd = require("../../middleware/authMidd");
const clienteController = require("../../controllers/Clientes/clientesController");

// ==============================
// LISTAR CLIENTES
// ==============================
router.get("/", authMidd, clienteController.listarClientes);

// ==============================
// BUSCAR CLIENTES POR NOMBRE O NIT
// ==============================
router.get("/buscar", authMidd, clienteController.buscarClientes);

// ==============================
// BUSCAR CLIENTE POR NIT
// ==============================
router.get(
  "/buscar/nit/:identificacion",
  authMidd,
  clienteController.listarClientePorIdentificacion
);

// ==============================
// CREAR CLIENTE
// ==============================
router.post("/", authMidd, clienteController.ingresarCliente);

// ==============================
// ACTUALIZAR CLIENTE
// ==============================
router.put("/:id", authMidd, clienteController.actualizarCliente);

// ==============================
// ELIMINAR CLIENTE
// ==============================
router.delete("/:id", authMidd, clienteController.eliminarCliente);

// ==============================
// INCREMENTAR COMPRAS
// ==============================
router.put(
  "/incrementar-compra/:id",
  authMidd,
  clienteController.incrementarNumeroCompras
);

module.exports = router;