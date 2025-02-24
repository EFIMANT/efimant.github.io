// Abrir el modal
document.getElementById("openModalPdfBtn").addEventListener("click", () => {
    document.getElementById("pdfModal").style.display = "flex";
});

// Cerrar el modal
document.getElementById("closeModalPdfBtn").addEventListener("click", () => {
    document.getElementById("pdfModal").style.display = "none";
});


// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
    document.querySelectorAll(".modal").forEach((modal) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

// Función para cerrar un modal por ID
function closeModalwhatsapp(id) {
    document.getElementById(id).style.display = "none";
}

// Cerrar modal de WhatsApp al hacer clic en la "X"
document.querySelector(".closeW")?.addEventListener("click", () => closeModalwhatsapp("pdfWhatsappModal"));

// Cerrar modal de selección de envío al hacer clic en la "X"
document.querySelector(".closeW2")?.addEventListener("click", () => closeModalwhatsapp("whatsappSelectionModal"));
document.querySelector(".closeW3")?.addEventListener("click", () => closeModalwhatsapp("empresaModal"));




document.getElementById("generatePdfBtn").addEventListener("click", () => {
    const fecha = document.getElementById("modalFecha").value;
    const cuenta = document.getElementById("modalCuenta").value;

    if (!fecha || !cuenta) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    document.getElementById("pdfModal").style.display = "none"; // Cierra el modal
    generatePDF(fecha, cuenta); // Genera el PDF con los datos
});


//MODAL WHATSAP

function abrirModalWhatsapPDF() {
    var modal = document.getElementById("pdfWhatsappModal");
    modal.style.display = "flex";

    // Evento para cerrar el modal al hacer clic en la "X"
    document.querySelector("#pdfWhatsappModal .close").onclick = function () {
        modal.style.display = "none";
    };

    // Evento para cerrar el modal al hacer clic fuera de él
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}


document.getElementById("generatePdfWhatsappBtn").addEventListener("click", function () {
    const fechaw = document.getElementById("modalFechaw").value;
    const cuentaw = document.getElementById("modalCuentaw").value;

    if (!fechaw || !cuentaw) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    generatePDFWhatsapp(fechaw, cuentaw); // Generar PDF
    doc.save(`Cuenta_Cobro_#${cuenta || "ingresado"} ${empresaInfo.nombre || ""}.pdf`); // Cerrar modal
});



let doc;



function enviarPorWhatsApp() {
    if (!doc) {
        abrirModalWhatsapPDF(); // Si no hay PDF, abrir el modal
        return;
    }

    // Abrir el modal para seleccionar a quién enviar
    let modal = document.getElementById("whatsappSelectionModal");
    modal.style.display = "flex";

    // Manejar el envío al número predeterminado (para mí)
    document.getElementById("sendToMe").onclick = function () {
        enviarPDFaWhatsApp("3025465479"); // Número predefinido
        modal.style.display = "none";
    };

    // Manejar el envío al número del cliente
    document.getElementById("sendToClient").onclick = function () {
        let clientNumber = document.getElementById("clientNumber").value;
        if (clientNumber) {
            enviarPDFaWhatsApp(clientNumber);
            modal.style.display = "none";
        } else {
            alert("Por favor, ingresa un número de cliente.");
        }
    };
}


function enviarPDFaWhatsApp(numero) {
    let pdfBlob = doc.output("blob");
    let formData = new FormData();
    formData.append("file", pdfBlob, "factura.pdf");

    fetch("https://store1.gofile.io/uploadFile", {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                let fileURL = data.data.downloadPage;
                let mensaje = encodeURIComponent(" 🛠 *EFIMANT* 🛠 te ha generado una nueva cuenta de cobro:  " + fileURL + ", *_¡Estamos aquí para servirte!_*");
                let whatsappLink = `https://api.whatsapp.com/send?phone=57${numero}&text=${mensaje}`;
                window.open(whatsappLink, "_blank");
            } else {
                alert("Error al subir el archivo.");
            }
        })
        .catch(error => console.error("Error:", error));
}



