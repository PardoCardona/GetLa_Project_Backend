const Usuario = require("../models/Usuarios");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

//nuevos datos-----------------------
const crypto = require("crypto");
const { sendResetEmail } = require("../utils/mailer"); // lo creamos abajo
//-------------------------------------------------------------------------
exports.autenticarUsuario = async (req, res) => {
  const { password, email } = req.body;
  try {
    // Revisar que sea un usuario registrado
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ msg: "El usuario no existe" });
    }

    // Revisar el password
    const passwordCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passwordCorrecto) {
      return res.status(400).json({ msg: "Password incorrecto" });
    }

    // Si todo es correcto: crear y firmar un token
    const payload = {
      usuario: { id: usuario.id, rol: usuario.rol }, // Agregar rol al payload
    };
    //res.json(payload);
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: "30d", // 30 días
      },
      (error, token) => {
        if (error) throw error;
        // Mensaje de confirmación
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

// Cambio
exports.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({ usuario, rol: usuario.rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

//Datos nuevos-----------------------------------------------------

  exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1) Buscar usuario
    const usuario = await Usuario.findOne({ email: email?.toLowerCase() });

    // Recomendación pro: no revelar si existe o no
    // para evitar "enumeración de emails"
    if (!usuario) {
      return res.json({ msg: "Si el correo existe, te enviaremos un enlace de recuperación." });
    }

    // 2) Crear token crudo (se envía por email)
    const resetTokenRaw = crypto.randomBytes(32).toString("hex");

    // 3) Guardar el HASH del token en BD (no el crudo)
    const resetTokenHashed = crypto.createHash("sha256").update(resetTokenRaw).digest("hex");

    usuario.resetPasswordToken = resetTokenHashed;
    usuario.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await usuario.save();

    // 4) Link (frontend)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetTokenRaw}`;

    // 5) Enviar correo
    await sendResetEmail(usuario.email, resetUrl);

    return res.json({ msg: "Si el correo existe, te enviaremos un enlace de recuperación." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;       // token crudo del link
    const { password } = req.body;      // nueva contraseña

    if (!password || password.length < 5) {
      return res.status(400).json({ msg: "La contraseña debe tener al menos 5 caracteres" });
    }

    // 1) Hashear el token crudo para compararlo con el de la BD
    const tokenHashed = crypto.createHash("sha256").update(token).digest("hex");

    // 2) Buscar usuario con token válido y no expirado
    const usuario = await Usuario.findOne({
      resetPasswordToken: tokenHashed,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!usuario) {
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }

    // 3) Hashear nueva contraseña
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    // 4) Borrar token para que sea de un solo uso
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;

    await usuario.save();

    return res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};
