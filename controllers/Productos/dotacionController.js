const Productos = require("../../models/Productos/dotacion");

// Obtener todos los productos de dotación
exports.obtenerProductosDotacionHome = async (req, res) => {
  try {
    const productos = await Productos.find();
    res.json({ productos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener productos" });
  }
};

// Obtener productos por id de categoría
exports.obtenerListaDeProductosPorCategoriaId = async (req, res) => {
  const { id } = req.params;

  try {
    const productos = await Productos.find().where("categoriaId").equals(id);
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener productos por categoría" });
  }
};

// Obtener un producto por su ID
exports.obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Productos.findById(id);

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el producto" });
  }
};

// Crear un nuevo producto de dotación
exports.crearProductosDotacion = async (req, res) => {
  const {
    referencia,
    nombre,
    talla,
    descripcion,
    stock,
    precio,
    imagen,
    estado,
    categoriaId,
  } = req.body;

  // Validar solo lo que es realmente obligatorio según el modelo
  if (!referencia || !nombre || !talla || !imagen || !categoriaId) {
    return res.status(400).json({
      msg: "Los campos referencia, nombre, talla, imagen y categoriaId son obligatorios",
    });
  }

  try {
    const producto = new Productos({
      referencia,
      nombre,
      talla,
      descripcion,
      stock,
      precio,
      imagen,
      estado,
      categoriaId,
    });

    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear el producto" });
  }
};

// Actualizar un producto de dotación
exports.actualizarProductosDotacion = async (req, res) => {
  const { id } = req.params;
  const { categoriaId } = req.body;

  try {
    const producto = await Productos.findById(id);

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    if (categoriaId && categoriaId !== producto.categoriaId.toString()) {
      return res.status(400).json({ msg: "El ID de la categoría no coincide" });
    }

    // Actualizar campos (con ?? para permitir 0 en stock/precio)
    producto.referencia = req.body.referencia ?? producto.referencia;
    producto.nombre = req.body.nombre ?? producto.nombre;
    producto.talla = req.body.talla ?? producto.talla;
    producto.descripcion = req.body.descripcion ?? producto.descripcion;
    producto.stock = req.body.stock ?? producto.stock;
    producto.precio = req.body.precio ?? producto.precio;
    producto.imagen = req.body.imagen ?? producto.imagen;
    producto.estado = req.body.estado ?? producto.estado;

    await producto.save();
    res.json({ producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar el producto" });
  }
};

// Borrar un producto de dotación
exports.borrarProductosDotacion = async (req, res) => {
  try {
    const resultado = await Productos.deleteOne({ _id: req.params.id });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar el producto" });
  }
};
