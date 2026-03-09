const Factura = require("../../models/Facturas/facturasM");
const CuerpoFactura = require("../../models/cuerpoFacturas/cuerpoF");
const ProductosRepuestos = require("../../models/Productos/repuestos");
const ProductosAseo = require("../../models/Productos/aseo");
const ProductosDotacion = require("../../models/Productos/dotacion");
const Clientes = require("../../models/Clientes/clientesM");
const { v4: uuidv4 } = require("uuid");

// ===============================
// CREAR FACTURA - VERSION MULTICATEGORIA
// ===============================
// Función para buscar producto en todas las colecciones
const buscarProductoPorId = async (id) => {
  return (
    (await ProductosRepuestos.findById(id)) ||
    (await ProductosAseo.findById(id)) ||
    (await ProductosDotacion.findById(id))
  );
};

exports.ingresarFactura = async (req, res) => {
  try {
    const { cabecera, cliente, productos, subtotal, descuento, iva, total } =
      req.body;

    // --------------------------
    // VALIDACIONES INICIALES
    // --------------------------
    if (!cabecera) {
      return res
        .status(400)
        .json({ ok: false, msg: "Debe seleccionar una sucursal" });
    }

    if (!cliente) {
      return res.status(400).json({ ok: false, msg: "Cliente es obligatorio" });
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res
        .status(400)
        .json({ ok: false, msg: "Debe enviar al menos un producto" });
    }

    if (subtotal == null || total == null) {
      return res
        .status(400)
        .json({ ok: false, msg: "Subtotal y total son obligatorios" });
    }

    // --------------------------
    // 1️⃣ Buscar o crear cliente
    // --------------------------
    let clienteDoc;

    if (typeof cliente === "string") {
      // Cliente pasado por ID
      clienteDoc = await Clientes.findById(cliente);
      if (!clienteDoc) {
        return res
          .status(400)
          .json({ ok: false, msg: "Cliente no encontrado" });
      }
    } else {
      const { nit, nombre, direccion, ciudad, telefono } = cliente;

      // Validar campos obligatorios
      if (!nit || !nombre || !direccion || !ciudad || !telefono) {
        return res.status(400).json({
          ok: false,
          msg: "Todos los campos del cliente son obligatorios (NIT, nombre, dirección, ciudad, teléfono)",
        });
      }

      // Crear o actualizar cliente automáticamente
      try {
        clienteDoc = await Clientes.findOneAndUpdate(
          { nit },
          { nit, nombre, direccion, ciudad, telefono },
          { new: true, upsert: true, runValidators: false },
        );
      } catch (error) {
        console.error("Error al crear o actualizar cliente:", error);
        return res.status(500).json({
          ok: false,
          msg: "Error al ingresar o actualizar el cliente",
          error: error.message,
        });
      }
    }

    // --------------------------
    // 2️⃣ Procesar productos
    // --------------------------
    let cuerposGuardados = [];

    for (let i = 0; i < productos.length; i++) {
      const p = productos[i];

      if (!p.producto) {
        return res.status(400).json({
          ok: false,
          msg: `Producto inválido en posición ${i}`,
        });
      }

      if (!p.cantidad || p.cantidad <= 0) {
        return res.status(400).json({
          ok: false,
          msg: `Cantidad inválida para el producto ${p.descripcion || i}`,
        });
      }

      // Buscar producto en todas las colecciones
      const producto = await buscarProductoPorId(p.producto);
      if (!producto) {
        return res.status(400).json({
          ok: false,
          msg: `Producto no encontrado (${p.descripcion || p.producto})`,
        });
      }

      if (producto.stock < p.cantidad) {
        return res.status(400).json({
          ok: false,
          msg: `Stock insuficiente para ${producto.nombre}`,
        });
      }

      // Descontar stock
      producto.stock -= p.cantidad;
      await producto.save();

      // Crear detalle en CuerpoFactura
      const detalle = await new CuerpoFactura({
        producto: producto._id,
        descripcionProducto: p.descripcion || producto.nombre,
        referenciaProducto: producto.referencia || "",
        cantidadProducto: p.cantidad,
        precioProducto: p.precio || producto.precioVenta || producto.precio,
        descuentoProducto: p.descuento || 0,
        iva: p.iva || 0,
        subtotal: p.subtotal || 0,
        total: p.total || 0,
      }).save();

      cuerposGuardados.push(detalle._id);
    }

    
        // --------------------------
    // 3️⃣ Crear factura
    // --------------------------
const factura = await new Factura({
  cabecera,
  numeroFactura: uuidv4(),
  cliente: clienteDoc._id,
  cuerpo: cuerposGuardados,
  subtotal,
  descuento: descuento || 0,
  iva: iva || 0,
  total,

  // 👤 USUARIO QUE CREÓ LA FACTURA
  usuarioCreador: req.usuario.id,
  nombreUsuario: req.usuario.nombre,
  rolUsuario: req.usuario.rol

}).save();
const facturaPopulada = await Factura.findById(factura._id)
  .select("cabecera cliente cuerpo subtotal descuento iva total numeroFactura nombreUsuario rolUsuario createdAt")
  .populate("cabecera", "local nit direccion telefono email")
  .populate("cliente", "nombre nit direccion ciudad telefono")
  .populate("cuerpo");

    return res.status(201).json({
      ok: true,
      msg: "Factura creada correctamente",
      factura: facturaPopulada, // ✅ Ahora cuerpo tiene los objetos completos
    });
  } catch (error) {
    console.error("Error en ingresarFactura:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

// ===============================
// LISTAR TODAS
// ===============================
exports.listarFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find({})
      .populate("cabecera", "local nit direccion telefono email")
      .populate("cliente", "nombre nit direccion ciudad telefono")
      .populate("cuerpo");
    return res.status(200).json({ ok: true, facturas });
  } catch (e) {
    return res.status(500).json({ ok: false, msg: "Error al listar facturas" });
  }
};

// ===============================
// LISTAR UNA
// ===============================
exports.listarFactura = async (req, res) => {
  try {
    const { id } = req.params;

    const factura = await Factura.findById(id)
      .populate("cabecera", "local nit direccion telefono email")
      .populate("cliente", "_id nombre nit direccion ciudad telefono")
      .populate({
        path: "cuerpo",
        populate: { path: "producto", select: "_id referencia precio" },
      });

    if (!factura) {
      return res.status(404).json({ ok: false, msg: "Factura no encontrada" });
    }

    return res.status(200).json({ ok: true, factura });
  } catch (e) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al obtener la factura" });
  }
};

