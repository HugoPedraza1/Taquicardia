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

// validar login
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
            message: 'Usuario o password incorrectos ff' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});