import React from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from "react-leaflet";
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
export default function MapaComponent({
  latitud,
  longitud,
  gasolineras,
  combustibleSeleccionado,
  radioKm
}) {
  console.log("latitud:", latitud, "longitud:", longitud);
  return (
    <MapContainer
      center={[latitud, longitud]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
       icon={iconoPersonalizado}
        position={[latitud, longitud]}
      />
      <Circle center={[latitud, longitud]} radius={radioKm * 1000} fillColor="blue"
  fillOpacity={0.1} />
      {gasolineras.map((gasolineras) => (
        <Marker
          icon={iconoGasolinera}
          key={gasolineras.IDEESS}
          position={[
            gasolineras.Latitud.replace(",", "."),
            gasolineras["Longitud (WGS84)"].replace(",", "."),
          ]}
        >
          <Popup>
            <h3>{gasolineras.Rótulo}</h3>
            <p>{gasolineras.Dirección}</p>
            <p>Precio: {gasolineras[`Precio ${combustibleSeleccionado}`]}</p>
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
                let placeId = await getGasolineraId(gasolineras);
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
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
