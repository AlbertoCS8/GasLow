import camposPrecio from '../utils.js/ListaCarburantes.json' with { type: 'json' };
export const cargarDatosApi = async (db) => {
    try {
        const response = await fetch(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const gasolinerasConCoords = data.ListaEESSPrecio.map((g) => {
        // Clonar el objeto original
        const nueva = { ...g };
        // Convertir los precios a número
        camposPrecio.forEach((campo) => {
            if (nueva[campo.nombre] && nueva[campo.nombre].trim() !== "") {
                // Vamos a meter de primeras los precios con . para poder usar funciones chulas de mongo para ordenar y demas
                nueva[campo.nombre] = parseFloat(nueva[campo.nombre].replace(",", "."));
            } else {
                nueva[campo.nombre] = null; 
            }
        });

        // Añadir las coordenadas geoespaciales
        nueva.location = {
            type: "Point",
            coordinates: [
                parseFloat(g["Longitud (WGS84)"].replace(",", ".")),
                parseFloat(g["Latitud"].replace(",", ".")),
            ],
        };

        return nueva;
    });
        if (await db.collection('Gasolineras').countDocuments() === 0) {
            await db.collection('Gasolineras').insertMany(gasolinerasConCoords);
        } else {
            await db.collection('Gasolineras').deleteMany({});

            await db.collection('Gasolineras').insertMany(gasolinerasConCoords);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};