//const models = require (../..Flota/busModel.js)
const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    imagen: {
      type: String,
      required: true,
      trim: true,
      
    },

    numeroInterno: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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

    

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bus", busSchema);
