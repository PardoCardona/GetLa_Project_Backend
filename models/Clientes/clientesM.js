const mongoose = require("mongoose");

const ClientesSchema = mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  nit: { type: String, required: true, trim: true, unique: true },
  direccion: { type: String, required: true, trim: true },
  ciudad: { type: String, required: true, trim: true },
  telefono: { type: String, required: true, trim: true },
  numeroCompras: { type: Number, default: 0 },
  creador: { type: mongoose.Schema.Types.ObjectId, ref: "Usuarios" },
  creado: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Clientes", ClientesSchema);
