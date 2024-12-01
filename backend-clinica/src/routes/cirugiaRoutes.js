const express = require('express');
const router = express.Router();
const cirugiaController = require('../controllers/cirugiaController');

// Obtener todas las cirugías
router.get('/', cirugiaController.getAll);

// Obtener cirugías por fecha
router.get('/fecha/:fecha', cirugiaController.getByDate);

// Crear nueva cirugía
router.post('/', cirugiaController.create);

// Actualizar estado de cirugía
router.patch('/:id/estado', cirugiaController.updateStatus);

module.exports = router;