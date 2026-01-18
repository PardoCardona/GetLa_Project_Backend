const Usuario = require("../models/Usuarios");
const bcryptjs = require("bcryptjs");

// ======================================================
// Crear usuario (registro público o desde el admin)
// ======================================================
exports.crearUsuario = async (req, res) => {
  try {
    let { password, email } = req.body;

    // Normalizar email (evita errores por mayúsculas)
    email = email.toLowerCase();
    req.body.email = email;

    // Verificar si el usuario ya existe
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    // Crear nuevo usuario
    usuario = new Usuario(req.body);

    // Encriptar contraseña
    usuario.password = await bcryptjs.hash(password, 10);

    // Guardar usuario en BD
    const usuarioAlmacenado = await usuario.save();

    // Eliminar password del objeto a enviar
    const { password: _, ...usuarioSinPassword } = usuarioAlmacenado.toObject();

    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al crear usuario" });
  }
};

// ======================================================
// Obtener usuarios (solo admin)
// ======================================================
exports.obtenerUsuarioHome = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password");
    // select("-password") quita el password de la respuesta

    res.json({ usuarios });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

// ======================================================
// Actualizar usuario
// ======================================================
exports.actualizarUsuario = async (req, res) => {
  try {
    const id = req.params.id;

    // Datos enviados
    const datosActualizar = { ...req.body };

    // Si se envía password, encriptarla
    if (datosActualizar.password) {
      datosActualizar.password = await bcryptjs.hash(
        datosActualizar.password,
        10
      );
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      datosActualizar,
      { new: true }
    ).select("-password");

    if (!usuarioActualizado) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al actualizar usuario" });
  }
};

// ======================================================
// Obtener usuario por ID
// ======================================================
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await Usuario.findById(id).select("-password");

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener el usuario" });
  }
};

// ======================================================
// Borrar usuario
// ======================================================
exports.borrarUsuario = async (req, res) => {
  try {
    const id = req.params.id;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    await Usuario.findByIdAndDelete(id);

    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
};
