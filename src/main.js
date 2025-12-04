
// VALIDAR TOKEN

const token = localStorage.getItem("userToken");
if (!token) {
    window.location.href = "/login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("userToken");
    window.location.href = "/login.html";
});


// VARIABLES GLOBALES

let ticketItems = [];
let total = 0;


// ACTUALIZAR VISTA DEL TICKET

function updateTicketView() {
    const ticketDiv = document.getElementById("ticket");
    ticketDiv.innerHTML = "";

    ticketItems.forEach((item, index) => {
        ticketDiv.innerHTML += `
            <p>
                ${item.cantidad}x ${item.producto} (${item.relleno}) - $${item.subtotal}
                <button onclick="eliminarItem(${index})" 
                    style="
                        background:red; 
                        color:white; 
                        border:none; 
                        padding:2px 6px; 
                        border-radius:4px; 
                        margin-left:10px;
                        cursor:pointer;">
                    X
                </button>
            </p>
        `;
    });

    document.getElementById("total").innerText = total;
}
function eliminarItem(index) {
    total -= ticketItems[index].subtotal;  
    ticketItems.splice(index, 1);          

    updateTicketView();                    
}



document.getElementById("agregarBtn").addEventListener("click", () => {
    const producto = document.getElementById("producto").value;
    const relleno = document.getElementById("relleno").value;
    const cantidad = parseInt(document.getElementById("cantidad").value);

    const precios = {
        Taco: 15,
        Quesadilla: 35,
        Volcán: 20,
        Refresco: 20
    };

    const subtotal = precios[producto] * cantidad;
    total += subtotal;

    ticketItems.push({
        producto,
        relleno,
        cantidad,
        subtotal
    });

    updateTicketView();
});


// CALCULAR CAMBIO

document.getElementById("calcularBtn").addEventListener("click", () => {
    const pago = parseFloat(document.getElementById("pago").value);
    const cambio = pago - total;
    document.getElementById("cambio").innerText = cambio >= 0 ? cambio : 0;
});


// NUEVO PEDIDO (GUARDAR Y LIMPIAR)

document.getElementById("nuevoBtn").addEventListener("click", async () => {
    
    if (ticketItems.length > 0) {

        await fetch("http://localhost:3000/api/venta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: ticketItems,
                total: total
            })
        });

        console.log("Venta registrada en servidor");
    }

    // Reset
    ticketItems = [];
    total = 0;

    updateTicketView();

    document.getElementById("pago").value = "";
    document.getElementById("cambio").innerText = "0";
});


// IMPRIMIR TICKET

document.getElementById("imprimirBtn").addEventListener("click", () => {
    window.print();
});