// Cerrar modal al hacer clic en la "X"
/*document.querySelector("#whatsappSelectionModal .close").onclick = function () {
    modal.style.display = "none";
};
*/


function generatePDF(fecha, cuenta) {
    const { jsPDF } = window.jspdf;
    doc = new jsPDF();

    // Datos de las empresas
    const empresasInfo = {
        "CI MILPA S.A": {
            nombre: "CI MILPA S.A",
            nit: "860513970", 
            ubicacion: "Bogotá, D.C",
            telefono: "3102044993",
            direccion: "AK 45 118 30 OF 405"
        },
        "CARBOINSA S.A.S": {
            nombre: "CARBOINSA S.A.S",
            nit: "830106265",
            ubicacion: "Bogotá, D.C",
            telefono: "3112546420",
            direccion: "AK 45 118 30 OF 405"
        },
        "INCARSA S.A.S": {
            nombre: "INCARSA S.A.S",
            nit: "830078829",
            ubicacion: "Bogotá, D.C",
            telefono: "6016294174",
            direccion: "AK 45 118 30 OF 405"
        },
        "Sin Empresa": {
            nombre: "",
            nit: "",
            ubicacion: "",
            telefono: "",
            direccion: ""
        }
    };

    // Obtener empresa seleccionada
    const selectedEmpresa = document.getElementById("filterEmpresa").value;
    const empresaInfo = empresasInfo[selectedEmpresa];

    // Encabezado de la página
    const logo = 'data:image/png;base64,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'; // Aquí iría tu base64 del logo
    doc.addImage(logo, 'PNG', 10, 5, 60, 18);


    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text("Socha, Boyacá, Colombia", 15, 27);
    doc.setFont("helvetica", "bold");
    doc.text("Web:", 135, 17);
    doc.setFont("helvetica", "normal");
    doc.text(" efimant.com", 142, 17);
    doc.setFont("helvetica", "bold");
    doc.text("E-Mail:", 135, 22);
    doc.setFont("helvetica", "normal");
    doc.text(" efimant.oficial@gmail.com", 145, 22);
    doc.setFont("helvetica", "bold");
    doc.text("WhatsApp:", 135, 27);
    doc.setFont("helvetica", "normal");
    doc.text(" +57 3025465479", 152, 27);

   
    doc.setFontSize(10);
    // Línea separadora
    doc.line(20, 35, 180, 35);

    // Título "Cuenta de Cobro"
    doc.setFontSize(16);
    doc.setTextColor(2, 147, 166);
    doc.setFont("helvetica", "bold");  // Establece la fuente en negrita
    doc.text("Cuenta de Cobro", 35, 50, null, null, "center");
    doc.setFont("helvetica", "normal"); // Establece la fuente normal
    // Información del remitente
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Emitida por:", 20, 63);
    doc.setFont("helvetica", "normal"); // Establece la fuente normal

    doc.line(20, 66, 20, 66);


    doc.text("Jonathan Aldemar Estupiñán Merchan", 20, 70);
    doc.text("NIT: 1052405181-4", 20, 75);
    doc.text("Socha, Boyacá, Colombia", 20, 80);
    doc.text("Tel: 3025465479", 20, 85);

    // Información de la empresa destinataria
    doc.setFont("helvetica", "bold");
    doc.text("A favor de:", 110, 63);
    doc.setFont("helvetica", "normal");


    if (selectedEmpresa === "") {
        // Si no hay empresa seleccionada, dibujar líneas en lugar de información
        const lineY = 70;
        doc.text("Nombre: ___________________________", 110, lineY);
        doc.text("NIT: _______________________________", 110, lineY + 5);
        doc.text("Ubicación: _________________________", 110, lineY + 10);
        doc.text("Teléfono: __________________________", 110, lineY + 15);
        doc.text("Dirección: _________________________", 110, lineY + 20);
    } else {
        // Si hay una empresa seleccionada, mostrar la información
        doc.text(`${empresaInfo.nombre || ""}`, 110, 70);
        doc.text(`NIT: ${empresaInfo.nit || ""}`, 110, 75);
        doc.text(`Ubicación:  ${empresaInfo.direccion || ""}, ${empresaInfo.ubicacion || ""}`, 110, 80);
        doc.text(`Teléfono: ${empresaInfo.telefono || ""}`, 110, 85);

    }

    // Datos de la cuenta de cobro
    doc.text(`Nº: ${cuenta || "ingresado"}`, 151, 45);
    doc.text(`Fecha: ${fecha || "ingresada"}`, 151, 50);



    // Tabla de encabezado
    let startY = 100;
    doc.setFontSize(10);
    doc.setFillColor(192, 231, 231);
    doc.rect(15, startY, 168, 8, "F"); // Fondo de encabezado de tabla
    doc.setFont("helvetica", "bold");
    doc.text("Placa", 25, startY + 5);
    doc.text("Cantidad", 43, startY + 5);
    doc.text("Descripción", 105, startY + 5);
    doc.text("Total", 175, startY + 5, null, null, "right");
    doc.setFont("helvetica", "normal");

    // Datos filtrados
    const data = JSON.parse(localStorage.getItem("tableData") || "[]");
    const filteredData = data.filter(row => {
        return (
            (currentFilters.fecha === "" || row.fecha === currentFilters.fecha) &&
            (currentFilters.placa === "" || row.placa === currentFilters.placa) &&
            (currentFilters.estado === "" || row.estado === currentFilters.estado) &&
            (currentFilters.empresa === "" || row.empresa === currentFilters.empresa)
        );
    });

    // Agregar filas
    startY += 15;
    let totalSum = 0;

    filteredData.forEach((row, index) => {
        const totalAjustado = (row.total || 0) * 1.25;
        totalSum += totalAjustado;

        // Verifica si se ha excedido el tamaño de la página
        if (startY > 270) {
            doc.addPage(); // Añadir una nueva página
            startY = 10; // Reiniciar la posición Y
        }

        // Formateo de dinero con separadores de miles
        const totalFormatted = `$${totalAjustado.toLocaleString()}`;

        const maxWidthDescripcion = 90; // Ajusta el ancho máximo de la columna de descripción
        const lineHeight = 6; // Altura por línea de texto

        // Dividir la descripción en múltiples líneas si es muy larga
        const descripcionLineas = doc.splitTextToSize(row.descripcion || "-", maxWidthDescripcion);
        const rowHeight = descripcionLineas.length * lineHeight; // Altura de la fila según las líneas de descripción

        // Dibujar los textos
        doc.text(`${row.placa || "-"}`, 23, startY);
        doc.text(`${row.cantidad || "-"}`, 50, startY);
        doc.text(descripcionLineas, 75, startY);
        doc.text(totalFormatted, 180, startY, null, null, "right");

        // Ajustar la posición de la línea divisoria
        startY += rowHeight; // Mover la posición de la siguiente fila según el tamaño real de la descripción

        // Establecer el color de la línea
        doc.setDrawColor(88, 193, 191); // Color RGB

        // Dibujar línea de separación después de ajustar startY
        doc.line(15, startY -2, 182, startY -2);

        startY += 6; // Espacio adicional para la siguiente fila

    });


    if (filteredData.length === 0) {
        doc.text("No hay datos filtrados.", 15, startY);
    }

    // Total
    startY += 10;
    doc.setFontSize(10);
    const totalSumFormatted = `$${totalSum.toLocaleString()}`;
    doc.text(`Total:`, 150, startY, null, null, "right");
    doc.setFontSize(12);
    doc.setTextColor(2, 147, 166);
    doc.setFont("helvetica", "bold");
    doc.text(`${totalSumFormatted}`, 180, startY, null, null, "right");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // Footer

    doc.setFontSize(10);
    doc.text("Gracias por ser parte de nuestra comunidad.", 70, startY + 20);
    doc.text(" ¡Estamos felices de que seas parte de nosotros!", 66, startY + 25);

    // Guardar el PDF
    doc.save("cuenta_cobro.pdf");
    // Guardar el PDF en el iframe
    /*const iframe = document.getElementById("pdfPreview");
    const pdfData = doc.output('arraybuffer');
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;*/
}

