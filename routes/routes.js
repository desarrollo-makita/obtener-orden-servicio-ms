const express = require('express');
const router = express.Router();
const { obtenerOrdenServicio , obtenerOrdenesRut } = require('../controllers/obtenerOrdenServicioControllers');

router.post('/obtener-orden-servicio', obtenerOrdenServicio);
router.post('/obtener-orden-servicio-rut', obtenerOrdenesRut);

module.exports = router;
