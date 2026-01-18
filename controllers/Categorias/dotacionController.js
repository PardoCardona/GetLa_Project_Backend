const CategoriasDotacion = require("../../models/Categorias/Dotacion")

// Obtener todas las categorías 

exports.obtenerCategoriaDotacion = async (req, res) => {
  try {
    const categorias = await CategoriasDotacion.find().sort({ creado: -1 });

    res.json({ categorias });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener las categorías" });
  }
};


// Obtener categoría por ID 

exports.obtenerCategoriaDotacionId = async (req, res) => {
  try {
    const id = req.params.id;

    const categoria = await CategoriasDotacion.findById(id);

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener la categoría" });
  }
};


// Crear nueva categoría 

exports.crearCategoriaDotacion = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Validar duplicados
    let existe = await CategoriasDotacion.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ msg: "Ya existe una categoría con ese nombre" });
    }

    const categoria = new CategoriasDotacion({
      ...req.body,
      creador: req.usuario.id // el admin creador
    });

    const guardado = await categoria.save();

    res.status(201).json(guardado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al crear la categoría" });
  }
};


// Actualizar categoría 

exports.actualizarCategoriaDotacion = async (req, res) => {
  try {
    const id = req.params.id;

    let categoria = await CategoriasDotacion.findById(id);

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    // Actualizar
    categoria = await CategoriasDotacion.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(categoria);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al actualizar la categoría" });
  }
};

// Borrar categoría 

exports.borrarCategoriaDotacion = async (req, res) => {
  try {
    const id = req.params.id;

    let categoria = await CategoriasDotacion.findById(id);

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    await CategoriasDotacion.findByIdAndDelete(id);

    res.json({ msg: "Categoría eliminada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al eliminar la categoría" });
  }
};
