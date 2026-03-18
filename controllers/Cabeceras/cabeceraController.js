const Cabecera = require("../../models/Cabeceras/cabeceraM");

// Obtener todas las cabeceras
exports.listarCabecera = async (req, res) => {
  try {
    const cabeceras = await Cabecera.find({});
    res.status(200).json(cabeceras);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar las cabeceras" });
  }
};

// Buscar una cabecera por NIT
exports.buscarCabeceraPorNit = async (req, res) => {
  try {
    const { nit } = req.params;
    const cabecera = await Cabecera.findOne({ nit });

    if (!cabecera) {
      return res.status(404).json({ msg: "Cabecera no encontrada" });
    }

    res.status(200).json(cabecera);
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar la cabecera" });
  }
};

// Buscar una cabecera para generar factura
exports.listarCabeceraPersonalizado = async (req, res) => {
  const cabeceraFactura = await Cabecera.find({}).select("_id local direccion");
  return res.status(200).json(cabeceraFactura);
};

/// Crear una nueva cabecera
// Crear una nueva cabecera validando NIT único
exports.crearCabecera = async (req, res) => {
  try {
    const { nit } = req.body;

    // Validar si el NIT ya existe
    const existeCabecera = await Cabecera.findOne({ nit });
    if (existeCabecera) {
      return res
        .status(400)
        .json({ msg: "El NIT ingresado ya está en uso en otra cabecera." });
    }

    // Crear la cabecera con los datos recibidos y el usuario autenticado
    const cabecera = new Cabecera({
      ...req.body,
      creador: req.usuario.id,
    });

    await cabecera.save();
    res.status(201).json({ msg: "Cabecera creada correctamente", cabecera });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno al crear la cabecera" });
  }
};

// Actualizar una cabecera
exports.actualizarCabecera = async (req, res) => {
  try {
    const { id } = req.params;
    const { local, nit, direccion, telefono, email } = req.body;

    // Verificar campos obligatorios
    if (!local || !nit || !direccion || !telefono || !email) {
      return res
        .status(400)
        .json({ msg: "Todos los campos son obligatorios." });
    }

    // Verificar que el NIT no esté en uso por otra cabecera
    const nitExistente = await Cabecera.findOne({ nit, _id: { $ne: id } });
    if (nitExistente) {
      return res
        .status(400)
        .json({ msg: "El NIT ingresado ya pertenece a otra cabecera." });
    }

    // Actualizar la cabecera
    const cabeceraActualizada = await Cabecera.findByIdAndUpdate(
      id,
      { local, nit, direccion, telefono, email },
      { new: true }
    );

    if (!cabeceraActualizada) {
      return res.status(404).json({ msg: "Cabecera no encontrada." });
    }

    res.status(200).json({
      msg: "Cabecera actualizada correctamente",
      cabecera: cabeceraActualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar la cabecera" });
  }
};

// Eliminar una cabecera
exports.eliminarCabecera = async (req, res) => {
  try {
    const { id } = req.params;
    const cabecera = await Cabecera.findByIdAndDelete(id);

    if (!cabecera) {
      return res.status(404).json({ msg: "Cabecera no encontrada" });
    }

    res.status(200).json({ msg: "Cabecera eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar la cabecera" });
  }
};