// ===============================
// ACTUALIZAR
// ===============================
exports.actualizarFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const { cabecera, cliente } = req.body;

    const factura = await Factura.findById(id);

    if (!factura) {
      return res.status(404).json({ ok: false, msg: "Factura no encontrada" });
    }

    if (cabecera) factura.cabecera = cabecera;
    if (cliente) factura.cliente = cliente;

    await factura.save();

    return res
      .status(200)
      .json({ ok: true, msg: "Factura actualizada correctamente" });
  } catch (e) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al actualizar la factura" });
  }
};

// ===============================
// ELIMINAR
// ===============================
exports.eliminarFactura = async (req, res) => {
  try {
    const { id } = req.params;

    const factura = await Factura.findById(id);

    if (!factura) {
      return res.status(404).json({ ok: false, msg: "Factura no encontrada" });
    }

    const detalles = await CuerpoFactura.find({
      _id: { $in: factura.cuerpo },
    });

    for (const detalle of detalles) {
      const producto = await Productos.findById(detalle.producto);
      if (producto) {
        producto.stock += detalle.cantidadProducto;
        await producto.save();
      }
    }

    await CuerpoFactura.deleteMany({
      _id: { $in: factura.cuerpo },
    });

    await factura.deleteOne();

    return res
      .status(200)
      .json({ ok: true, msg: "Factura eliminada correctamente" });
  } catch (e) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al eliminar la factura" });
  }
};
