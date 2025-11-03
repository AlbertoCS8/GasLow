import React from "react";
import Slider from "@mui/material/Slider";
import Combustibles from "../src/ApiData/Combustibles.json";
import { obtenerGasolinerasPorRadio } from "./Servicios/RestPeticiones";
import { getGasolineraId } from "./Servicios/RestGoogle";
import { useNavigate } from "react-router-dom";
import MapaComponent from "./MapaComponent/mapaComponent";
function BuscaRadio() {
  let [radio, setRadio] = React.useState(10);
  let [ubicacion, setUbicacion] = React.useState(null);
  let [combustibleSeleccionado, setCombustibleSeleccionado] = React.useState();
  let [gasolineras, setGasolineras] = React.useState([]);
  const navigate = useNavigate();
  return (
    <div>
      <h2>Buscar Gasolineras</h2>
      <button onClick={() => {
        navigate('/');
        
      }}>Busca gasolineras en un municipio</button>
      {!ubicacion && (
        <>
          <p>pulsa el boton para concretar tu ubicación</p>
          <button
            onClick={() => {
              navigator.geolocation.getCurrentPosition((position) => {
                setUbicacion({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }, (error) => {
            console.error("Error al obtener la ubicación:", error);
          }, {
            enableHighAccuracy: true, 
            timeout: 10000,           
            maximumAge: 0,            
          });
        }}
      >
        Obtener Ubicación
      </button>
        </>
      )}
      {ubicacion && <> <p>Selecciona el combustible a buscar</p>
      <select onChange={(e) => {
        setCombustibleSeleccionado(e.target.value);
      }}>
        {Combustibles.map((combustible) => (
          <option key={combustible.Tipo} value={combustible.Tipo}>
            {combustible.Tipo}
          </option>
        ))}
      </select>
      </>}
      {ubicacion && combustibleSeleccionado && (
        <>
          {/* <p>Ubicación obtenida: Latitud {ubicacion.lat}, Longitud {ubicacion.lng}</p> */}
          <p>elige el radio de búsqueda en km:</p>
          <Slider
            value={radio}
            onChange={(e, newValue) => setRadio(newValue)}
            min={0}
        max={20}
        step={1}
        valueLabelDisplay="auto"
      />
      <button onClick={() => {
        obtenerGasolinerasPorRadio(ubicacion, radio, combustibleSeleccionado).then((data) => {
          setGasolineras(data);
        });
      }}>Buscar</button>
      </>  
      )}
      <div className="w-100">
              {
              gasolineras &&
                gasolineras.map(
                  (gasolinera) =>
                    gasolinera[`Precio ${combustibleSeleccionado}`] !== null && (
                      <div key={gasolinera.IDEESS}>
                        <h2>{gasolinera.Rótulo}</h2>
                        <p>
                          {gasolinera.Dirección}, {gasolinera.Localidad} (
                          {gasolinera.Provincia})
                        </p>
                        {
                          <p>
                            Precio {combustibleSeleccionado}:{" "}
                            {gasolinera[`Precio ${combustibleSeleccionado}`]}
                          </p>
                        }
                        {/* <p>Click aquí para ver en Google Maps <a href={`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${gasolinera.Rótulo}&inputtype=textquery&locationbias=point:${gasolinera.Latitud},${gasolinera.Longitud}&fields=place_id,name,geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`}>enlace</a></p> */}
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-icon lucide-map" onClick={async () => {window.open(`https://www.google.com/maps/search/?api=1&query=${gasolinera.Latitud},${gasolinera["Longitud (WGS84)"]},${gasolinera.Rótulo},${gasolinera.Provincia},${gasolinera.Localidad},${gasolinera.Dirección}`, "_blank"); }}>
                        <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/>
                        <path d="M15 5.764v15"/>
                        <path d="M9 3.236v15"/>
                        </svg>
                        Version con link directo a maps (sin usar el backend){/* onClick={async () => {
                        */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-map-icon lucide-map"
                          onClick={async () => {
                            let placeId = await getGasolineraId(gasolinera);
                            window.open(
                              `https://www.google.com/maps/place/?q=place_id:${placeId}`,
                              "_blank"
                            );
                          }}
                        >
                          <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
                          <path d="M15 5.764v15" />
                          <path d="M9 3.236v15" />
                        </svg>
                      </div>
                    ))
              }
              <div className="w-100">
              {gasolineras && ubicacion && (
                <MapaComponent
                  latitud={ubicacion.lat}
                  longitud={ubicacion.lng}
                  gasolineras={gasolineras}
                  combustibleSeleccionado={combustibleSeleccionado}
                  radioKm={radio}
                />
              )}
              </div>
              
            </div>
      
    </div>
  );
}
export default BuscaRadio;
