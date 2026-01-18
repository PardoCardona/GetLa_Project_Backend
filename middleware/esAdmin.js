module.exports = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ msg: "No autenticado" });
  }

  if (req.usuario.rol !== "ADMIN") {
    return res.status(403).json({ msg: "No tienes permisos de administrador" });
  }

  next();
};
