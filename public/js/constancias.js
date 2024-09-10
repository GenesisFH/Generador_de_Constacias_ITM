document.getElementById("constanciaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtén todos los valores del formulario
  const nombres = document.getElementById("nombres").value.toUpperCase();
  const apellidoPaterno = document.getElementById("apellidoPaterno").value.toUpperCase();
  const apellidoMaterno = document.getElementById("apellidoMaterno").value.toUpperCase();
  const codigo = document.getElementById("codigo").value;
  const curso = document.getElementById("curso").value.toUpperCase();
  const periodo = document.getElementById("periodo").value.toUpperCase();
  const fechaTerminacion = document.getElementById("fechaTerminacion").value.toUpperCase();
  const nombreArchivo = document.getElementById("nombreArchivo").value.toUpperCase();
  const horasCurso = document.getElementById("horasCurso").value.toUpperCase(); // Agregado

  // Verifica que todos los campos estén llenos
  if (!nombres || !apellidoPaterno || !apellidoMaterno || !codigo || !curso || !periodo || !fechaTerminacion || !nombreArchivo || !horasCurso) {
    alert("Por favor, llena todos los campos.");
    return;
  }

  const data = {
    nombreCompleto: `${nombres} ${apellidoPaterno} ${apellidoMaterno}`,
    clave: codigo,
    curso: curso,
    periodo: periodo,
    fechaTerminacion: fechaTerminacion,
    nombreArchivo: nombreArchivo,
    horasCurso: horasCurso, // Agregado
  };

  const tipoConstancia = document.getElementById("tipoConstancia").value;
  const templatePath = `/static/pdf/${tipoConstancia}.pdf`; // Ruta ajustada

  try {
    const pdfBytes = await generatePDF(data, tipoConstancia, templatePath);
    download(pdfBytes, `${data.nombreArchivo}.pdf`, "application/pdf");
  } catch (error) {
    console.error("Error al generar PDF:", error);
  }
});

document.getElementById("generateFromExcel").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, selecciona un archivo Excel.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);

      const registros = worksheet.map((row) => ({
        nombreCompleto: (row["NOMBRE DEL PARTICIPANTE"] || "Nombre no especificado").toUpperCase(),
        clave: (row["CLAVE"] || "Clave no especificada").toUpperCase(),
        curso: (row["CURSO"] || "Curso no especificado").toUpperCase(),
        periodo: (row["PERIODO"] || "Periodo no especificado").toUpperCase(),
        fechaTerminacion: (row["FECHA DE TERMINACION"] || "Fecha de terminación no especificada").toUpperCase(),
        horasCurso: (row["HORAS CURSO"] || "Horas no especificadas").toUpperCase(), // Agregado
      }));

      const tipoConstancia = document.getElementById("tipoConstancia").value;
      const templatePath = `/static/pdf/${tipoConstancia}.pdf`; // Ruta ajustada

      const zip = new JSZip();
      for (const registro of registros) {
        // Verifica que todos los campos del registro estén llenos
        if (!registro.nombreCompleto || !registro.clave || !registro.curso || !registro.periodo || !registro.fechaTerminacion || !registro.horasCurso) {
          console.warn("Registro incompleto:", registro);
          continue; // Salta este registro si está incompleto
        }

        const pdfBytes = await generatePDF(registro, tipoConstancia, templatePath);
        zip.file(`${registro.nombreCompleto}.pdf`, pdfBytes);
      }

      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "Constancias_Escolares.zip");
      });
    } catch (error) {
      console.error("Error al procesar el archivo Excel:", error);
    }
  };
  reader.readAsArrayBuffer(file);
});

