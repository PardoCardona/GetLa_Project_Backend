const soloAdmin = (req, res, next) => {
  // 1. Validar autenticación
  if (!req.usuario) {
    return res.status(401).json({ msg: "No autenticado" });
  }

  // 2. Normalizar rol
  const rol = (req.usuario.rol || "").toLowerCase();

  // 3. Definir roles con permisos de administrador REAL
  const rolesAdmin = [
    "admin",
    "adminrep",
    "admindot",
    "adminlimp",
    "adminmant",
    "adminregular"
  ];

  // 4. Validar si el rol tiene permisos de admin
  if (!rolesAdmin.includes(rol)) {
    return res.status(403).json({
      msg: "Acceso denegado. Solo administradores.",
    });
  }

  // 5. Acceso permitido
  next();
};

module.exports = soloAdmin;