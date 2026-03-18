const CategoriaRepuesto = require("../../models/Categorias/Repuesto");
const ProductosRepuestos = require("../../models/Productos/repuestos");

// ============================================
// OBTENER TODAS LAS CATEGORÍAS
// ============================================
exports.obtenerCategoriaRepuestos = async (req, res) => {
  try {
    const categorias = await CategoriaRepuesto.find().sort({ creado: -1 });

    res.json({
      ok: true,
      categorias,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener las categorías de repuestos",
    });
  }
};

// ============================================
// OBTENER CATEGORÍA POR ID
// ============================================
exports.obtenerCategoriaRepuestosId = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await CategoriaRepuesto.findById(id);

    if (!categoria) {
      return res.status(404).json({
        ok: false,
        msg: "Categoría no encontrada",
      });
    }

    res.json({
      ok: true,
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener la categoría",
    });
  }
};

// ============================================
// CREAR CATEGORÍA
// ============================================
exports.crearCategoriaRepuestos = async (req, res) => {
  const { nombre, imagen } = req.body;

  if (!nombre || !imagen) {
    return res.status(400).json({
      ok: false,
      msg: "El nombre y la imagen son obligatorios",
    });
  }

  try {
    const existeCategoria = await CategoriaRepuesto.findOne({
      nombre: nombre.trim(),
    });

    if (existeCategoria) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe una categoría con ese nombre",
      });
    }

    const nuevaCategoria = new CategoriaRepuesto({
      nombre: nombre.trim(),
      imagen: imagen.trim(), // 🔥 CLAVE
      creador: req.usuario.id,
    });

    await nuevaCategoria.save();

    res.status(201).json({
      ok: true,
      msg: "Categoría creada correctamente",
      categoria: nuevaCategoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear la categoría",
    });
  }
};

// ============================================
// ACTUALIZAR CATEGORÍA
// ============================================
exports.actualizarCategoriaRepuestos = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  try {
    const categoria = await CategoriaRepuesto.findById(id);

    if (!categoria) {
      return res.status(404).json({
        ok: false,
        msg: "Categoría no encontrada",
      });
    }

    // Validar nombre duplicado
    if (nombre) {
      const existeNombre = await CategoriaRepuesto.findOne({
        nombre: nombre.trim(),
        _id: { $ne: id },
      });

      if (existeNombre) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe otra categoría con ese nombre",
        });
      }
    }

    const categoriaActualizada = await CategoriaRepuesto.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      ok: true,
      msg: "Categoría actualizada correctamente",
      categoria: categoriaActualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar la categoría",
    });
  }
};

// ============================================
// ELIMINAR CATEGORÍA (VALIDANDO REPUESTOS)
// ============================================
exports.borrarCategoriaRepuestos = async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ Verificar existencia de la categoría
    const categoria = await CategoriaRepuesto.findById(id);

    if (!categoria) {
      return res.status(404).json({
        ok: false,
        msg: "Categoría no encontrada",
      });
    }

    // 2️⃣ Verificar si existen repuestos asociados
    const repuestoAsociado = await ProductosRepuestos.findOne({
      categoriaId: id,
    });

    if (repuestoAsociado) {
      return res.status(400).json({
        ok: false,
        msg: "No se puede eliminar la categoría porque tiene repuestos asociados",
      });
    }

    // 3️⃣ Eliminar categoría
    await CategoriaRepuesto.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Categoría eliminada correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar la categoría",
    });
  }
};
