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
      type: mongoose.Decimal128,
      required: true,
    },

    total: {
      type: mongoose.Decimal128,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Factura", FacturaSchema);
