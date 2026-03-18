const mongoose = require("mongoose");

const CategoriasMantencionSchema = mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    imagen: { type: String, required: true, trim: true },
    creador: { type: mongoose.Schema.Types.ObjectId, ref: "Usuarios" },
    creado: { type: Date, default: Date.now() },
  },
  {
    timestamps: true, // ⬅ CREA AUTOMÁTICAMENTE createdAt y updatedAt
  }
);
//Definir el modelo
module.exports = mongoose.model(
  "CategoriasMantencion",
  CategoriasMantencionSchema
);
