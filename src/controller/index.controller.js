const path = require("path");
const connection = require("../database"); // Asegúrate de poner la ruta correcta

const controller = {};

// Método para redirigir a la página de inicio de sesión
controller.index = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/auth/login.html"));
};

// Método para manejar el inicio de sesión
controller.login = (req, res) => {
  const { email, password } = req.body;

  // Consultar la base de datos para verificar las credenciales
  connection.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error("Error al verificar las credenciales:", err);
        res.status(500).send("Error en el servidor");
        return;
      }

      if (results.length > 0) {
        // Credenciales válidas, establecer el estado de la sesión
        req.session.loggedIn = true;
        req.session.user = results[0]; // Puedes guardar información del usuario aquí
        
        // Verificar el tipo de usuario
        const userType = results[0].userType;

        if (userType === 0) {
          // Redirigir a una página específica si usertype es 0
          res.redirect("/home_usuario"); 
        } else if (userType === 1) {
          // Redirigir a la página de administrador
          res.redirect("/main");
        } 
      } else {
        // Credenciales inválidas
        res.status(401).send("Email o contraseña incorrectos");
      }
    }
  );
};

controller.constancias = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/constancias.html"));
};

// Método para servir la página de administración de usuarios
controller.administrar = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/crudUsuarios.html"));
};

// Método para obtener los usuarios de la base de datos y enviarlos como JSON
controller.getUsers = (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios:", err);
      res.status(500).send("Error en el servidor");
      return;
    }

    res.json(results); // Devolver los usuarios como JSON
  });
};

module.exports = controller;
