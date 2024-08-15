document
  .getElementById("constanciaForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nombreCompleto: `${document.getElementById("nombres").value} ${
        document.getElementById("apellidoPaterno").value
      } ${document.getElementById("apellidoMaterno").value}`,
      clave: document.getElementById("codigo").value,
      curso: document.getElementById("curso").value,
      periodo: document.getElementById("periodo").value,
      fechaTerminacion: document.getElementById("fechaTerminacion").value,
      nombreArchivo: document.getElementById("nombreArchivo").value,
    };

    const tipoConstancia = document.getElementById("tipoConstancia").value;
    const templatePath = `../templates/${tipoConstancia}.pdf`;

    const pdfBytes = await generatePDF(data, tipoConstancia, templatePath);
    download(pdfBytes, `${data.nombreArchivo}.pdf`, "application/pdf");
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
      const templatePath = `../templates/${tipoConstancia}.pdf`;

      const zip = new JSZip();
      for (const registro of registros) {
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
