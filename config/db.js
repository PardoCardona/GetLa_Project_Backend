const mongoose = require("mongoose");

const conectarDB = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://Cardona:root@cluster0.w5ubywx.mongodb.net/GetLa_db?appName=Cluster0"
      //"mongodb+srv://jcarrietab:Jc7rie4tab@cluster0.uxoyy2r.mongodb.net/getla_db?appName=Cluster0"
    );

    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarDB;