// Llama a la función para generar y mostrar el PDF
//generatePDF("2025-02-18", "001");
/*----------------------------------------MISMO PDF PARA WHATSAP----------------------------------*/



function generatePDFWhatsapp(fecha, cuenta) {
    const { jsPDF } = window.jspdf;
    doc = new jsPDF();

    // Datos de las empresas
    const empresasInfo = {
        "CI MILPA S.A": {
            nombre: "CI MILPA S.A",
            nit: "860513970", 
            ubicacion: "Bogotá, D.C",
            telefono: "3102044993",
            direccion: "AK 45 118 30 OF 405"
        },
        "CARBOINSA S.A.S": {
            nombre: "CARBOINSA S.A.S",
            nit: "830106265",
            ubicacion: "Bogotá, D.C",
            telefono: "3112546420",
            direccion: "AK 45 118 30 OF 405"
        },
        "INCARSA S.A.S": {
            nombre: "INCARSA S.A.S",
            nit: "830078829",
            ubicacion: "Bogotá, D.C",
            telefono: "6016294174",
            direccion: "AK 45 118 30 OF 405"
        },
        "Sin Empresa": {
            nombre: "",
            nit: "",
            ubicacion: "",
            telefono: "",
            direccion: ""
        }
    };

    // Obtener empresa seleccionada
    const selectedEmpresa = document.getElementById("filterEmpresa").value;
    const empresaInfo = empresasInfo[selectedEmpresa];

    // Encabezado de la página
    const logo = 'data:image/png;base64,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'; // Aquí iría tu base64 del logo
    doc.addImage(logo, 'PNG', 10, 5, 60, 18);


    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text("Socha, Boyacá, Colombia", 15, 27);
    doc.setFont("helvetica", "bold");
    doc.text("Web:", 135, 17);
    doc.setFont("helvetica", "normal");
    doc.text(" efimant.com", 142, 17);
    doc.setFont("helvetica", "bold");
    doc.text("E-Mail:", 135, 22);
    doc.setFont("helvetica", "normal");
    doc.text(" efimant.oficial@gmail.com", 145, 22);
    doc.setFont("helvetica", "bold");
    doc.text("WhatsApp:", 135, 27);
    doc.setFont("helvetica", "normal");
    doc.text(" +57 3025465479", 152, 27);

    doc.setFontSize(10);
    // Línea separadora
    doc.line(20, 35, 180, 35);

    // Título "Cuenta de Cobro"
    doc.setFontSize(16);
    doc.setTextColor(2, 147, 166);
    doc.setFont("helvetica", "bold");  // Establece la fuente en negrita
    doc.text("Cuenta de Cobro", 35, 50, null, null, "center");
    doc.setFont("helvetica", "normal"); // Establece la fuente normal
    // Información del remitente
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Emitida por:", 20, 63);
    doc.setFont("helvetica", "normal"); // Establece la fuente normal

    doc.line(20, 66, 20, 66);


    doc.text("Jonathan Aldemar Estupiñán Merchan", 20, 70);
    doc.text("NIT: 1052405181-4", 20, 75);
    doc.text("Socha, Boyacá, Colombia", 20, 80);
    doc.text("Tel: 3025465479", 20, 85);

    // Información de la empresa destinataria
    doc.setFont("helvetica", "bold");
    doc.text("A favor de:", 110, 63);
    doc.setFont("helvetica", "normal");


    if (selectedEmpresa === "") {
        // Si no hay empresa seleccionada, dibujar líneas en lugar de información
        const lineY = 70;
        doc.text("Nombre: ___________________________", 110, lineY);
        doc.text("NIT: _______________________________", 110, lineY + 5);
        doc.text("Ubicación: _________________________", 110, lineY + 10);
        doc.text("Teléfono: __________________________", 110, lineY + 15);
        doc.text("Dirección: _________________________", 110, lineY + 20);
    } else {
        // Si hay una empresa seleccionada, mostrar la información
        doc.text(`${empresaInfo.nombre || ""}`, 110, 70);
        doc.text(`NIT: ${empresaInfo.nit || ""}`, 110, 75);
        doc.text(`Ubicación:  ${empresaInfo.direccion || ""}, ${empresaInfo.ubicacion || ""}`, 110, 80);
        doc.text(`Teléfono: ${empresaInfo.telefono || ""}`, 110, 85);

    }

    // Datos de la cuenta de cobro
    doc.text(`Nº: ${cuenta || "ingresado"}`, 151, 45);
    doc.text(`Fecha: ${fecha || "ingresada"}`, 151, 50);

    // Tabla de encabezado
    let startY = 100;
    doc.setFontSize(10);
    doc.setFillColor(192, 231, 231);
    doc.rect(15, startY, 168, 8, "F"); // Fondo de encabezado de tabla
    doc.setFont("helvetica", "bold");
    doc.text("Placa", 25, startY + 5);
    doc.text("Cantidad", 43, startY + 5);
    doc.text("Descripción", 105, startY + 5);
    doc.text("Total", 175, startY + 5, null, null, "right");
    doc.setFont("helvetica", "normal");

    // Datos filtrados
    const data = JSON.parse(localStorage.getItem("tableData") || "[]");
    const filteredData = data.filter(row => {
        return (
            (currentFilters.fecha === "" || row.fecha === currentFilters.fecha) &&
            (currentFilters.placa === "" || row.placa === currentFilters.placa) &&
            (currentFilters.estado === "" || row.estado === currentFilters.estado) &&
            (currentFilters.empresa === "" || row.empresa === currentFilters.empresa)
        );
    });

    // Agregar filas
    startY += 15;
    let totalSum = 0;

    filteredData.forEach((row, index) => {
        const totalAjustado = (row.total || 0) * 1.25;
        totalSum += totalAjustado;

        // Verifica si se ha excedido el tamaño de la página
        if (startY > 270) {
            doc.addPage(); // Añadir una nueva página
            startY = 10; // Reiniciar la posición Y
        }

        // Formateo de dinero con separadores de miles
        const totalFormatted = `$${totalAjustado.toLocaleString()}`;

       
        const maxWidthDescripcion = 90; // Ajusta el ancho máximo de la columna de descripción
        const lineHeight = 6; // Altura por línea de texto

        // Dividir la descripción en múltiples líneas si es muy larga
        const descripcionLineas = doc.splitTextToSize(row.descripcion || "-", maxWidthDescripcion);
        const rowHeight = descripcionLineas.length * lineHeight; // Altura de la fila según las líneas de descripción

        // Dibujar los textos
        doc.text(`${row.placa || "-"}`, 23, startY);
        doc.text(`${row.cantidad || "-"}`, 50, startY);
        doc.text(descripcionLineas, 75, startY);
        doc.text(totalFormatted, 180, startY, null, null, "right");

        // Ajustar la posición de la línea divisoria
        startY += rowHeight; // Mover la posición de la siguiente fila según el tamaño real de la descripción

        // Establecer el color de la línea
        doc.setDrawColor(88, 193, 191); // Color RGB

        // Dibujar línea de separación después de ajustar startY
        doc.line(15, startY -2, 182, startY -2);

        startY += 6; // Espacio adicional para la siguiente fila
    });


    if (filteredData.length === 0) {
        doc.text("No hay datos filtrados.", 15, startY);
    }

    // Total
    startY += 10;
    doc.setFontSize(10);
    const totalSumFormatted = `$${totalSum.toLocaleString()}`;
    doc.text(`Total:`, 150, startY, null, null, "right");
    doc.setFontSize(12);
    doc.setTextColor(2, 147, 166);
    doc.setFont("helvetica", "bold");
    doc.text(`${totalSumFormatted}`, 180, startY, null, null, "right");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // Footer

    doc.setFontSize(10);
    doc.text("Gracias por ser parte de nuestra comunidad.", 70, startY + 20);
    doc.text(" ¡Estamos felices de que seas parte de nosotros!", 66, startY + 25);

    //reactivar envio por whatsapp
    enviarPorWhatsApp()

}

