const Mantenimiento = require("../models/Mantenimiento/mantenimientoModel");
const Bus = require("../models/Flota/busModel");

const cerrarMantenimiento = async (mantenimientoId) => {
  const mantenimiento = await Mantenimiento.findByIdAndUpdate(
    mantenimientoId,
    { estado: "cerrado" },
    { new: true },
  );

  if (!mantenimiento) {
    throw new Error("Mantenimiento no encontrado");
  }

  if (mantenimiento.busId) {
    await Bus.findByIdAndUpdate(mantenimiento.busId, {
      estado: "activo",
    });
  }

  return mantenimiento;
};

module.exports = {
  cerrarMantenimiento,
};
