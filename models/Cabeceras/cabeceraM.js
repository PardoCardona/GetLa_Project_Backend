const mongoose = require("mongoose");

const CabeceraSchema = mongoose.Schema({
  local: { type: String, required: true, trim: true },
  nit: { type: String, required: true, trim: true, unique: true },
  direccion: { type: String, required: true, trim: true },
  telefono: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuarios",
    required: true,
  },
  creado: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cabecera", CabeceraSchema);
