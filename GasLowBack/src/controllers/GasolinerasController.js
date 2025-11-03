import GasolinerasServices from '../services/GasolinerasServices.js';


const getGasolinerasPorMunicipio = (req, res) => {
    const idMunicipio = req.params.idMunicipio;
    GasolinerasServices.obtenerGasolinerasPorMunicipio(idMunicipio)
        .then(gasolineras => {
            res.json(gasolineras);
        })
        .catch(error => {
            console.error('Error fetching gasolineras:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};
const getGasolinerasPorRadio = (req, res) => {
    const { lat, lng, radio, combustible } = req.query;
    GasolinerasServices.obtenerGasolinerasPorRadio({ lat: parseFloat(lat), lng: parseFloat(lng) }, parseFloat(radio), combustible)
        .then(gasolineras => {
            res.json(gasolineras);
        })
        .catch(error => {
            console.error('Error fetching gasolineras por radio:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};
export default { getGasolinerasPorMunicipio, getGasolinerasPorRadio };
