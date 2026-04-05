const mongoose = require("mongoose");

const mantenimientoSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    tipo: {
      type: String,
      enum: ["preventivo", "correctivo"],
      required: true,
    },

    fechaIngreso: {
      type: Date,
      default: Date.now,
    },

    fechaSalida: {
      type: Date,
    },

    kilometraje: {
      type: Number,
      default: 0,
    },

    descripcion: {
      type: String,
      trim: true,
    },

    estado: {
      type: String,
      enum: ["abierto", "en_proceso", "cerrado", "anulado"],
      default: "abierto",
    },

    tecnicoResponsable: {
      type: String,
      trim: true,
    },

    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empresa",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mantenimiento", mantenimientoSchema);