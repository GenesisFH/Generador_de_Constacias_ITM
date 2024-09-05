const path = require("path");
const connection = require("../database"); // Asegúrate de poner la ruta correcta

const controller = {};

// Método para redirigir a la página de inicio de sesión
controller.index = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/auth/login.html"));
};

controller.constancias = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/constancias.html"));
};

// Método para servir la página de administración de usuarios
controller.administrar = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/crudUsuarios.html"));
};

controller.review = (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/reviewConstancias.html"));
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
        res.redirect("/main");
      } else {
        // Credenciales inválidas
        res.status(401).send("Email o contraseña incorrectos");
      }
    }
  );
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

// Método para agregar un usuario a la base de datos
controller.addUser = (req, res) => {
  const { nombre, email, usertype, password } = req.body;

  if (!nombre || !email || !usertype || !password) {
    res.status(400).send("Por favor complete todos los campos.");
    return;
  }

  const sql =
    "INSERT INTO users (nombre, email, usertype, password) VALUES (?, ?, ?, ?)";
  connection.query(sql, [nombre, email, usertype, password], (err, results) => {
    if (err) {
      console.error("Error al agregar el usuario:", err);
      res.status(500).send("Error en el servidor");
      return;
    }

    res.send("Usuario agregado exitosamente");
  });
};

// Método para actualizar un usuario en la base de datos
controller.updateUser = (req, res) => {
  const { id } = req.params;
  const { nombre, email, usertype, password } = req.body;

  // Array para almacenar las partes de la consulta que vamos a construir dinámicamente
  const fieldsToUpdate = [];
  const values = [];

  // Solo agregamos los campos que fueron proporcionados
  if (nombre) {
    fieldsToUpdate.push("nombre = ?");
    values.push(nombre);
  }
  if (email) {
    fieldsToUpdate.push("email = ?");
    values.push(email);
  }
  if (usertype) {
    fieldsToUpdate.push("usertype = ?");
    values.push(usertype);
  }
  if (password) {
    fieldsToUpdate.push("password = ?");
    values.push(password);
  }

  // Si no se proporcionó ningún campo para actualizar
  if (fieldsToUpdate.length === 0) {
    return res
      .status(400)
      .send("No se ha proporcionado ningún campo para actualizar");
  }

  // Agregamos el id del usuario al final de los valores a pasar en la consulta
  values.push(id);

  // Creamos la consulta dinámica
  const sql = `UPDATE users SET ${fieldsToUpdate.join(
    ", "
  )} WHERE idusuario = ?`;

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error al actualizar el usuario:", err);
      res.status(500).send("Error en el servidor");
      return;
    }

    res.send("Usuario actualizado exitosamente");
  });
};

// Método para eliminar un usuario de la base de datos
controller.deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE idusuario = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error al eliminar el usuario:", err);
      res.status(500).send("Error en el servidor");
      return;
    }

    res.send("Usuario eliminado exitosamente");
  });
};

module.exports = controller;
