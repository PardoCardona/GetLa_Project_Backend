const OrdenTrabajo = require("../../models/Mantenimiento/ordenTrabajoModel");
const Mantenimiento = require("../../models/Mantenimiento/mantenimientoModel");

exports.crearOrden = async (req, res) => {
  try {
    const {
      mantenimientoId,
      checklist,
      repuestos,
      observaciones,
      firmaTecnico,
    } = req.body;

    console.log("BODY RECIBIDO:", req.body);
    console.log("REQ.USUARIO:", req.usuario);

    if (!mantenimientoId) {
      return res.status(400).json({ msg: "mantenimientoId es obligatorio" });
    }

    const queryMantenimiento = {
      _id: mantenimientoId,
      isActive: true,
    };

    if (req.usuario?.empresaId) {
      queryMantenimiento.empresaId = req.usuario.empresaId;
    }

    console.log("QUERY MANTENIMIENTO:", queryMantenimiento);

    const mantenimiento = await Mantenimiento.findOne(queryMantenimiento);

    console.log("MANTENIMIENTO ENCONTRADO:", mantenimiento);

    if (!mantenimiento) {
      return res.status(404).json({ msg: "El mantenimiento no existe" });
    }

    const ordenExistente = await OrdenTrabajo.findOne({
      mantenimientoId,
      empresaId: mantenimiento.empresaId,
      isActive: true,
    });

    if (ordenExistente) {
      return res.status(400).json({
        msg: "Ya existe una orden activa para este mantenimiento",
      });
    }

    const orden = new OrdenTrabajo({
      mantenimientoId,
      checklist: checklist || [],
      repuestos: repuestos || [],
      observaciones,
      firmaTecnico,
      empresaId: mantenimiento.empresaId,
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

    if (req.usuario?.empresaId) {
      query.empresaId = req.usuario.empresaId;
    }

    const orden = await OrdenTrabajo.findOne(query)
      .populate("repuestos.productoId")
      .populate("mantenimientoId");

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

    if (req.usuario?.empresaId) {
      query.empresaId = req.usuario.empresaId;
    }

    const datosActualizar = { ...req.body };
    delete datosActualizar.empresaId;
    delete datosActualizar.mantenimientoId;

    const orden = await OrdenTrabajo.findOneAndUpdate(
      query,
      datosActualizar,
      { new: true, runValidators: true }
    );

    if (!orden) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

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

    if (req.usuario?.empresaId) {
      query.empresaId = req.usuario.empresaId;
    }

    const orden = await OrdenTrabajo.findOneAndUpdate(
      query,
      { isActive: false },
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