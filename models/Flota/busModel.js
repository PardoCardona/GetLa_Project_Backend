//const models = require (../..Flota/busModel.js)
const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    numeroInterno: {
      type: String,
      required: true,
      trim: true,
    },
    placa: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    marca: String,
    modelo: String,
    anio: Number,

    estado: {
      type: String,
      enum: ["activo", "en_taller", "fuera_servicio"],
      default: "activo",
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

module.exports = mongoose.model("Bus", busSchema);