const express = require("express");
const router = express.Router();
const path = require("path");
const controller = require("../controller/index.controller");
const authMiddleware = require("../middlewares/authmiddleware");

// Ruta para login
router.get("/", controller.index);

router.get("/login", controller.index);

router.get("/constancias", controller.constancias, authMiddleware);

// Ruta protegida para administrar (CRUD de usuarios)
router.get("/administrar", authMiddleware, controller.administrar);

// Ruta para obtener usuarios (usada por el CRUD de usuarios)
router.get("/users", authMiddleware, controller.getUsers);

router.get("/main", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/main.html"));
});



// Ruta para manejar el inicio de sesión usando el controlador
router.post("/login", controller.login);

module.exports = router;
