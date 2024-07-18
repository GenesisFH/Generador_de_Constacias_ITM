document
  .getElementById("constanciaForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nombreCompleto: `${document.getElementById("nombres").value} ${
        document.getElementById("apellidoPaterno").value
      } ${document.getElementById("apellidoMaterno").value}`,
      clave: document.getElementById("codigo").value,
      nombreArchivo: document.getElementById("nombreArchivo").value,
    };

    const tipoConstancia = document.getElementById("tipoConstancia").value;
    const templatePath = `../templates/${tipoConstancia}.pdf`;

    const pdfBytes = await generatePDF(data, templatePath);
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
        const pdfBytes = await generatePDF(registro, templatePath);
        zip.file(`${registro.nombreCompleto}.pdf`, pdfBytes);
      }

      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "Constancias_Escolares.zip");
      });
    };
    reader.readAsArrayBuffer(file);
  });

async function generatePDF(data, templatePath) {
  const existingPdfBytes = await fetch(templatePath).then((res) =>
    res.arrayBuffer()
  );
  const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const claveText = `CLAVE: ${data.clave}`;
  const cursoText = `"${data.curso}"`;
  const periodoText = `DEL DIA  ${data.periodo}`;
  const fechaTerminacionText = `MEXICALI, B.C. A ${data.fechaTerminacion}`;

  firstPage.drawText(data.nombreCompleto, {
    x: 250,
    y: 320,
    size: 24,
    color: PDFLib.rgb(0, 0, 0),
  });

  firstPage.drawText(claveText, {
    x: 600,
    y: 200,
    size: 24,
    color: PDFLib.rgb(0, 0, 0),
  });
  firstPage.drawText(cursoText, {
    x: 50,
    y: 100,
    size: 18,
    color: PDFLib.rgb(0, 0, 0),
  });

  firstPage.drawText(periodoText, {
    x: 50,
    y: 70,
    size: 18,
    color: PDFLib.rgb(0, 0, 0),
  });

  firstPage.drawText(fechaTerminacionText, {
    x: 50,
    y: 40,
    size: 18,
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
