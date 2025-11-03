import {MongoClient} from 'mongodb';

const obtenerGasolinerasPorMunicipio = async (idMunicipio) => {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db(process.env.DB_NAME);
        const gasolineras = await db.collection('Gasolineras').find({ IDMunicipio: idMunicipio }).toArray();
        client.close();
        return gasolineras;
    } catch (error) {
        console.error('Error fetching gasolineras:', error);
        throw error;
    }
};
const obtenerGasolinerasPorRadio = async (ubicacion, radioKm, combustible) => {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db(process.env.DB_NAME);
        const gasolineras = await db.collection('Gasolineras').find({
            location: {
                $geoWithin: {
                    $centerSphere: [ [ubicacion.lng, ubicacion.lat], radioKm / 6378.1 ] 
                    //centerSphere es una funcion interesante de mongo que te permite buscar en un radio dado en km
                }
            },
            [`Precio ${combustible}`]: { $gt: 0 }
        }).sort({ [`Precio ${combustible}`]: 1 }).limit(20).toArray(); 
        //ese sort se puede usar porque al meter los documentos en la base de datos convertimos los precios a numeros pasando las comas
        //a puntos, si no mongo los consideraria strings 
        client.close();
        return gasolineras;
    } catch (error) {
        console.error('Error fetching gasolineras por radio:', error);
        throw error;
    }
};
export default { obtenerGasolinerasPorMunicipio, obtenerGasolinerasPorRadio };