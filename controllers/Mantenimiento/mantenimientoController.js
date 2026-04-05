const Mantenimiento = require("../../models/Mantenimiento/mantenimientoModel");
const Bus = require("../../models/Flota/busModel");

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
      return res.status(400).json({
        msg: "busId y tipo son obligatorios",
      });
    }

    const bus = await Bus.findOne({
      _id: busId,
      isActive: true,
    });

    if (!bus) {
      return res.status(404).json({
        msg: "El bus no existe",
      });
    }

    if (bus.estado === "en_taller") {
      return res.status(400).json({
        msg: "El bus ya tiene un mantenimiento en curso",
      });
    }

    const mantenimiento = new Mantenimiento({
      busId,
      tipo,
      fechaIngreso: fechaIngreso || new Date(),
      kilometraje: kilometraje || 0,
      descripcion,
      tecnicoResponsable,
      empresaId: bus.empresaId,
      isActive: true,
    });

    await mantenimiento.save();

    await Bus.findByIdAndUpdate(busId, {
      estado: "en_taller",
    });

    res.status(201).json(mantenimiento);
  } catch (error) {
    console.error("ERROR CREAR MANTENIMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerMantenimientos = async (req, res) => {
  try {
    const { busId } = req.query;

    const query = {
      isActive: true,
    };

    if (req.usuario?.empresaId) {
      query.empresaId = req.usuario.empresaId;
    }

    if (busId) {
      query.busId = busId;
    }

    const mantenimientos = await Mantenimiento.find(query)
      .populate("busId")
      .sort({ createdAt: -1 });

    res.json(mantenimientos);
  } catch (error) {
    console.error("ERROR OBTENER MANTENIMIENTOS:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerMantenimientoPorId = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
      isActive: true,
    };

    if (req.usuario?.empresaId) {
      query.empresaId = req.usuario.empresaId;
    }

    const mantenimiento = await Mantenimiento.findOne(query).populate("busId");

    if (!mantenimiento) {
      return res.status(404).json({
        msg: "Mantenimiento no encontrado",
      });
    }

    res.json(mantenimiento);
  } catch (error) {
    console.error("ERROR OBTENER MANTENIMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarMantenimiento = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
      isActive: true,
    };

    if (req.usuario?.empresaId) {
      query.empresaId = req.usuario.empresaId;
    }

    const mantenimiento = await Mantenimiento.findOneAndUpdate(
      query,
      req.body,
      { new: true, runValidators: true }
    );

    if (!mantenimiento) {
      return res.status(404).json({
        msg: "Mantenimiento no encontrado",
      });
    }

    if (req.body.estado === "cerrado" || req.body.estado === "anulado") {
      await Bus.findByIdAndUpdate(mantenimiento.busId, {
        estado: "activo",
      });
    }

    res.json(mantenimiento);
  } catch (error) {
    console.error("ERROR ACTUALIZAR MANTENIMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarMantenimiento = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
      isActive: true,
    };

    if (req.usuario?.empresaId) {
      query.empresaId = req.usuario.empresaId;
    }

    const mantenimiento = await Mantenimiento.findOneAndUpdate(
      query,
      {
        isActive: false,
        estado: "anulado",
      },
      { new: true }
    );

    if (!mantenimiento) {
      return res.status(404).json({
        msg: "Mantenimiento no encontrado",
      });
    }

    await Bus.findByIdAndUpdate(mantenimiento.busId, {
      estado: "activo",
    });

    res.json({
      msg: "Mantenimiento eliminado correctamente",
    });
  } catch (error) {
    console.error("ERROR ELIMINAR MANTENIMIENTO:", error);
    res.status(500).json({ error: error.message });
  }
};