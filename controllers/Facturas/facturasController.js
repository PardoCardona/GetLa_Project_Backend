const Factura = require("../../models/Facturas/facturasM");
const CuerpoFactura = require("../../models/cuerpoFacturas/cuerpoF");
const Productos = require("../../models/Productos/repuestos");
const Clientes = require("../../models/Clientes/clientesM");
const { v4: uuidv4 } = require("uuid");

// Crear Factura usando los valores calculados del frontend, sin sesiones
exports.ingresarFactura = async (req, res) => {
  try {
    const { cabecera, cliente, productos, subtotal, descuento, iva, total } =
      req.body;

    // Log de los productos recibidos
    console.log("Recibido productos:", productos);

    // 1. Buscar/crear cliente
    let clienteDoc = null;
    if (typeof cliente === "string") {
      clienteDoc = await Clientes.findById(cliente);
      if (!clienteDoc) {
        return res
          .status(400)
          .json({ ok: false, msg: "Cliente no encontrado" });
      }
    } else {
      clienteDoc = await Clientes.findOneAndUpdate(
        { nit: cliente.nit },
        cliente,
        { new: true, upsert: true }
      );
    }

    // 2. Crear detalles/cuerpo y descontar stock
    let cuerposGuardados = [];

    // Recorre todos los productos correctamente
    for (let i = 0; i < productos.length; i++) {
      const p = productos[i];
      // Log para cada producto
      console.log(`Procesando producto[${i}]`, p);

      const producto = await Productos.findById(p.producto);
      if (!producto) {
        console.log(`No se encontró producto con ID: ${p.producto}`);
        return res.status(400).json({
          ok: false,
          msg: `Producto no encontrado (${p.descripcion || p.producto})`,
        });
      }

      if (producto.stock < p.cantidad) {
        console.log(
          `Stock insuficiente para ${producto.nombre} (${producto._id}): tiene ${producto.stock}, se intenta vender ${p.cantidad}`
        );
        return res.status(400).json({
          ok: false,
          msg: `Stock insuficiente para el producto ${producto.nombre}`,
        });
      }

      // Descontar stock
      producto.stock -= p.cantidad;
      await producto.save();

      // Log después de guardar el producto
      console.log(
        `Stock actualizado para ${producto.nombre} (${producto._id}): ahora ${producto.stock}`
      );

      // Guardar detalle (usa los datos que vienen del frontend)
      const detalle = await new CuerpoFactura({
        producto: p.producto,
        descripcionProducto: p.descripcion || producto.nombre,
        cantidadProducto: p.cantidad,
        precioProducto: producto.precio,
        descuentoProducto: p.descuento || 0,
        iva: p.iva || 0, // ✔ coincide con el campo `iva` del schema
        subtotal: p.subtotal,
        total: p.total,
      }).save();

      cuerposGuardados.push(detalle._id);
    }

    // 3. Crear factura principal usando los datos calculados en el frontend
    const factura = await new Factura({
      cabecera,
      numeroFactura: uuidv4(),
      cliente: clienteDoc._id,
      cuerpo: cuerposGuardados,
      subtotal,
      descuento,
      iva,
      total,
    }).save();

    // Log final de éxito
    console.log(
      `Factura creada con ${productos.length} productos. Factura: ${factura.numeroFactura}`
    );

    res.status(201).json({ ok: true, factura });
  } catch (error) {
    console.error("Error en ingresarFactura:", error);
    res.status(400).json({ ok: false, msg: error.message });
  }
};

// Listar todas las facturas
exports.listarFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find({})
      .sort({ createdAt: -1 })
      .populate("cabecera", "local nit direccion telefono email")
      .populate("cliente", "_id nombre nit direccion ciudad telefono")
      .populate({
        path: "cuerpo",
        populate: { path: "producto", select: "_id referencia precio" },
      });
    return res.status(200).json(facturas);
  } catch (e) {
    return res.status(500).json({ msg: "Error al listar facturas" });
  }
};

// Listar una factura específica
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
      return res.status(404).json({ msg: "Factura no encontrada" });
    }
    return res.status(200).json(factura);
  } catch (e) {
    return res.status(500).json({ msg: "Error al obtener la factura" });
  }
};

// Actualizar factura (solo cabecera y cliente, no productos ni stock)
exports.actualizarFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const { cabecera, cliente } = req.body;
    const factura = await Factura.findById(id);
    if (!factura) {
      return res.status(404).json({ msg: "Factura no encontrada" });
    }
    factura.cabecera = cabecera || factura.cabecera;
    factura.cliente = cliente || factura.cliente;
    await factura.save();
    return res.status(200).json({ msg: "Factura actualizada correctamente" });
  } catch (e) {
    return res.status(500).json({ msg: "Error al actualizar la factura" });
  }
};

// Eliminar factura (y restablecer stock), sin sesión ni transacción
exports.eliminarFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await Factura.findById(id);
    if (!factura) {
      return res.status(404).json({ msg: "Factura no encontrada" });
    }
    // Restablecer stock de cada producto
    const detalles = await CuerpoFactura.find({ _id: { $in: factura.cuerpo } });
    for (const detalle of detalles) {
      const producto = await Productos.findById(detalle.producto);
      if (producto) {
        producto.stock += detalle.cantidadProducto;
        await producto.save();
      }
    }
    // Eliminar detalles
    await CuerpoFactura.deleteMany({ _id: { $in: factura.cuerpo } });
    // Eliminar factura
    await factura.deleteOne();

    return res.status(200).json({ msg: "Factura eliminada correctamente" });
  } catch (e) {
    return res.status(500).json({ msg: "Error al eliminar la factura" });
  }
};
