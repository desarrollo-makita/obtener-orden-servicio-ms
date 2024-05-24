const express = require('express');
const router = express.Router();
const { obtenerOrdenServicio } = require('../controllers/obtenerOrdenServicioControllers');

router.post('/obtener-orden-servicio', obtenerOrdenServicio);

module.exports = router;
