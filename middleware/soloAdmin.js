// middleware/soloAdmin.js

const soloAdmin = (req, res, next) => {
  // Validamos que exista el usuario en el request (lo coloca authMidd)
  if (!req.usuario || req.usuario.rol !== "admin") {
    return res
      .status(403)
      .json({ msg: "Acceso denegado. Solo administradores." });
  }

  // Si todo está bien, seguimos con la siguiente función (siguiente middleware/controlador)
  next();
};

module.exports = soloAdmin;
