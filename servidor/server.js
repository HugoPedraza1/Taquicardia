import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos simulada
const usuarios = [
    { email: 'admin', password: 'admin' },
    { email: 'Mario', password: 'Mario' }
];

//base de datos
let ventas = [];


// LOGIN

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        res.json({ 
            success: true, 
            message: '¡Bienvenido!',
            token: 'token_falso_123'
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Usuario o password incorrectos' 
        });
    }
});


// REGISTRAR VENTA

app.post('/api/venta', (req, res) => {
    const { items, total } = req.body;

    // Validación
    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "La venta no puede estar vacía"
        });
    }

    const nuevaVenta = {
        id: ventas.length + 1,
        fecha: new Date(),
        items,
        total
    };

    ventas.push(nuevaVenta);

    res.json({
        success: true,
        message: "Venta registrada correctamente",
        venta: nuevaVenta
    });
});


// OBTENER TODAS LAS VENTAS

app.get('/api/ventas', (req, res) => {
    // ordenar por fecha (más reciente primero)
    const ordenadas = [...ventas].sort((a, b) => b.fecha - a.fecha);

    res.json(ordenadas);
});


// OBTENER VENTAS DE HOY

app.get('/api/ventas/hoy', (req, res) => {
    const hoy = new Date().toLocaleDateString();

    const ventasHoy = ventas.filter(v => 
        new Date(v.fecha).toLocaleDateString() === hoy
    );

    res.json(ventasHoy);
});


// OBTENER UNA VENTA POR ID

app.get('/api/venta/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const venta = ventas.find(v => v.id === id);

    if (!venta) {
        return res.status(404).json({
            success: false,
            message: "Venta no encontrada"
        });
    }

    res.json(venta);
});


// ELIMINAR UNA VENTA

app.delete('/api/venta/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const originalLength = ventas.length;
    ventas = ventas.filter(v => v.id !== id);

    if (ventas.length === originalLength) {
        return res.status(404).json({
            success: false,
            message: "Venta no encontrada"
        });
    }

    res.json({
        success: true,
        message: "Venta eliminada correctamente"
    });
});


// INICIAR SERVIDOR

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
