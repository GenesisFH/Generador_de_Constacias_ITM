$(document).ready(function () {
  // Por defecto, mostrar solo la sección de Usuarios al cargar la página
  $("#sec-constancias").hide();

  // Al hacer clic en el enlace de Usuarios o Constancias, alternar entre secciones
  $(".nav-link").click(function (event) {
    event.preventDefault();
    $("#sec-usuarios").toggle();
    $("#sec-constancias").toggle();
  });

  // Función para cargar usuarios desde el servidor
  function cargarUsuarios() {
    $.ajax({
      url: "/users",  // URL de la ruta para obtener los usuarios
      method: "GET",
      dataType: "json",
      success: function (data) {
        const tbody = $("#usuarios-table tbody");
        tbody.empty(); // Limpiar la tabla antes de agregar datos

        // Recorrer los usuarios obtenidos y agregarlos a la tabla
        data.forEach((user) => {
          const tr = $("<tr>");
          tr.append($("<td>").text(user.idusuario));
          tr.append($("<td>").text(user.nombre));
          tr.append($("<td>").text(user.email));
          tr.append($("<td>").text(user.usertype));
          tr.append(
            $("<td>").html(
              `<button class="btn btn-warning" onclick="editarUsuario(${user.idusuario})">Editar</button>
               <button class="btn btn-danger" onclick="eliminarUsuario(${user.idusuario})">Eliminar</button>`
            )
          );
          tbody.append(tr);
        });
      },
      error: function (error) {
        console.error("Error al obtener los usuarios:", error);
      },
    });
  }

  // Función para agregar un nuevo usuario
  window.agregarUsuario = function () {
    const nombre = prompt("Ingrese el nombre del nuevo usuario:");
    const email = prompt("Ingrese el correo del nuevo usuario:");
    const usertype = prompt("Ingrese el tipo de usuario:");
    const password = prompt("Ingrese la contraseña del nuevo usuario:");

    if (!nombre || !email || !usertype || !password) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    $.ajax({
      url: "/users",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ nombre, email, usertype, password }),
      success: function () {
        alert("Usuario agregado exitosamente.");
        cargarUsuarios(); // Recargar la tabla de usuarios
      },
      error: function (error) {
        console.error("Error al agregar el usuario:", error);
      },
    });
  };

  // Función para editar un usuario existente
  window.editarUsuario = function (id) {
    const nombre = prompt("Ingrese el nuevo nombre del usuario (déjelo en blanco para no cambiar):");
    const email = prompt("Ingrese el nuevo correo del usuario (déjelo en blanco para no cambiar):");
    const usertype = prompt("Ingrese el nuevo tipo de usuario (déjelo en blanco para no cambiar):");
    const password = prompt("Ingrese la nueva contraseña (déjelo en blanco para no cambiar):");
  
    // Creamos un objeto vacío que solo llenaremos con los valores introducidos
    const data = {};
    
    // Solo añadimos los valores al objeto si el campo no está vacío
    if (nombre) {
      data.nombre = nombre;
    }
    if (email) {
      data.email = email;
    }
    if (usertype) {
      data.usertype = usertype;
    }
    if (password) {
      data.password = password;
    }
  
    // Si el objeto data sigue vacío, significa que no se cambiaron campos
    if (Object.keys(data).length === 0) {
      alert("No se ha realizado ningún cambio.");
      return;
    }
  
    $.ajax({
      url: `/users/${id}`,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function () {
        alert("Usuario actualizado exitosamente.");
        cargarUsuarios(); // Recargar la tabla de usuarios
      },
      error: function (error) {
        console.error("Error al actualizar el usuario:", error);
      },
    });
  };
  

  // Función para eliminar un usuario existente
  window.eliminarUsuario = function (id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    $.ajax({
      url: `/users/${id}`,
      method: "DELETE",
      success: function () {
        alert("Usuario eliminado exitosamente.");
        cargarUsuarios(); // Recargar la tabla de usuarios
      },
      error: function (error) {
        console.error("Error al eliminar el usuario:", error);
      },
    });
  };

  // Cargar usuarios al cargar la página
  cargarUsuarios();
});
