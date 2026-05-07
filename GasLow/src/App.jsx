import { useState } from "react";
import CCAA from "../src/ApiData/CCAA.json";
import Provincias from "../src/ApiData/Provincias.json";
import Municipios from "../src/ApiData/Municipios.json";
import Combustibles from "../src/ApiData/Combustibles.json";
import "./App.css";
import { obtenerGasolinerasPorMunicipio } from "./Servicios/RestPeticiones.js";
import { getGasolineraId } from "./Servicios/RestGoogle.js";
import {
  ordenarGasolinerasPorPrecio,
  filtrarNulosEnPrecio,
} from "./utils/funciones.js";
import { useNavigate } from "react-router-dom";

function App() {
  let [selectedCCAA, setSelectedCCAA] = useState("");
  let [selectedProvincia, setSelectedProvincia] = useState("");
  let [selectedMunicipio, setSelectedMunicipio] = useState("");
  let [gasolineras, setGasolineras] = useState([]); // variable para pintar las gasolineras en pantalla (de 10 en 10)
  let [GasolinerasOrdenadas, setGasolinerasOrdenadas] = useState([]); // variable comodin que siempre tiene almacenadas todas las gasolineras ordenadas
  let [LengthGasolinerasFiltradas, setLengthGasolinerasFiltradas] = useState(0); // variable para almacenar el length de las gasolineras filtradas (sin nulos en precio) para que a la hora
  //de paginar sepamos el total porque si no siempre seran las gasolineras del municipio (todas)
  let [selectedCombustible, setSelectedCombustible] = useState("");
  let [pages, setPages] = useState(0);
  let [actualPage, setActualPage] = useState(0);
  const navigate = useNavigate();
  //#region Stepper Material UI
  const steps = [
    "Seleccionar CCAA",
    "Seleccionar Provincia",
    "Seleccionar Municipio",
    "Seleccionar Combustible",
  ];
  const [activeStep, setActiveStep] = useState(0);
  //Los Steps irán de 0 a 5
  const [skipped, setSkipped] = useState(new Set());
  const comunidadSeleccionada = CCAA.find(
    (ccaa) => ccaa.IDCCAA === selectedCCAA
  )?.CCAA;
  const provinciaSeleccionada = Provincias.find(
    (prov) => prov.IDProvincia === selectedProvincia
  )?.Provincia;
  const municipioSeleccionado = Municipios.find(
    (municipio) => municipio.IDMunicipio === selectedMunicipio
  )?.Municipio;

  const isStepOptional = (step) => {};

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  //#endregion
  function buscarGasolineras() {
    // let codigoPostal = document.querySelector('input').value;
    // alert(`Buscando gasolineras en ${codigoPostal}...`);
    // console.log(selectedCCAA, selectedProvincia, selectedMunicipio);
    //hacemos pet con servicio pasandole el idMunicipio
    /*
      {
    "Fecha": "26/08/2025 21:28:42",
    "ListaEESSPrecio": [
        {
            "C.P.": "28801",
            "Dirección": "CALLE PERU, 31",
            "Horario": "L: 06:00-21:00",
            "Latitud": "40,508333",
            "Localidad": "ALCALA DE HENARES",
            "Longitud (WGS84)": "-3,396917",
            "Margen": "N",
            "Municipio": "Alcalá de Henares",
            "Precio Adblue": "",
            "Precio Amoniaco": "",
            "Precio Biodiesel": "",
            "Precio Bioetanol": "",
            "Precio Biogas Natural Comprimido": "",
            "Precio Biogas Natural Licuado": "",
            "Precio Diésel Renovable": "",
            "Precio Gas Natural Comprimido": "",
            "Precio Gas Natural Licuado": "",
            "Precio Gases licuados del petróleo": "",
            "Precio Gasoleo A": "1,309",
            "Precio Gasoleo B": "",
            "Precio Gasoleo Premium": "",
            "Precio Gasolina 95 E10": "",
            "Precio Gasolina 95 E25": "",
            "Precio Gasolina 95 E5": "1,429",
            "Precio Gasolina 95 E5 Premium": "",
            "Precio Gasolina 95 E85": "",
            "Precio Gasolina 98 E10": "",
            "Precio Gasolina 98 E5": "",
            "Precio Gasolina Renovable": "",
            "Precio Hidrogeno": "",
            "Precio Metanol": "",
            "Provincia": "MADRID",
            "Remisión": "dm",
            "Rótulo": "ENERGY",
            "Tipo Venta": "P",
            "% BioEtanol": "0,0",
            "% Éster metílico": "0,0",
            "IDEESS": "14833",
            "IDMunicipio": "4280",
            "IDProvincia": "28",
            "IDCCAA": "13"
    }]
    "Nota": "Archivo de todos los productos en todas las estaciones de servicio. La actualización de precios se realiza cada media hora, con los precios en vigor en ese momento.",
    "ResultadoConsulta": "OK"
}
      */
    obtenerGasolinerasPorMunicipio(selectedMunicipio).then(async (data) => {
      const ordenadas = await ordenarGasolinerasPorPrecio(
        data,
        selectedCombustible
      );
      setGasolinerasOrdenadas(ordenadas);
      const filtradas = filtrarNulosEnPrecio(ordenadas, selectedCombustible);
      setActualPage(0);

      setLengthGasolinerasFiltradas(filtradas.length);
      setGasolineras(filtradas.slice(0, 10));
      setPages(Math.ceil(filtradas.length / 10));
    });
  }

  function recalcularGasolineras(direction) {
    const nuevaPagina = actualPage + direction;
    const start = nuevaPagina * 10;
    const end = start + 10;
    setGasolineras(GasolinerasOrdenadas.slice(start, end));
    setActualPage(nuevaPagina);
  }

  function reordenarGasolinerasPorPrecio(
    GasolinerasOrdenadas,
    tipoCombustible)
    {
    const ordenadas = ordenarGasolinerasPorPrecio(
      GasolinerasOrdenadas,
      tipoCombustible
    );
    setGasolinerasOrdenadas(ordenadas);
    const filtradas = filtrarNulosEnPrecio(ordenadas, tipoCombustible);
    setLengthGasolinerasFiltradas(filtradas.length);
    setGasolineras(filtradas.slice(0, 10));
    setPages(Math.ceil(filtradas.length / 10));
    setActualPage(0);
    
  }

  return (
    <section className="app-shell">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Gasolineras baratas, sin ruido</span>
          <h1 className="hero-title">
            <img
              src="/web-app-manifest-512x512_2.png"
              alt="Gas Low Logo"
              className="hero-logo"
            />
            Gas Low
          </h1>
          <p className="hero-text">
            Filtra por comunidad, provincia, municipio y combustible con una
            interfaz mas clara, rapida y comoda en movil.
          </p>
        </div>

        <div className="hero-actions">
          <button
            className="btn btn-success btn-lg hero-button"
            onClick={() => navigate("/busca-radio")}
          >
            Buscar por radio
          </button>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">4 pasos</span>
              <span className="hero-stat-label">flujo guiado</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">10</span>
              <span className="hero-stat-label">resultados por pagina</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">Maps</span>
              <span className="hero-stat-label">atajo directo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="glass-panel search-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Busqueda por municipio</p>
              <h2 className="panel-title">Encuentra la mejor opcion</h2>
            </div>
            <p className="panel-description">
              Avanza paso a paso y obten un listado ordenado por precio.
            </p>
          </div>

          <div className="stepper-wrapper">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`stepper-item ${
                  index === activeStep
                    ? "active"
                    : index < activeStep
                    ? "completed"
                    : ""
                }`}
                onClick={() => {
                  if (index < activeStep) setActiveStep(index);
                  if (index === 0) {
                    setSelectedCCAA("");
                    setSelectedProvincia("");
                    setSelectedMunicipio("");
                    setSelectedCombustible("");}
                  if (index === 1){
                    setSelectedProvincia("");
                    setSelectedMunicipio("");
                    setSelectedCombustible("");
                  }
                  if (index === 2){
                    setSelectedMunicipio("");
                    setSelectedCombustible("");
                  }
                  if (index === 3){
                    setSelectedCombustible("");
                  }
                  if (index < 3) {
                    setGasolineras([]);
                    setGasolinerasOrdenadas([]);
                  }
                  if (index === 5) {
                    setPages(0);
                    setActualPage(0);
                  }
                }}
              >
                <div className="step-counter">{index + 1}</div>
                <div className="step-name">{label}</div>
              </div>
            ))}
          </div>

          <div className="selection-summary">
            <span className={comunidadSeleccionada ? "summary-pill active" : "summary-pill"}>
              {comunidadSeleccionada || "Comunidad"}
            </span>
            <span className={selectedProvincia ? "summary-pill active" : "summary-pill"}>
              {selectedProvincia || "Provincia"}
            </span>
            <span className={municipioSeleccionado ? "summary-pill active" : "summary-pill"}>
              {municipioSeleccionado || "Municipio"}
            </span>
            <span className={selectedCombustible ? "summary-pill active" : "summary-pill"}>
              {selectedCombustible || "Combustible"}
            </span>
          </div>

          {activeStep === 0 && (
            <div className="control-panel">
              <label className="control-label">Comunidad autonoma</label>
              <select
                className="form-select app-select"
                onChange={(e) => {
                  setSelectedCCAA(e.target.value);
                  handleNext();
                }}
              >
                <option value="">Selecciona tu comunidad autonoma</option>
                {CCAA.map((ccaa) => (
                  <option key={ccaa.IDCCAA} value={ccaa.IDCCAA}>
                    {ccaa.CCAA}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedCCAA && activeStep === 1 && (
            <div className="control-panel">
              <label className="control-label">Provincia</label>
              <select
                className="form-select app-select"
                onChange={(e) => {
                  setSelectedProvincia(e.target.value);
                  handleNext();
                }}
              >
                <option value="">Selecciona tu provincia</option>
                {Provincias.filter((prov) => prov.IDCCAA === selectedCCAA).map(
                  (prov) => (
                    <option key={prov.IDProvincia} value={prov.IDProvincia}>
                      {prov.Provincia}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {selectedProvincia && activeStep === 2 && (
            <div className="control-panel">
              <label className="control-label">Municipio</label>
              <select
                className="form-select app-select"
                onChange={(e) => {
                  setSelectedMunicipio(e.target.value);
                  handleNext();
                }}
              >
                <option value="">Selecciona tu municipio</option>
                {Municipios.filter((m) => m.Provincia === selectedProvincia).map(
                  (m) => (
                    <option key={m.IDMunicipio} value={m.IDMunicipio}>
                      {m.Municipio}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {selectedMunicipio && activeStep === 3 && (
            <div className="control-panel">
              <label className="control-label">Combustible</label>
              <select
                className="form-select app-select"
                onChange={(e) => {
                  setSelectedCombustible(e.target.value);
                  if (GasolinerasOrdenadas.length > 0) {
                    reordenarGasolinerasPorPrecio(
                      GasolinerasOrdenadas,
                      e.target.value
                    );
                    setActiveStep(4);
                    setActualPage(0);
                  }
                  handleNext();
                }}
              >
                <option value="">Selecciona el tipo de combustible</option>
                {Combustibles.map((comb) => (
                  <option value={comb.Tipo} key={comb.Tipo}>
                    {comb.Tipo}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedMunicipio && activeStep === 4 && gasolineras.length === 0 && (
            <div className="cta-row">
              <button className="btn btn-primary btn-lg cta-button" onClick={buscarGasolineras}>
                Buscar gasolineras
              </button>
            </div>
          )}
        </div>

        <aside className="glass-panel info-panel">
          <p className="panel-kicker">Resumen</p>
          <h3 className="info-title">Tu consulta actual</h3>
          <div className="info-list">
            <div className="info-item">
              <span>Zona</span>
              <strong>{municipioSeleccionado || provinciaSeleccionada || "Pendiente"}</strong>
            </div>
            <div className="info-item">
              <span>Combustible</span>
              <strong>{selectedCombustible || "Pendiente"}</strong>
            </div>
            <div className="info-item">
              <span>Resultados</span>
              <strong>{LengthGasolinerasFiltradas || 0}</strong>
            </div>
          </div>
          
        </aside>
      </div>

      {activeStep >= 4 && gasolineras.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <div>
              <p className="panel-kicker">Resultados</p>
              <h2 className="panel-title">Gasolineras encontradas</h2>
            </div>
            {gasolineras.length > 0 && (
              <p className="results-count">
                Mostrando {actualPage * 10 + 1} - {actualPage * 10 + gasolineras.length}
                de {LengthGasolinerasFiltradas}
              </p>
            )}
          </div>

          <div className="results-grid">
            {gasolineras &&
              gasolineras.map(
                (g) =>
                  g[`Precio ${selectedCombustible}`] !== null && (
                    <article className="station-card" key={g.IDEESS}>
                      <div className="station-card__top">
                        <div>
                          <p className="station-brand">{g["Rótulo"]}</p>
                          <p className="station-address">
                            {g["Dirección"]}, {g.Localidad} ({g.Provincia})
                          </p>
                        </div>
                        <div className="price-badge">
                          <span>Precio</span>
                          <strong>{g[`Precio ${selectedCombustible}`]}</strong>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-success station-map-button"
                        onClick={async () => {
                          let placeId = await getGasolineraId(g);
                          window.open(
                            `https://www.google.com/maps/place/?q=place_id:${placeId}`,
                            "_blank"
                          );
                        }}
                      >
                        Ver en mapa
                      </button>
                    </article>
                  )
              )}
          </div>

          {GasolinerasOrdenadas.length > 0 && (
            <div className="pagination-panel">
              {gasolineras.length > 0 ? (
                <>
                  <div className="pagination-actions">
                    {actualPage > 0 && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => recalcularGasolineras(-1)}
                      >
                        Anterior
                      </button>
                    )}
                    {actualPage < pages - 1 && (
                      <button
                        className="btn btn-primary"
                        onClick={() => recalcularGasolineras(1)}
                      >
                        Siguiente
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <p className="empty-state">
                  No se encontraron gasolineras en este municipio o con {selectedCombustible}.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default App;
