const soloAdmin = (req, res, next) => {
  // 1. Validar autenticación
  if (!req.usuario) {
    return res.status(401).json({ msg: "No autenticado" });
  }

  // 2. Normalizar rol
  const rol = req.usuario.rol.toLowerCase();

  // 3. Permitir cualquier admin (admin, adminrep, adminmant, etc.)
  if (!rol.startsWith("admin")) {
    return res
      .status(403)
      .json({ msg: "Acceso denegado. Solo administradores." });
  }

  // 4. Todo OK
  next();
};

module.exports = soloAdmin;
