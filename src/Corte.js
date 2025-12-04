// ==============================
// VALIDAR TOKEN
// ==============================
const token = localStorage.getItem("userToken");
if (!token) {
    window.location.href = "/login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("userToken");
    window.location.href = "/login.html";
});

// ==============================
// FORMATEAR FECHA BONITA
// ==============================
function formatearFecha(fecha) {
    const f = new Date(fecha);
    return f.toLocaleDateString() + " " + f.toLocaleTimeString();
}

// ==============================
// CARGAR VENTAS DEL DÍA
// ==============================
async function cargarVentas() {
    const res = await fetch("http://localhost:3000/api/ventas/hoy");
    const ventas = await res.json();

    let totalDia = 0;
    let tabla = "";

    ventas.forEach(v => {
        totalDia += v.total;

        tabla += `
            <tr>
                <td>${v.id}</td>
                <td>${formatearFecha(v.fecha)}</td>
                <td>$${v.total}</td>
                <td>
                    <button onclick="verDetalle(${v.id})" class="add-btn">Ver</button>
                    <button onclick="eliminarVenta(${v.id})" class="new-btn">Eliminar</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("tablaVentas").innerHTML = tabla;
    document.getElementById("totalDia").textContent = totalDia;
    document.getElementById("ventasDia").textContent = ventas.length;
}

cargarVentas();

// ==============================
// VER DETALLE DE UNA VENTA
// ==============================
function verDetalle(id) {
    fetch(`http://localhost:3000/api/venta/${id}`)
        .then(res => res.json())
        .then(venta => {

            if (!venta.items) {
                alert("La venta no fue encontrada.");
                return;
            }

            let detalle = `DETALLE DE VENTA #${id}\n\n`;

            venta.items.forEach(i => {
                detalle += `${i.cantidad}x ${i.producto} (${i.relleno}) - $${i.subtotal}\n`;
            });

            detalle += `\nTOTAL: $${venta.total}`;

            alert(detalle);
        })
        .catch(() => alert("Error al obtener la venta."));
}

// ==============================
// ELIMINAR VENTA
// ==============================
function eliminarVenta(id) {
    if (!confirm("¿Eliminar esta venta?")) return;

    fetch(`http://localhost:3000/api/venta/${id}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            cargarVentas(); // recargar tabla
        })
        .catch(() => alert("Error al eliminar venta."));
}

// ==============================
// EXPORTAR A EXCEL
// ==============================
document.getElementById("exportarExcel").addEventListener("click", () => {
    const tabla = document.getElementById("tablaVentas").innerHTML;
    const blob = new Blob([tabla], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "corte_del_dia.xls";
    a.click();
});

// ==============================
// EXPORTAR PDF (Print)
// ==============================
document.getElementById("exportarPDF").addEventListener("click", () => {
    window.print();
});
