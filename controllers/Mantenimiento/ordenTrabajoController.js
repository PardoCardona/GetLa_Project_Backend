const mongoose = require("mongoose");
const OrdenTrabajo = require("../../models/Mantenimiento/ordenTrabajoModel");
const Mantenimiento = require("../../models/Mantenimiento/mantenimientoModel");
const ProductosRepuestos = require("../../models/Productos/repuestos");
const Bus = require("../../models/Flota/busModel");

// ─────────────────────────────────────────
// PROCESAR REPUESTOS
// ─────────────────────────────────────────
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

// ─────────────────────────────────────────
// CREAR ORDEN
// ─────────────────────────────────────────
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

    const mantenimiento = await Mantenimiento.findOne({
      _id: mantenimientoId,
      isActive: true,
    });

    if (!mantenimiento) {
      return res.status(404).json({ msg: "El mantenimiento no existe" });
    }

    const ordenExistente = await OrdenTrabajo.findOne({
      mantenimientoId,
      isActive: true,
    });

    if (ordenExistente) {
      return res.status(400).json({
        msg: "Ya existe una orden activa para este mantenimiento",
      });
    }

    const repuestosProcesados = await procesarRepuestos(
      repuestos || [],
      req.usuario?.id,
    );

    const orden = new OrdenTrabajo({
      mantenimientoId,
      estado: estado || "abierta",
      checklist: checklist || [],
      repuestos: repuestosProcesados,
      observaciones,
      firmaTecnico,
      isActive: true,
    });

    await orden.save();

    res.status(201).json(orden);
  } catch (error) {
    console.error("ERROR CREAR ORDEN:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────
// OBTENER ORDEN
// ─────────────────────────────────────────
exports.obtenerOrdenPorMantenimiento = async (req, res) => {
  try {
    const orden = await OrdenTrabajo.findOne({
      mantenimientoId: req.params.mantenimientoId,
      isActive: true,
    })
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

// ─────────────────────────────────────────
// ACTUALIZAR ORDEN
// ─────────────────────────────────────────
exports.actualizarOrden = async (req, res) => {
  try {
    const ordenActual = await OrdenTrabajo.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!ordenActual) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

    if (ordenActual.estado === "finalizada") {
      return res.status(400).json({
        msg: "No se puede modificar una orden finalizada",
      });
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
        req.usuario?.id,
      );
    }

    const orden = await OrdenTrabajo.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      datosActualizar,
      { new: true, runValidators: true },
    )
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

// ─────────────────────────────────────────
// 🔥 CERRAR ORDEN (PRO)
// ─────────────────────────────────────────
exports.cerrarOrden = async (req, res) => {
  try {
    const { id } = req.params;

    const orden = await OrdenTrabajo.findById(id);

    if (!orden) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

    // 1️⃣ Cerrar orden
    orden.estado = "finalizada";
    await orden.save();

    // 2️⃣ Obtener mantenimiento
    const mantenimiento = await Mantenimiento.findById(orden.mantenimientoId);

    if (!mantenimiento) {
      return res.status(404).json({ msg: "Mantenimiento no encontrado" });
    }

    // 3️⃣ Cerrar mantenimiento
    mantenimiento.estado = "cerrado";
    mantenimiento.fechaSalida = new Date();
    await mantenimiento.save();

    // 4️⃣ Activar bus (FIX IMPORTANTE)
    const busId = mantenimiento.busId?._id || mantenimiento.busId;

    if (busId) {
      await Bus.findByIdAndUpdate(busId, {
        estado: "activo",
      });
    }

    // DEBUG (puedes borrar después)
    console.log("✔ Orden cerrada:", orden._id);
    console.log("✔ Mantenimiento cerrado:", mantenimiento._id);
    console.log("✔ Bus activado:", busId);

    res.json({
      msg: "Orden cerrada, mantenimiento cerrado y bus activado",
    });
  } catch (error) {
    console.error("ERROR CERRAR ORDEN:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────
// ELIMINAR ORDEN
// ─────────────────────────────────────────
exports.eliminarOrden = async (req, res) => {
  try {
    const orden = await OrdenTrabajo.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      {
        isActive: false,
        estado: "anulada",
      },
      { new: true },
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
