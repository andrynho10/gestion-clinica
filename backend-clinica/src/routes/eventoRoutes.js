const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

// Crear nuevo evento
router.post('/', eventoController.create);

// Obtener eventos de una cirugía
router.get('/cirugia/:cirugia_id', eventoController.getByCirugia);

module.exports = router;