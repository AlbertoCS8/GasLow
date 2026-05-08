const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
/**OBSOLETO, usaremos una query a google maps en vez de lo que tenia pensado */
export const getGasolineraId = async (gasolinera) => {
    try {
        // console.log('Gasolinera que envío:', gasolinera);
// console.log('Body como JSON:', JSON.stringify(gasolinera));
        const fetchResponse = await fetch(`${API_BASE_URL}/getGasolineraId`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gasolinera),
        });
        const data = await fetchResponse.json();
        if (fetchResponse.ok) {
            console.log('ID de la gasolinera recibido:', data);
            return data.placeId;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error al obtener el ID de la gasolinera:', error);
        throw new Error('Error interno del servidor');
    }
};
