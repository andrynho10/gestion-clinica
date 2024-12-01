const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personalController');

// Obtener todo el personal
router.get('/', personalController.getAll);

// Obtener personal por ID
router.get('/:id', personalController.getById);

// Obtener personal disponible por tipo
router.get('/disponible/:tipo', personalController.getDisponible);

// Actualizar estado del personal
router.patch('/:id/estado', personalController.updateStatus);

module.exports = router;