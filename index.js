const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

// Importación de rutas
const usuarioRoutes = require("./routes/usuarioRoutes");
const auth = require("./routes/auth");
const repuestosRoutes = require("./routes/Categorias/repuestosRoutes");
const mantencionRoutes = require("./routes/Categorias/mantencionRoutes");
const dotacionRoutes = require("./routes/Categorias/dotacionRoutes");
const aseoRoutes = require("./routes/Categorias/aseoRoutes.js");
const producAseoRoutes = require("./routes/Productos/aseoRoutes.js");
const producsDotacionRoutes = require("./routes/Productos/dotacionRoutes.js");
const producRepuestosRoutes = require("./routes/Productos/repuestosRoutes.js");
const cabeceraRoutes = require("./routes/Cabeceras/cabeceraRoutes.js");
const clientesRouters = require("./routes/Clientes/clientesRoutes.js");
const facturaRouters = require("./routes/Facturas/facturasRoutes.js");

const app = express();

// Middleware
app.use(express.json({ extended: true }));
//Habilitar CORS
app.use(cors());

//Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", auth);
app.use("/api/repuestos", repuestosRoutes);
app.use("/api/mantencion", mantencionRoutes);
app.use("/api/dotacion", dotacionRoutes);
app.use("/api/aseo", aseoRoutes);
app.use("/api/productos-aseo", producAseoRoutes);
app.use("/api/productos-dotacion", producsDotacionRoutes);
app.use("/api/productos-repuestos", producRepuestosRoutes);
app.use("/api/cabecera", cabeceraRoutes);
app.use("/api/clientes", clientesRouters);
app.use("/api/factura", facturaRouters);

// Conectar a la base de datos
conectarDB();
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