const coordenadas = {
  tipo1: {
    nombre: { x: 180, y: 410 },
    curso: { x: 180, y: 355 },
    periodo: { x: 156, y: 320 },
    clave: { x: 180, y: 292 },
    fechaTerminacion: { x: 150, y: 260 },
    horasCurso: { x: 150, y: 305 }, // Nueva coordenada para horasCurso
  },
  tipo2: {
    nombre: { x: 200, y: 410 },
    curso: { x: 200, y: 355 },
    periodo: { x: 200, y: 315 },
    clave: { x: 200, y: 272 },
    fechaTerminacion: { x: 200, y: 230 },
    horasCurso: { x: 200, y: 190 }, // Nueva coordenada para horasCurso
  },
  tipo3: {
    nombre: { x: 200, y: 415 },
    curso: { x: 200, y: 336 },
    periodo: { x: 200, y: 298 },
    clave: { x: 200, y: 258 },
    fechaTerminacion: { x: 200, y: 218 },
    horasCurso: { x: 200, y: 178 }, // Nueva coordenada para horasCurso
  },
  tipo4: {
    nombre: { x: 200, y: 410 },
    curso: { x: 200, y: 355 },
    periodo: { x: 200, y: 315 },
    clave: { x: 200, y: 272 },
    fechaTerminacion: { x: 200, y: 230 },
    horasCurso: { x: 200, y: 190 }, // Nueva coordenada para horasCurso
  },
};

async function generatePDF(data, tipoConstancia, templatePath) {
  try {
    const existingPdfBytes = await fetch(templatePath).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const boldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

    const claveText = `CLAVE DEL CURSO: ${data.clave}`;
    const cursoText = `"${data.curso}"`; // Solo el nombre del curso
    const periodoText = `LOS DÍAS DEL ${data.periodo},`;
    const fechaTerminacionText = `MEXICALI, B.C. A ${data.fechaTerminacion}`;
    const horasCursoText = `CON DURACIÓN DE ${data.horasCurso} HORAS`; // Nuevo texto para horasCurso

    // Calcular ajuste en la posición X del nombre
    const nombreCompletoParts = data.nombreCompleto.split(" ");
    let nombreX = coordenadas[tipoConstancia]?.nombre.x || 200;
    if (nombreCompletoParts.length > 3) {
      nombreX -= 50; // Ajustar esta coordenada según sea necesario
    }

    const pageWidth = firstPage.getWidth();
    const fontSize = 14; // Define el tamaño de la fuente

    // Calcular ancho del texto y centrarlo
    const textWidth = boldFont.widthOfTextAtSize(cursoText, fontSize);
    const xCentrado = (pageWidth - textWidth) / 2; // Centrar en la página

    firstPage.drawText(data.nombreCompleto, {
      x: nombreX,
      y: coordenadas[tipoConstancia].nombre.y,
      size: 20,
      font: boldFont, // Aplica negrita en el texto
      color: PDFLib.rgb(0, 0, 0),
    });

    firstPage.drawText(cursoText, {
      x: xCentrado,
      y: coordenadas[tipoConstancia]?.curso.y || 355,
      size: fontSize,
      font: boldFont, // Aplica negrita en el texto
      color: PDFLib.rgb(0, 0, 0),
    });

    firstPage.drawText(periodoText, {
      x: coordenadas[tipoConstancia].periodo.x,
      y: coordenadas[tipoConstancia].periodo.y,
      size: 14,
      color: PDFLib.rgb(0, 0, 0),
    });

    firstPage.drawText(claveText, {
      x: xCentrado,
      y: coordenadas[tipoConstancia].clave.y,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
    });

    firstPage.drawText(fechaTerminacionText, {
      x: xCentrado,
      y: coordenadas[tipoConstancia].fechaTerminacion.y,
      size: 11,
      color: PDFLib.rgb(0, 0, 0),
    });

    firstPage.drawText(horasCursoText, {
      x: xCentrado,
      y: coordenadas[tipoConstancia]?.horasCurso.y || 190,
      size: 14,
      color: PDFLib.rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw error;
  }
}

function download(data, fileName, mimeType) {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  uploadToServer(blob, fileName);
}
// lo
function uploadToServer(file, fileName) {
  const formData = new FormData();
  formData.append('file', file, fileName);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('File uploaded successfully:', data);
  })
  .catch(error => {
    console.error('Error uploading file:', error);
  });
}

// Función para mostrar una alerta solo una vez al enfocar los campos de texto
function showAlertOnce(input, message) {
  if (!input.dataset.alerted) {
    alert(message);
    input.dataset.alerted = true; // Marca que la alerta ya fue mostrada
  }
}

// Función para agregar evento de alerta a los campos de texto
function addAlertOnFocus(input, message) {
  input.addEventListener("focus", () => showAlertOnce(input, message));
}

// Agrega eventos de alerta a los campos de texto
addAlertOnFocus(document.getElementById("nombres"), "Favor de utilizar solo mayúsculas y revisar ortografía");