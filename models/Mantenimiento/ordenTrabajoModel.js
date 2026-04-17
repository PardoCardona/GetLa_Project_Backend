const mongoose = require("mongoose");

const ordenTrabajoSchema = new mongoose.Schema(
  {
    mantenimientoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mantenimiento",
      required: true,
    },

    estado: {
      type: String,
      enum: ["abierta", "en_proceso", "finalizada", "anulada"],
      default: "abierta",
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
          required: true,
        },
        nombreProducto: {
          type: String,
          trim: true,
        },
        referenciaProducto: {
          type: String,
          trim: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        precio: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
        subtotal: {
          type: Number,
          min: 0,
          default: 0,
        },
        entregadoPor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Usuarios",
        },
        recibidoPor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Usuarios",
        },
        fechaEntrega: {
          type: Date,
          default: Date.now,
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

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("OrdenTrabajo", ordenTrabajoSchema);
