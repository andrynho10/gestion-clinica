const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pabellonRoutes = require('./routes/pabellonRoutes');
const personalRoutes = require('./routes/personalRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/pabellones', pabellonRoutes);
app.use('/api/personal', personalRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});