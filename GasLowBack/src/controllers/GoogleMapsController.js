import { findGasolineraGoogleMapsId } from '../services/GoogleMapsServices.js';

const getGasolineraId = (req, res) => {
    const gasolinera = req.body;
    // console.log(gasolinera ,"llega al controller");
    findGasolineraGoogleMapsId(gasolinera)
    .then(placeId => {
        res.status(200).json({ placeId });
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    });
};

export default { getGasolineraId };