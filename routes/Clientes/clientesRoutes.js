const express = require("express");
const router = express.Router();
const authMidd = require("../../middleware/authMidd");
const clienteController = require("../../controllers/Clientes/clientesController");

// Rutas
router.get("/", authMidd, clienteController.listarClientes); // Lista todos los clientes
router.get(
  "/buscar/nit/:identificacion",
  authMidd,
  clienteController.listarClientePorIdentificacion
); // Lista un cliente por NIT
router.post("/", authMidd, clienteController.ingresarCliente); // Crear o actualizar un cliente
router.put("/:id", authMidd, clienteController.actualizarCliente); // Editar cliente
router.delete("/:id", authMidd, clienteController.eliminarCliente); // Eliminar cliente

// Ruta para incrementar el número de compras de un cliente
router.put(
  "/incrementar-compra/:id",
  authMidd,
  clienteController.incrementarNumeroCompras
);

module.exports = router;
