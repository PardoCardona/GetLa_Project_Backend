const Mantenimiento = require("../../models/Mantenimiento/mantenimientoModel");
const Bus = require("../../models/Flota/busModel");

// ─────────────────────────────────────────────────────────────────
// CREAR MANTENIMIENTO
// ─────────────────────────────────────────────────────────────────
exports.crearMantenimiento = async (req, res) => {
  try {
    const {
      busId,
      tipo,
      fechaIngreso,
      kilometraje,
      descripcion,
      tecnicoResponsable,
    } = req.body;

    if (!busId || !tipo) {
      return res.status(400).json({ msg: "busId y tipo son obligatorios" });
    }

    // FIX: ya no filtramos por isActive (se eliminó el soft delete en buses)
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ msg: "El bus no existe" });
    }

    if (bus.estado === "en_taller") {
      return res
        .status(400)
        .json({ msg: "El bus ya tiene un mantenimiento en curso" });
    }

    const mantenimiento = new Mantenimiento({
      busId,
      tipo,
      fechaIngreso: fechaIngreso || new Date(),
      kilometraje: kilometraje || 0,
      descripcion,
      tecnicoResponsable,
      isActive: true,
    });

    await mantenimiento.save();

    // Cambiar estado del bus a en_taller
    await Bus.findByIdAndUpdate(busId, { estado: "en_taller" });

    res.status(201).json(mantenimiento);
  } catch (error) {
    console.error("ERROR CREAR MANTENIMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// OBTENER MANTENIMIENTOS (todos o filtrados por busId)
// ─────────────────────────────────────────────────────────────────
exports.obtenerMantenimientos = async (req, res) => {
  try {
    const { busId } = req.query;

    const query = { isActive: true };
    if (busId) query.busId = busId;

    const mantenimientos = await Mantenimiento.find(query)
      .populate("busId")
      .sort({ createdAt: -1 });

    res.json(mantenimientos);
  } catch (error) {
    console.error("ERROR OBTENER MANTENIMIENTOS:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// OBTENER MANTENIMIENTO POR ID
// ─────────────────────────────────────────────────────────────────
exports.obtenerMantenimientoPorId = async (req, res) => {
  try {
    const mantenimiento = await Mantenimiento.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("busId");

    if (!mantenimiento) {
      return res.status(404).json({ msg: "Mantenimiento no encontrado" });
    }

    res.json(mantenimiento);
  } catch (error) {
    console.error("ERROR OBTENER MANTENIMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// ACTUALIZAR MANTENIMIENTO
// ─────────────────────────────────────────────────────────────────
exports.actualizarMantenimiento = async (req, res) => {
  try {
    const mantenimiento = await Mantenimiento.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true, runValidators: true },
    );

    if (!mantenimiento) {
      return res.status(404).json({ msg: "Mantenimiento no encontrado" });
    }

    // FIX: devolver el bus a "activo" cuando el mantenimiento se cierra o anula
    if (req.body.estado === "cerrado" || req.body.estado === "anulado") {
      await Bus.findByIdAndUpdate(mantenimiento.busId, { estado: "activo" });
    }

    res.json(mantenimiento);
  } catch (error) {
    console.error("ERROR ACTUALIZAR MANTENIMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// ELIMINAR MANTENIMIENTO (soft delete — deja historial)
// ─────────────────────────────────────────────────────────────────
exports.eliminarMantenimiento = async (req, res) => {
  try {
    const mantenimiento = await Mantenimiento.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false, estado: "anulado" },
      { new: true },
    );

    if (!mantenimiento) {
      return res.status(404).json({ msg: "Mantenimiento no encontrado" });
    }

    // FIX: se eliminó la referencia a "ordenActual" que no existía y crasheaba el servidor
    // Devolver el bus a "activo" al anular el mantenimiento
    await Bus.findByIdAndUpdate(mantenimiento.busId, { estado: "activo" });

    res.json({ msg: "Mantenimiento eliminado correctamente" });
  } catch (error) {
    console.error("ERROR ELIMINAR MANTENIMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};
