import React, { useState } from "react";
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
  let [destino, setDestino] = React.useState(null);
  let [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  return (
    <>
      <section className="app-shell radio-shell">
        <div className="hero-panel compact-hero">
          <div className="hero-copy">
            <span className="eyebrow">Busqueda por proximidad</span>
            <h1 className="hero-title hero-title--small">Gasolineras cerca de ti</h1>
            <p className="hero-text">
              Usa tu ubicacion, ajusta el radio y comparalas con mapa y
              precio en una sola vista.
            </p>
          </div>
          <div className="hero-actions hero-actions--compact">
            <button
              className="btn btn-outline-primary hero-secondary-button"
              onClick={() => navigate("/")}
            >
              Ir a busqueda por municipio
            </button>
          </div>
        </div>

        <div className="content-grid radio-grid">
          <div className="glass-panel search-panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">Configura tu busqueda</p>
                <h2 className="panel-title">Encuentra la mas barata cerca</h2>
              </div>
            </div>

            {!ubicacion ? (
              <div className="location-empty">
                <p className="info-note">
                  Activa la ubicacion para buscar estaciones en tu entorno.
                </p>
                <button
                  className="btn btn-success btn-lg cta-button"
                  onClick={() => {
                    loading ? setLoading(false) : setLoading(true);
                    navigator.geolocation.getCurrentPosition(
                      (position) =>
                        setUbicacion({
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
                        }),
                      (error) => {
                        console.error(error);
                        setLoading(false);
                      },
                      { enableHighAccuracy: true, timeout: 10000 }
                    );
                  }}
                >
                  {loading ? "Obteniendo ubicación..." : "Obtener ubicacion"}
                </button>
              </div>
            ) : (
              <div className="radio-controls">
                <div className="selection-summary">
                  <span className="summary-pill active">Ubicacion detectada</span>
                  <span className={combustibleSeleccionado ? "summary-pill active" : "summary-pill"}>
                    {combustibleSeleccionado || "Combustible"}
                  </span>
                  <span className={combustibleSeleccionado ? "summary-pill active" : "summary-pill"}>{radio} km</span>
                </div>

                <div className="control-panel">
                  <label className="control-label">Combustible</label>
                  <select
                    className="form-select app-select"
                    onChange={(e) => setCombustibleSeleccionado(e.target.value)}
                  >
                    <option value="">Selecciona</option>
                    {Combustibles.map((c) => (
                      <option key={c.Tipo} value={c.Tipo}>
                        {c.Tipo}
                      </option>
                    ))}
                  </select>
                </div>

                {combustibleSeleccionado && (
                  <div className="control-panel">
                    <div className="slider-header">
                      <label className="control-label">Radio de busqueda</label>
                      <strong className="slider-value">{radio} km</strong>
                    </div>
                    <div className="slider-wrap">
                      <Slider
                        value={radio}
                        onChange={(e, v) => setRadio(v)}
                        min={1}
                        max={20}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </div>

                    <button
                      className="btn btn-primary mt-3 cta-button"
                      onClick={() => {
                        obtenerGasolinerasPorRadio(
                          ubicacion,
                          radio,
                          combustibleSeleccionado
                        ).then(setGasolineras);
                      }}
                    >
                      Buscar en este radio
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="glass-panel info-panel">
            <p className="panel-kicker">Vista rapida</p>
            <h3 className="info-title">Estado actual</h3>
            <div className="info-list">
              <div className="info-item">
                <span>Ubicacion</span>
                <strong>{ubicacion ? "Lista" : "Pendiente"}</strong>
              </div>
              <div className="info-item">
                <span>Radio</span>
                <strong>{radio} km</strong>
              </div>
              <div className="info-item">
                <span>Resultados</span>
                <strong>{gasolineras.length}</strong>
              </div>
            </div>
          </aside>
        </div>

        {gasolineras.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <div>
                <p className="panel-kicker">Resultados</p>
                <h2 className="panel-title">Estaciones cercanas</h2>
              </div>
              <p className="results-count">{gasolineras.length} coincidencias</p>
            </div>

            <div className="results-grid">
              {gasolineras.map(
                (g) =>
                  g[`Precio ${combustibleSeleccionado}`] !== null && (
                    <article className="station-card" key={g.IDEESS}>
                      <div className="station-card__top">
                        <div>
                          <p className="station-brand">{g["Rótulo"]}</p>
                          <p className="station-address">
                            {g["Dirección"]}, {g.Localidad}
                          </p>
                        </div>

                        <div className="price-badge">
                          <span>Precio</span>
                          <strong>{g[`Precio ${combustibleSeleccionado}`]} EUR</strong>
                        </div>
                      </div>

                      <div className="station-actions">
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={async () => {
                            try {
                            const placeId = await getGasolineraId(g);

                            window.open(
                              `https://www.google.com/maps/place/?q=place_id:${placeId}`,
                              "_blank"
                            );
                          } catch (error) {
                            console.error("Error al abrir Google Maps:", error);
                            alert("No se pudo abrir Google Maps. Inténtalo de nuevo.");
                          }
                          }}
                        >
                          Google Maps
                        </button>

                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>{
                            setDestino({
                              lat: parseFloat(g.Latitud.replace(",", ".")),
                              lng: parseFloat(
                                g["Longitud (WGS84)"].replace(",", ".")
                              ),
                            }); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
                            
                          }
                        >
                          Ver en mapa
                        </button>
                      </div>
                    </article>
                  )
              )}
            </div>
          </div>
        )}
      </section>

      {gasolineras.length > 0 && ubicacion && (
        <div className="map-shell">
          <MapaComponent
            latitud={ubicacion.lat}
            longitud={ubicacion.lng}
            gasolineras={gasolineras}
            combustibleSeleccionado={combustibleSeleccionado}
            radioKm={radio}
            destino={destino}
          />
        </div>
      )}
    </>
  );
}
export default BuscaRadio;