const Usuario = require("../models/Usuarios");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================================================
// Crear usuario (registro público o desde el admin)
// ======================================================
exports.crearUsuario = async (req, res) => {
  console.log("USUARIO DESDE TOKEN:", req.usuario);

  try {
    let { password, email } = req.body;

    // Normalizar email
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

    // Guardar usuario
    const usuarioAlmacenado = await usuario.save();

    // Eliminar password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuarioAlmacenado.toObject();

    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al crear usuario" });
  }
};

// ======================================================
// LOGIN DE USUARIO (JWT)
// ======================================================
exports.loginUsuario = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Normalizar email
    email = email.toLowerCase();

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "Usuario no existe" });
    }

    // Verificar password
    const passwordCorrecto = await bcryptjs.compare(password, usuario.password);

    if (!passwordCorrecto) {
      return res.status(400).json({ msg: "Password incorrecto" });
    }

    // Payload para JWT
    const payload = {
      usuario: {
        id: usuario._id,
        rol: usuario.rol,
      },
    };

    // Firmar token
    jwt.sign(
      payload,
      process.env.SECRETA,
      { expiresIn: "8h" },
      (error, token) => {
        if (error) throw error;

        res.json({
          token,
          usuario: {
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
          },
        });
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al iniciar sesión" });
  }
};

// ======================================================
// Obtener usuarios (solo admin)
// ======================================================
exports.obtenerUsuarioHome = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password");
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
    const datosActualizar = { ...req.body };

    // Encriptar password si se envía
    if (datosActualizar.password) {
      datosActualizar.password = await bcryptjs.hash(
        datosActualizar.password,
        10,
      );
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      datosActualizar,
      { new: true },
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
