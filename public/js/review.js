$(document).ready(function() {
    $.get("/pdfs", function(data) {
      const $tableBody = $("#constancia-table tbody");
      $tableBody.empty(); // Limpia la tabla antes de agregar nuevos datos
  
      data.forEach(pdf => {
        $tableBody.append(`
          <tr>
            <td>${pdf.name}</td>
            <td><a href="${pdf.url}" target="_blank">Ver PDF</a></td>
            <td>${pdf.date}</td>
          </tr>
        `);
      });
    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.error("Error al obtener los PDFs:", textStatus, errorThrown);
    });
  });