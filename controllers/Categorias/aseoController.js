const CategoriaAseo = require("../../models/Categorias/Aseo")

// Obtener todas las categorías 

exports.obtenerCategoriaAseo = async (req, res) => {
  try {
    const categorias = await CategoriaAseo.find().sort({ creado: -1 });

    res.json({ categorias });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener las categorías" });
  }
};


// Obtener categoría por ID 

exports.obtenerCategoriaAseoId = async (req, res) => {
  try {
    const id = req.params.id;

    const categoria = await CategoriaAseo.findById(id);

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

exports.crearCategoriaAseo = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Validar duplicados
    let existe = await CategoriaAseo.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ msg: "Ya existe una categoría con ese nombre" });
    }

    const categoria = new CategoriaAseo({
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

exports.actualizarCategoriaAseo = async (req, res) => {
  try {
    const id = req.params.id;

    let categoria = await CategoriaAseo.findById(id);

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    // Actualizar
    categoria = await CategoriaAseo.findByIdAndUpdate(
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

exports.borrarCategoriaAseo = async (req, res) => {
  try {
    const id = req.params.id;

    let categoria = await CategoriaAseo.findById(id);

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    await CategoriaAseo.findByIdAndDelete(id);

    res.json({ msg: "Categoría eliminada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al eliminar la categoría" });
  }
};
