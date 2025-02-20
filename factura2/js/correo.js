
// Obtener elementos del DOM
const openModalButtonCorreo = document.getElementById("enviar_correo");
const modalCorreo = document.getElementById("emailModal");
const closeModalButtonCorreo = document.getElementById("closeModalEmail");

// Abrir modal
openModalButtonCorreo.addEventListener("click", () => {
    modalCorreo.style.display = "flex";
});

// Cerrar modal
closeModalButtonCorreo.addEventListener("click", () => {
    modalCorreo.style.display = "none";
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
    if (event.target === modalCorreo) {
        modal.style.display = "none";
    }
});


document.getElementById("sendEmailButton").addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value;

    if (!email) {
        alert("Por favor, ingresa un correo válido.");
        return;
    }

    // Obtener los datos filtrados
    const data = JSON.parse(localStorage.getItem("tableData") || "[]").filter(row => {
        return (
            (currentFilters.fecha === "" || row.fecha === currentFilters.fecha) &&
            (currentFilters.placa === "" || row.placa === currentFilters.placa) &&
            (currentFilters.estado === "" || row.estado === currentFilters.estado) &&
            (currentFilters.empresa === "" || row.empresa === currentFilters.empresa)
        );
    });

    if (data.length === 0) {
        alert("No hay datos para enviar.");
        return;
    }

    // Información de empresas
    const empresasInfo = {
        "CI MILPA S.A": {
            nombre: "CI MILPA S.A",
            nit: "123",
            ubicacion: "Sogamoso",
            telefono: "3103002211",
            direccion: "Cra 42 # 123"
        },
        "CARBOINSA S.A.S": {
            nombre: "CARBOINSA S.A.S",
            nit: "823",
            ubicacion: "Paipa",
            telefono: "3193002211",
            direccion: "Cra 45 # 123"
        },
        "INCARSA S.A.S": {
            nombre: "INCARSA S.A.S",
            nit: "853",
            ubicacion: "Duitama",
            telefono: "3293002211",
            direccion: "Cra 4 # 123"
        },
        "Sin Empresa": {
            nombre: "",
            nit: "",
            ubicacion: "",
            telefono: "",
            direccion: ""
        }
    };

    // Obtener la información de la empresa filtrada
    const selectedEmpresa = currentFilters.empresa || "Sin Empresa";
    let empresaInfo = empresasInfo[selectedEmpresa] || empresasInfo["Sin Empresa"];

    // Si no se filtró ninguna empresa, mostrar modal para capturar datos
    if (selectedEmpresa === "Sin Empresa") {
        const modal = document.getElementById("empresaModal");
        const saveButton = document.getElementById("saveEmpresaButton");

        modal.style.display = "flex"; // Mostrar modal

        // Manejar el guardado de datos del cliente
        saveButton.onclick = () => {
            const nombre = document.getElementById("nombreEmpresaInput").value.trim();
            const nit = document.getElementById("nitEmpresaInput").value.trim();
            const ubicacion = document.getElementById("ubicacionEmpresaInput").value.trim();
            const telefono = document.getElementById("telefonoEmpresaInput").value.trim();
            const direccion = document.getElementById("direccionEmpresaInput").value.trim();

            if (!nombre || !nit || !ubicacion || !telefono || !direccion) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            empresaInfo = { nombre, nit, ubicacion, telefono, direccion };
            modal.style.display = "none"; // Ocultar modal
            enviarCorreo(email, data, empresaInfo); // Proceder con el envío
        };

        return; // Esperar a que el usuario complete los datos
    } else {
        enviarCorreo(email, data, empresaInfo); // Proceder si hay empresa seleccionada
    }
});

async function enviarCorreo(email, data, empresaInfo) {
    // Inicializar suma total
    let sumaTotal = 0;

    // Formatear los datos en application/x-www-form-urlencoded
    const formattedData = data.map(row => {
        // Calcular el total con incremento del 25%
        const totalConIncremento = (parseFloat(row.total) || 0) * 1.25;

        // Sumar al total acumulado
        sumaTotal += totalConIncremento;

        return [
            row.placa || "",
            row.cantidad || "",
            row.descripcion || "",
            totalConIncremento.toFixed(2) // Asegurar 2 decimales
        ].join(","); // Unir columnas con coma
    }).join("|"); // Unir filas con barra vertical

    // Agregar la información de la empresa a los parámetros
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("empresaNombre", empresaInfo.nombre);
    params.append("empresaNIT", empresaInfo.nit);
    params.append("empresaUbicacion", empresaInfo.ubicacion);
    params.append("empresaTelefono", empresaInfo.telefono);
    params.append("empresaDireccion", empresaInfo.direccion);
    params.append("data", formattedData); // Los datos se codifican como texto
    params.append("sumaTotal", sumaTotal.toFixed(2)); // Sumar total acumulado y agregarlo

    // Enviar los datos al GAS
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbyZx0GiLg_To_YbLN1ZBjAZCCrQH4nPen8RxQscN-f3KIW7KRPMEs5t1ZCWr38gc2uZPg/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString(), // Convertir a formato form-urlencoded
        });

        const result = await response.text();
        if (response.ok) {
            alert("Correo enviado con éxito: " + result); // Mensaje de éxito desde el servidor
        } else {
            alert("Error al enviar el correo: " + result);
        }
    } catch (error) {
        alert("Hubo un problema al enviar los datos: " + error.message);
    }
}


/*document.getElementById("sendEmailButton").addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value;
  
    if (!email) {
      alert("Por favor, ingresa un correo válido.");
      return;
    }
  
    // Obtener los datos filtrados
    const data = JSON.parse(localStorage.getItem("tableData") || "[]").filter(row => {
      return (
        (currentFilters.fecha === "" || row.fecha === currentFilters.fecha) &&
        (currentFilters.placa === "" || row.placa === currentFilters.placa) &&
        (currentFilters.estado === "" || row.estado === currentFilters.estado) &&
        (currentFilters.empresa === "" || row.empresa === currentFilters.empresa)
      );
    });
  
    if (data.length === 0) {
      alert("No hay datos para enviar.");
      return;
    }
  
    // Formatear los datos en application/x-www-form-urlencoded
    const formattedData = data.map(row => {
      return [
        row.fecha || "",
        row.placa || "",
        row.cantidad || "",
        row.descripcion || "",
        row.precio || "",
        row.total || "",    
        row.empresa || "",
        row.estado || ""
      ].join(","); // Unir columnas con coma
    }).join("|"); // Unir filas con barra vertical
  
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("data", formattedData); // Los datos se codifican como texto
  
    // Enviar los datos al GAS
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyftsnFdrdhkbeGOKLx4x2_SjBXUtDZfyox1xCtWe1fEvUE_hThepcB3oHnb-k2L-IyVw/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString(), // Convertir a formato form-urlencoded
      });
  
      const result = await response.text();
      if (response.ok) {
        alert("Correo enviado con éxito: " + result); // Mensaje de éxito desde el servidor
      } else {
        alert("Error al enviar el correo: " + result);
      }
    } catch (error) {
      alert("Hubo un problema al enviar los datos: " + error.message);
    }
  });*/
  
