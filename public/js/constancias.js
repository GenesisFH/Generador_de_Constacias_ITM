document
  .getElementById("constanciaForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtén todos los valores del formulario
    const nombres = document.getElementById("nombres").value;
    const apellidoPaterno = document.getElementById("apellidoPaterno").value;
    const apellidoMaterno = document.getElementById("apellidoMaterno").value;
    const codigo = document.getElementById("codigo").value;
    const curso = document.getElementById("curso").value;
    const periodo = document.getElementById("periodo").value;
    const fechaTerminacion = document.getElementById("fechaTerminacion").value;
    const nombreArchivo = document.getElementById("nombreArchivo").value;

    // Verifica que todos los campos estén llenos
    if (!nombres || !apellidoPaterno || !apellidoMaterno || !codigo || !curso || !periodo || !fechaTerminacion || !nombreArchivo) {
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

document
  .getElementById("generateFromExcel")
  .addEventListener("click", async () => {
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
        const worksheet = XLSX.utils.sheet_to_json(
          workbook.Sheets[firstSheetName]
        );

        const registros = worksheet.map((row) => ({
          nombreCompleto:
            row["NOMBRE DEL PARTICIPANTE"] || "Nombre no especificado",
          clave: row["CLAVE"] || "Clave no especificada",
          curso: row["CURSO"] || "Curso no especificado",
          periodo: row["PERIODO"] || "Periodo no especificado",
          fechaTerminacion:
            row["FECHA DE TERMINACION"] || "Fecha de terminación no especificada",
        }));

        const tipoConstancia = document.getElementById("tipoConstancia").value;
        const templatePath = `/static/pdf/${tipoConstancia}.pdf`; // Ruta ajustada

        const zip = new JSZip();
        for (const registro of registros) {
          // Verifica que todos los campos del registro estén llenos
          if (!registro.nombreCompleto || !registro.clave || !registro.curso || !registro.periodo || !registro.fechaTerminacion) {
            console.warn("Registro incompleto:", registro);
            continue; // Salta este registro si está incompleto
          }

          const pdfBytes = await generatePDF(
            registro,
            tipoConstancia,
            templatePath
          );
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
    nombre: { x: 200, y: 410 },
    curso: { x: 240, y: 355 },
    periodo: { x: 187, y: 315 },
    clave: { x: 250, y: 272 },
    fechaTerminacion: { x: 207, y: 285 },
  },
  tipo2: {
    nombre: { x: 200, y: 410 },
    curso: { x: 240, y: 355 },
    periodo: { x: 187, y: 315 },
    clave: { x: 250, y: 272 },
    fechaTerminacion: { x: 207, y: 285 },
  },
  tipo3: {
    nombre: { x: 200, y: 415 },
    curso: { x: 240, y: 336 },
    periodo: { x: 187, y: 298 },
    clave: { x: 250, y: 258 },
    fechaTerminacion: { x: 207, y: 272 },
  },
  tipo4: {
    nombre: { x: 200, y: 410 },
    curso: { x: 240, y: 355 },
    periodo: { x: 187, y: 315 },
    clave: { x: 250, y: 272 },
    fechaTerminacion: { x: 207, y: 285 },
  },
};

async function generatePDF(data, tipoConstancia, templatePath) {
  try {
    const existingPdfBytes = await fetch(templatePath).then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const claveText = `CLAVE: ${data.clave}`;
    const cursoText = `"${data.curso}"`;
    const periodoText = `DEL DIA ${data.periodo}`;
    const fechaTerminacionText = `MEXICALI, B.C. A ${data.fechaTerminacion}`;

    const nombreCompletoParts = data.nombreCompleto.split(" ");
    let nombreX = coordenadas[tipoConstancia].nombre.x;
    if (nombreCompletoParts.length > 3) {
      nombreX -= 50; // Ajustar esta coordenada según sea necesario
    }

    firstPage.drawText(data.nombreCompleto, {
      x: nombreX,
      y: coordenadas[tipoConstancia].nombre.y,
      size: 20,
      color: PDFLib.rgb(0, 0, 0),
    });

    firstPage.drawText(cursoText, {
      x: coordenadas[tipoConstancia].curso.x,
      y: coordenadas[tipoConstancia].curso.y,
      size: 14,
      color: PDFLib.rgb(0, 0, 0),
    });

    firstPage.drawText(periodoText, {
      x: coordenadas[tipoConstancia].periodo.x,
      y: coordenadas[tipoConstancia].periodo.y,
      size: 14,
      color: PDFLib.rgb(0, 0, 0),
    });

    firstPage.drawText(claveText, {
      x: coordenadas[tipoConstancia].clave.x,
      y: coordenadas[tipoConstancia].clave.y,
      size: 10,
      color: PDFLib.rgb(0, 0, 0),
    });

    firstPage.drawText(fechaTerminacionText, {
      x: coordenadas[tipoConstancia].fechaTerminacion.x,
      y: coordenadas[tipoConstancia].fechaTerminacion.y,
      size: 11,
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
}

  // Función para mostrar una alerta solo una vez al enfocar los campos de texto
  function showAlertOnce(input, message) {
    if (!input.dataset.alerted) {
      alert(message);
      input.dataset.alerted = true; // Marca que la alerta ya fue mostrada
    }
  }

  // Función para convertir a mayúsculas al escribir
  function convertToUppercase(input) {
    input.value = input.value.toUpperCase();
  }

  // Selecciona los campos de nombre, apellido paterno y materno
  const camposValidar = document.querySelectorAll(
    '#nombres, #apellidoPaterno, #apellidoMaterno'
  );

  // Agrega eventos a los campos seleccionados
  camposValidar.forEach((campo) => {
    // Muestra la alerta solo al primer foco para nombres y apellidos
    campo.addEventListener('focus', () => showAlertOnce(campo, 'Favor de utilizar solo mayúsculas y revisar ortografía.'));

    // Convierte a mayúsculas mientras se escribe
    campo.addEventListener('input', () => convertToUppercase(campo));
  });

  // Selecciona el campo del número de horas
  const campoHoras = document.getElementById('horasCurso');

  // Agrega la alerta específica para el campo de horas
  campoHoras.addEventListener('focus', () => showAlertOnce(campoHoras, 'Solo coloca número de horas.'));