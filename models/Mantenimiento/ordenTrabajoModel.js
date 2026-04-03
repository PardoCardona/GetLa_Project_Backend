const mongoose = require("mongoose");

const ordenTrabajoSchema = new mongoose.Schema(
  {
    mantenimientoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mantenimiento",
      required: true,
    },

    checklist: [
      {
        item: {
          type: String,
          trim: true,
        },
        estado: {
          type: String,
          enum: ["pendiente", "ok", "reparar"],
          default: "pendiente",
        },
      },
    ],

    repuestos: [
      {
        productoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductosRepuestos",
        },
        cantidad: {
          type: Number,
          default: 1,
        },
        precio: {
          type: Number,
          default: 0,
        },
      },
    ],

    observaciones: {
      type: String,
      trim: true,
    },

    firmaTecnico: {
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

module.exports = mongoose.model("OrdenTrabajo", ordenTrabajoSchema);