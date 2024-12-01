const express = require('express');
const router = express.Router();
const pabellonController = require('../controllers/pabellonController');

// Obtener todos los pabellones
router.get('/', pabellonController.getAll);

// Obtener un pabellón específico
router.get('/:id', pabellonController.getById);

// Actualizar estado de un pabellón
router.patch('/:id/estado', pabellonController.updateStatus);

module.exports = router;