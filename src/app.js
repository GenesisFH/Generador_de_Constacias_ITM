const express = require("express");
const path = require("path");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs"); // Librería para manejar el sistema de archivos
const app = express();
const port = 3000;

// Importar la conexión a la base de datos
const connection = require("./database");

// Define el nombre de la nueva carpeta donde se guardarán los archivos
const newFolderName = "new-uploads"; // Cambia "new-uploads" por el nombre deseado o usa una lógica dinámica
const uploadDir = path.join(__dirname, newFolderName);

// Verifica si la carpeta existe; si no, la crea
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // { recursive: true } permite crear subdirectorios si es necesario
}

// Configuración de multer para guardar los archivos en la nueva carpeta
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Especifica la carpeta donde se guardará el archivo
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Nombre único para evitar colisiones*/
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Validar solo archivos PDF
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Solo se permiten archivos PDF"));
    }
    cb(null, true);
  },
});

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "12345",
    resave: false,
    saveUninitialized: true,
  })
);

// Ruta para subir el archivo
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Error al subir el archivo" });
  }
  return res.json({ message: "Subida exitosa", filePath: req.file.path });
});

app.get("/pdfs", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer la carpeta" });
    }

    const pdfFiles = files
      .filter(file => path.extname(file) === '.pdf')
      .map(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          url: `/new-uploads/${file}`,
          date: stats.mtime.toLocaleDateString() // Fecha de modificación
        };
      });

    res.json(pdfFiles);
  });
});



// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Usar las rutas definidas en index-routes.js
const indexRoutes = require("../src/routes/index-routes");
app.use("/", indexRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
