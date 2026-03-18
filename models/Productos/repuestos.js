const mongoose = require("mongoose");

const ProductosRepuestosSchema = mongoose.Schema(
  {
    referencia: { type: String, required: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    stock: { type: Number, default: 0 },
    precio: { type: Number, default: 0 },
    imagen: { type: String, required: true, trim: true },
    estado: {
      type: String,
      enum: ["OK", "DEFECTUOSO", "REPARACIÓN", "AGOTADO", "PENDIENTE"],
      default: "OK",
    },
    categoriaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoriasRepuestos", // ✅ CORREGIDO
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductosRepuestos", ProductosRepuestosSchema);
