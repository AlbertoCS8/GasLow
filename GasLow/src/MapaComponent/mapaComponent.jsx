import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import { getGasolineraId } from "../Servicios/RestGoogle";
import L from "leaflet";

const iconoPersonalizado = new L.Icon({
  iconUrl: "https://img.icons8.com/?size=100&id=98957&format=png&color=000000",
  iconSize: [22, 22],
});

const iconoGasolinera = new L.Icon({
  iconUrl: "https://img.icons8.com/?size=100&id=87610&format=png&color=000000",
  iconSize: [22, 22],
});

//funcion para mover el mapa a una posicion dada, con las coordenadas lat y lng de una gaso
function FlyToPosition({ lat, lng }) {
  const map = useMap();

  React.useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, { animate: true });
    }
  }, [lat, lng, map]);

  return null;
}

export default function MapaComponent({
  latitud,
  longitud,
  gasolineras,
  combustibleSeleccionado,
  radioKm,
  destino, 
}) {
  return (
    <MapContainer
      center={[latitud, longitud]}
      zoom={13}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Mover al destino si se selecciona una gasolinera */}
      {destino && <FlyToPosition lat={destino.lat} lng={destino.lng} />}

      <Marker icon={iconoPersonalizado} position={[latitud, longitud]}>
        <Popup>
          <strong>📍 Tu ubicación</strong>
        </Popup>
      </Marker>

      <Circle
        center={[latitud, longitud]}
        radius={radioKm * 1000}
        fillColor="blue"
        fillOpacity={0.1}
        color="blue"
      />

      {gasolineras.map((g) => (
        <Marker
          icon={iconoGasolinera}
          key={g.IDEESS}
          position={[
            parseFloat(g.Latitud.replace(",", ".")),
            parseFloat(g["Longitud (WGS84)"].replace(",", ".")),
          ]}
        >
          <Popup>
            <div style={{ minWidth: "150px", maxWidth: "160px" }}>
              <h6 className="fw-bold text-primary">{g.Rótulo}</h6>
              <p className="mb-1 small text-muted">{g.Dirección}</p>
              <p className="fw-semibold mb-0">
                💰 {g[`Precio ${combustibleSeleccionado}`]} €
              </p>
              <button
                className="btn btn-sm btn-outline-secondary mt-2"
                onClick={async () => {
                  const placeId = await getGasolineraId(g);
                  window.open(
                    `https://www.google.com/maps/place/?q=place_id:${placeId}`,
                    "_blank"
                  );
                }}
              >
                Ver en Google Maps
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
