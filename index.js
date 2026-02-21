console.log("SMTP_USER START:", process.env.SMTP_USER);
require("dotenv").config();

const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json({ extended: true }));

app.use(cors());

// Rutas
app.use("/api/usuarios", require("./routes/usuarioRoutes"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/repuestos", require("./routes/Categorias/repuestosRoutes"));
app.use("/api/mantencion", require("./routes/Categorias/mantencionRoutes"));
app.use("/api/dotacion", require("./routes/Categorias/dotacionRoutes"));
app.use("/api/aseo", require("./routes/Categorias/aseoRoutes.js"));
app.use("/api/productos-aseo", require("./routes/Productos/aseoRoutes.js"));
app.use("/api/productos-dotacion", require("./routes/Productos/dotacionRoutes.js"));
app.use("/api/productos-repuestos", require("./routes/Productos/repuestosRoutes.js"));
app.use("/api/cabecera", require("./routes/Cabeceras/cabeceraRoutes.js"));
app.use("/api/clientes", require("./routes/Clientes/clientesRoutes.js"));
app.use("/api/factura", require("./routes/Facturas/facturasRoutes.js"));

// Conectar DB
conectarDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
