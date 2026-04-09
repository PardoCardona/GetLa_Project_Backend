const OrdenTrabajo = require("../../models/Mantenimiento/ordenTrabajoModel");
const Mantenimiento = require("../../models/Mantenimiento/mantenimientoModel");
const ProductosRepuestos = require("../../models/Productos/repuestos");

const procesarRepuestos = async (repuestos = [], usuarioId) => {
  const repuestosProcesados = [];

  for (const rep of repuestos) {
    if (!rep.productoId) {
      throw new Error("Cada repuesto debe tener productoId");
    }

    if (!rep.cantidad || rep.cantidad <= 0) {
      throw new Error("La cantidad de cada repuesto debe ser mayor a 0");
    }

    const producto = await ProductosRepuestos.findById(rep.productoId);

    if (!producto) {
      throw new Error(`El repuesto con id ${rep.productoId} no existe`);
    }

    const precioUnitario = rep.precio ?? producto.precio ?? 0;

    repuestosProcesados.push({
      productoId: producto._id,
      nombreProducto: producto.nombre || "",
      referenciaProducto: producto.referencia || "",
      cantidad: rep.cantidad,
      precio: precioUnitario,
      subtotal: Number(precioUnitario) * Number(rep.cantidad),
      entregadoPor: usuarioId || null,
      recibidoPor: rep.recibidoPor || null,
      fechaEntrega: rep.fechaEntrega || new Date(),
    });
  }

  return repuestosProcesados;
};

exports.crearOrden = async (req, res) => {
  try {
    const {
      mantenimientoId,
      checklist,
      repuestos,
      observaciones,
      firmaTecnico,
      estado,
    } = req.body;

    if (!mantenimientoId) {
      return res.status(400).json({ msg: "mantenimientoId es obligatorio" });
    }

    const queryMantenimiento = {
      _id: mantenimientoId,
      isActive: true,
    };

    
    const mantenimiento = await Mantenimiento.findOne(queryMantenimiento);

    if (!mantenimiento) {
      return res.status(404).json({ msg: "El mantenimiento no existe" });
    }

    const ordenExistente = await OrdenTrabajo.findOne({
      mantenimientoId,
      //empresaId: mantenimiento.empresaId,
      isActive: true,
    });

    if (ordenExistente) {
      return res.status(400).json({
        msg: "Ya existe una orden activa para este mantenimiento",
      });
    }

    const repuestosProcesados = await procesarRepuestos(
      repuestos || [],
      req.usuario?.id
    );

    const orden = new OrdenTrabajo({
      mantenimientoId,
      estado: estado || "abierta",
      checklist: checklist || [],
      repuestos: repuestosProcesados,
      observaciones,
      firmaTecnico,
      //empresaId: mantenimiento.empresaId,
      isActive: true,
    });

    await orden.save();

    res.status(201).json(orden);
  } catch (error) {
    console.error("ERROR CREAR ORDEN:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerOrdenPorMantenimiento = async (req, res) => {
  try {
    const query = {
      mantenimientoId: req.params.mantenimientoId,
      isActive: true,
    };

    

    const orden = await OrdenTrabajo.findOne(query)
      .populate("mantenimientoId")
      .populate("repuestos.productoId")
      .populate("repuestos.entregadoPor", "nombre email rol")
      .populate("repuestos.recibidoPor", "nombre email rol");

    if (!orden) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

    res.json(orden);
  } catch (error) {
    console.error("ERROR OBTENER ORDEN:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarOrden = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
      isActive: true,
    };

    

    const ordenActual = await OrdenTrabajo.findOne(query);

    if (!ordenActual) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

    const datosActualizar = {};

    if (req.body.checklist) {
      datosActualizar.checklist = req.body.checklist;
    }

    if (req.body.observaciones !== undefined) {
      datosActualizar.observaciones = req.body.observaciones;
    }

    if (req.body.firmaTecnico !== undefined) {
      datosActualizar.firmaTecnico = req.body.firmaTecnico;
    }

    if (req.body.estado) {
      datosActualizar.estado = req.body.estado;
    }

    if (req.body.repuestos) {
      datosActualizar.repuestos = await procesarRepuestos(
        req.body.repuestos,
        req.usuario?.id
      );
    }

    const orden = await OrdenTrabajo.findOneAndUpdate(query, datosActualizar, {
      new: true,
      runValidators: true,
    })
      .populate("mantenimientoId")
      .populate("repuestos.productoId")
      .populate("repuestos.entregadoPor", "nombre email rol")
      .populate("repuestos.recibidoPor", "nombre email rol");

    res.json(orden);
  } catch (error) {
    console.error("ERROR ACTUALIZAR ORDEN:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarOrden = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
      isActive: true,
    };

   

    const orden = await OrdenTrabajo.findOneAndUpdate(
      query,
      {
        isActive: false,
        estado: "anulada",
      },
      { new: true }
    );

    if (!orden) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

    res.json({ msg: "Orden eliminada correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR ORDEN:", error);
    res.status(500).json({ error: error.message });
  }
};