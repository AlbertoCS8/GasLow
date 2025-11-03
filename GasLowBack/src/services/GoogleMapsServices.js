import fetch from "node-fetch";

/* Primera versión con un endpoint que usaba findplacefromtext, probando vi que no me dio los resultados esperados
 export const findGasolineraGoogleMapsId = async (gasolinera) => {
//     console.log(gasolinera ,"llega al service");
//     const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
//     // console.log(GOOGLE_MAPS_API_KEY ,"API KEY");
// const input = `${gasolinera.Rótulo}, ${gasolinera.Localidad}, ${gasolinera.Dirección}`;
// const radius = 500; 
// const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(input)}&inputtype=textquery&locationbias=circle:${radius}@${gasolinera.Latitud},${gasolinera["Longitud (WGS84)"]}&fields=place_id,name,geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`;
//   try {
//         const response = await fetch(url);
//         // console.log(response ,"response del fetch");
//         const data = await response.json();
//         // console.log(data ,"data que llega de google");
//         if (data.candidates && data.candidates.length > 0) {
//             /**Nosotros consultamos a la API cual es el sitio que estamos buscando dado un Rótulo, Latitud y Longitud
//              * y la API nos devuelve un array de candidatos que coinciden con la búsqueda. Si el array tiene al menos un candidato,
//              * tomamos el primer candidato (data.candidates[0]) y extraemos su place_id, que es el identificador único
//              * del lugar en Google Maps. Este place_id es lo que devolvemos como resultado de la función.
//              
//             if (data.candidates.length > 1) {
//                 for (const candidate of data.candidates) {
//                     // Aquí puedes realizar alguna acción con cada candidato
//                     console.log('Candidato encontrado:', candidate.geometry);
//                 }          
//             }
//             // console.log(data.candidates[0].geometry.location);
//             // console.log(data.candidates[1].geometry.location);
//             // console.log(gasolinera.Latitud, gasolinera["Longitud (WGS84)"]);
//             const placeId = data.candidates[0].place_id;
//             // console.log(data.candidates,"candidatos en el service");
//             return placeId;
//         } else {
//             throw new Error('Gasolinera no encontrada');
//         }
//     } catch (error) {
//         console.error('Error al buscar la gasolinera:', error);
//         throw new Error('Error interno del servidor');
//     }
};*/ 
export const findGasolineraGoogleMapsId = async (gasolinera) => {
    // console.log(gasolinera ,"llega al service");
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    try {
     const body = {
    locationRestriction: {
      circle: {
        center: {
          latitude: gasolinera.location.coordinates[1],
          longitude: gasolinera.location.coordinates[0]
        },
        radius: 100.0  
      }
    },
    rankPreference: "DISTANCE",
    includedTypes: ["gas_station"],
    maxResultCount: 1,
    languageCode: "es"
  };

  const url = `https://places.googleapis.com/v1/places:searchNearby?key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.id"
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  /* #region IDEA --> Hacer almacenamiento propio de fotos asociadas a las gasolineras una sola vez y asi poblas nuestra bdd con fotos relacionadas
  a gasolineras para llenar la app y dar mas contexto sobre las mismas
   Peticion para obtener fotos, de momento no la usamos
  const photos = await fetch(`https://places.googleapis.com/v1/places/${data.places[0].id}?key=${GOOGLE_MAPS_API_KEY}`, {
     method: "GET",
     headers: {
       "Content-Type": "application/json",
       "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
       "X-Goog-FieldMask": "id,displayName,photos"
     }
   });
   const photosData = await photos.json();
   console.log(photosData ,"photosData");
   #endregion
   */

  if (data) {
            //console.log(data ,"data que llega de google");
            
          const placeId = data.places[0].id;
            return placeId;
        } else {
            console.log(data ," <-- debug data");
            throw new Error('Gasolinera no encontrada');
        }
    } catch (error) {
        console.error('Error al buscar la gasolinera:', error);
        throw new Error('Error interno del servidor');
    }
};