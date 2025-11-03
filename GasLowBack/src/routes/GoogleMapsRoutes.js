import express from 'express';
import GoogleMapsController from '../controllers/GoogleMapsController.js';

const router = express.Router();

router.post('/getGasolineraId', GoogleMapsController.getGasolineraId);

export default router;
