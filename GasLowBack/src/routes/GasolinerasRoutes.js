import express from 'express';
import GasolinerasController from '../controllers/GasolinerasController.js';
const router = express.Router();
router.get('/gasolineras/municipio/:idMunicipio', GasolinerasController.getGasolinerasPorMunicipio);
router.get('/gasolineras/radio', GasolinerasController.getGasolinerasPorRadio);
export default router;