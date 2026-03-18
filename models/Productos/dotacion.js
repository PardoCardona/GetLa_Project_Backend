const mongoose = require("mongoose");

const ProductosDotacionSchema = mongoose.Schema({
  referencia: { type: String, required: true, trim: true },
  nombre: { type: String, required: true, trim: true },
  talla: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  stock: { type: Number, default: 0 },
  precio: { type: Number, default: 0 },
  imagen: { type: String, required: true, trim: true },
  estado: {
    type: String,
    enum: ["OK", "DEFECTUOSO", "REPARACIÓN", "AGOTADO", "PENDIENTE"],
    default: "OK",
  },
  creado: { type: Date, default: Date.now },
  categoriaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categorias",
    required: true,
  },
});

module.exports = mongoose.model("ProductosDotacion", ProductosDotacionSchema);
