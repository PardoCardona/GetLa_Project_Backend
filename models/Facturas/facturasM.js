const mongoose = require("mongoose");

const FacturaSchema = mongoose.Schema(
  {
    cabecera: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cabecera",
      required: true,
    },

    numeroFactura: {
      type: String,
      required: true,
      unique: true,
    },

    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clientes",
      required: true,
    },

    cuerpo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CuerpoFactura",
      },
    ],

    subtotal: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },

    descuento: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },

    iva: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },

    total: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },

    // 👤 Usuario que creó la factura
    usuarioCreador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
    },

    nombreUsuario: {
      type: String,
    },

    rolUsuario: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Factura", FacturaSchema);