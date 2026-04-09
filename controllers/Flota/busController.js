const Bus = require("../../models/Flota/busModel");

exports.crearBus = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json(bus);
  } catch (error) {
    //console.error("ERROR CREAR BUS:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(buses);
  } catch (error) {
    //console.error("ERROR OBTENER BUSES:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerBusPorId = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus || !bus.isActive) {
      return res.status(404).json({ msg: "Bus no encontrado" });
    }

    res.json(bus);
  } catch (error) {
    //console.error("ERROR OBTENER BUS POR ID:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bus) {
      return res.status(404).json({ msg: "Bus no encontrado" });
    }

    res.json(bus);
  } catch (error) {
    //console.error("ERROR ACTUALIZAR BUS:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ msg: "Bus no encontrado" });
    }

    res.json({ msg: "Bus eliminado correctamente" });
  } catch (error) {
    //console.error("ERROR ELIMINAR BUS:", error);
    res.status(500).json({ error: error.message });
  }
};