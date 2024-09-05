const express = require("express");
const router = express.Router();
const path = require("path");
const controller = require("../controller/index.controller");
const authMiddleware = require("../middlewares/authmiddleware");

// Ruta para login
router.get("/", controller.index);

router.get("/login", controller.index);

// Ruta protegida para la página de constancias
router.get("/constancias", authMiddleware, controller.constancias);

// Ruta protegida para administrar (CRUD de usuarios)
router.get("/administrar", authMiddleware, controller.administrar);

// Ruta para obtener usuarios (usada por el CRUD de usuarios)
router.get("/users", authMiddleware, controller.getUsers);

router.get("/review", authMiddleware, controller.review);

// Ruta protegida para la página principal después de iniciar sesión
router.get("/main", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/main.html"));
});

// Ruta para manejar el inicio de sesión usando el controlador
router.post("/login", controller.login);

// *** Nuevas rutas para agregar, editar y eliminar usuarios ***

// Ruta para agregar un usuario
router.post("/users", authMiddleware, controller.addUser);

// Ruta para actualizar un usuario
router.put("/users/:id", authMiddleware, controller.updateUser);

// Ruta para eliminar un usuario
router.delete("/users/:id", authMiddleware, controller.deleteUser);

module.exports = router;
