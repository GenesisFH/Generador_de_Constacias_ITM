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

app.use('/new-uploads', express.static(uploadDir));

// Configuración de multer para guardar los archivos en la nueva carpeta
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Especifica la carpeta donde se guardará el archivo
  },
  filename: (req, file, cb) => {
    const originalName = req.body.nombreArchivo || file.originalname; // Usa el nombre del archivo proporcionado por el usuario o el nombre original
    cb(null, originalName); // Usa el nombre proporcionado por el usuario
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
app.post("/upload", (req, res) => {
  const uploadSingle = upload.single("file");
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Error al subir el archivo" });
    }
    return res.json({ message: "Subida exitosa", filePath: req.file.path });
  });
});

// Ruta para obtener la lista de archivos PDF
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

// Ruta para eliminar múltiples archivos
app.post("/delete-pdfs", (req, res) => {
  const { ids } = req.body; // ids debería ser una lista de nombres de archivos
  
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No se proporcionaron archivos para eliminar" });
  }

  const deletePromises = ids.map(filename => {
    const filePath = path.join(uploadDir, filename);
    return fs.promises.unlink(filePath).catch(err => {
      console.error(`Error al eliminar el archivo ${filename}:`, err);
    });
  });

  Promise.all(deletePromises)
    .then(() => res.json({ message: "Archivos eliminados exitosamente" }))
    .catch(err => res.status(500).json({ message: "Error al eliminar archivos" }));
});



// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Usar las rutas definidas en index-routes.js
const indexRoutes = require("../src/routes/index-routes");
app.use("/", indexRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
