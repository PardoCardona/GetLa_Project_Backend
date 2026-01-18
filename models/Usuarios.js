const mongoose = require("mongoose");

const UsuariosSchema = new mongoose.Schema(
  {
    imagen: { type: String, required: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    cargo: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    rol: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
  },
  {
    timestamps: true, // ⬅ CREA AUTOMÁTICAMENTE createdAt y updatedAt
  }
);

module.exports = mongoose.model("Usuarios", UsuariosSchema);
