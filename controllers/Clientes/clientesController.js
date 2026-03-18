const Clientes = require("../../models/Clientes/clientesM");

// ==============================
// Obtener todos los clientes
// ==============================
exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Clientes.find(
      {},
      "nombre nit direccion ciudad telefono numeroCompras"
    );
    return res.status(200).json({ clientes });
  } catch (e) {
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

// ==============================
// Obtener un solo cliente por Identificacion (NIT)
// ==============================
exports.listarClientePorIdentificacion = async (req, res) => {
  const { identificacion } = req.params;

  try {
    const cliente = await Clientes.findOne({ nit: identificacion });

    if (!cliente) {
      return res
        .status(404)
        .json({ msg: "Error, no se encontró este cliente" });
    }

    return res.json(cliente);
  } catch (e) {
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

// ==============================
// Ingresar o actualizar un cliente
// ==============================
exports.ingresarCliente = async (req, res) => {
  const { nombre, nit, direccion, ciudad, telefono } = req.body;

  try {
    let cliente = await Clientes.findOne({ nit });

    if (cliente) {
      // Actualizar cliente existente
      cliente.nombre = nombre || cliente.nombre;
      cliente.direccion = direccion || cliente.direccion;
      cliente.ciudad = ciudad || cliente.ciudad;
      cliente.telefono = telefono || cliente.telefono;

      await cliente.save();

      return res
        .status(200)
        .json({ msg: "Cliente actualizado correctamente", cliente });
    } else {
      // Crear nuevo cliente
      const nuevoCliente = new Clientes({
        nombre,
        nit,
        direccion,
        ciudad,
        telefono,
        creador: req.usuario.id,
      });

      await nuevoCliente.save();

      return res.status(201).json({ cliente: nuevoCliente });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ msg: "Error, no se pudo ingresar o actualizar el cliente" });
  }
};

// ==============================
// Actualizar cliente
// ==============================
exports.actualizarCliente = async (req, res) => {
  const { nombre, nit, direccion, ciudad, telefono } = req.body;

  try {
    let cliente = await Clientes.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    cliente.nombre = nombre || cliente.nombre;
    cliente.nit = nit || cliente.nit;
    cliente.direccion = direccion || cliente.direccion;
    cliente.ciudad = ciudad || cliente.ciudad;
    cliente.telefono = telefono || cliente.telefono;

    await cliente.save();

    return res
      .status(200)
      .json({ msg: "Cliente actualizado correctamente", cliente });
  } catch (e) {
    return res.status(500).json({ msg: "Error al actualizar el cliente" });
  }
};

// ==============================
// Eliminar cliente
// ==============================
exports.eliminarCliente = async (req, res) => {
  try {
    let cliente = await Clientes.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    await Clientes.findByIdAndDelete(req.params.id);

    return res.status(200).json({ msg: "Cliente eliminado correctamente" });
  } catch (e) {
    return res.status(500).json({ msg: "Error al eliminar el cliente" });
  }
};

// ==============================
// Incrementar número de compras
// ==============================
exports.incrementarNumeroCompras = async (req, res) => {
  const { id } = req.params;

  try {
    let cliente = await Clientes.findById(id);

    if (!cliente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    cliente.numeroCompras += 1;

    await cliente.save();

    return res
      .status(200)
      .json({ msg: "Número de compras incrementado", cliente });
  } catch (e) {
    return res
      .status(500)
      .json({ msg: "Error al incrementar el número de compras" });
  }
};

// ==============================
// BUSCAR CLIENTES (AUTOCOMPLETADO)
// ==============================
exports.buscarClientes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.json({ ok: true, clientes: [] });
    }

    const clientes = await Clientes.find({
      $or: [
        { nombre: { $regex: query, $options: "i" } },
        { nit: { $regex: query, $options: "i" } },
      ],
    })
      .select("nombre nit direccion ciudad telefono")
      .limit(10);

    return res.json({
      ok: true,
      clientes,
    });
  } catch (error) {
    console.error("Error al buscar clientes:", error);

    return res.status(500).json({
      ok: false,
      msg: "Error al buscar clientes",
    });
  }
};