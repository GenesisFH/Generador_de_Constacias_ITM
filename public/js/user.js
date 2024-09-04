$(document).ready(function () {
    // Por defecto, mostrar solo la sección de Usuarios al cargar la página
    $("#sec-constancias").hide();

    // Al hacer clic en el enlace de Productos, ocultar Usuarios y mostrar Productos
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
    // Cargar usuarios al cargar la página
    cargarUsuarios();
  });