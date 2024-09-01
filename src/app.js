const express = require("express");
const path = require("path");
const session = require("express-session"); 
const app = express();
const port = 3000;

// Importar la conexión a la base de datos
const connection = require("./database"); 

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar express-session
app.use(session({
  secret: '12345', 
  resave: false,
  saveUninitialized: true,
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Usar las rutas definidas en index-routes.js
const indexRoutes = require("../src/routes/index-routes");
app.use("/", indexRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
