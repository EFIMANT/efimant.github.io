/*---------------------------------------------------CREAR XLSX ---------------------------------------------*/

document.addEventListener("DOMContentLoaded", function () {
    const descargarExcelBtn = document.getElementById("descargarExcel");

    if (!descargarExcelBtn) {
        console.error("El botón 'descargarExcel' no se encontró en el DOM.");
        return;
    }

    descargarExcelBtn.addEventListener("click", function () {
        const data = JSON.parse(localStorage.getItem("tableData") || "[]");

        if (data.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        const filteredData = data.map(row => ({
            Fecha: row.fecha,
            Placa: row.placa,
            Cantidad: row.cantidad,
            Descripción: row.descripcion,
            Precio: row.precio,
            Total: row.total,
            Empresa: row.empresa,
            Estado: row.estado
        }));

        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Filtrados");

        XLSX.writeFile(workbook, "datos_filtrados.xlsx");
    });
});

