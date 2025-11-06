import { act, useState } from "react";
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
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
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
    <>
      <h1>Gas Low</h1>
      <p className="descripcion">
        Encuentra gasolineras cerca de ti a un precio razonable y sin anuncios.
      </p>
      <button onClick={() => navigate("/busca-radio")}>
        Busca gasolineras cercanas
      </button>
      {/* Al clicar el boton 1 el index corresponde a 0*/}
      <Stepper activeStep={activeStep} className="Stepper">
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step
              key={label}
              {...stepProps}
              onClick={() => {
                if (index < activeStep) setActiveStep(index);
                if (index < 3) {setGasolineras([]); setGasolinerasOrdenadas([]);}
                if (index == 5) {
                  setPages(0);
                  setActualPage(0);
                }
              }}
            >
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === 0 ? (
        <select
          className="form-select w-auto"
          onChange={(e) => {
            setSelectedCCAA(e.target.value);
            handleNext();
          }}
        >
          <option value="">Selecciona tu comunidad autónoma</option>
          {CCAA.map((ccaa) => (
            <option key={ccaa.IDCCAA} value={ccaa.IDCCAA}>
              {ccaa.CCAA}
            </option>
          ))}
        </select>
      ) : null}
      {selectedCCAA && activeStep === 1 ? (
        <select
          className="form-select w-auto"
          onChange={(e) => {
            setSelectedProvincia(e.target.value);
            handleNext();
          }}
        >
          <option value="">Selecciona tu provincia</option>
          {Provincias.filter(
            (provincia) => provincia.IDCCAA === selectedCCAA
          ).map((provincia) => (
            <option key={provincia.IDProvincia} value={provincia.IDProvincia}>
              {provincia.Provincia}
            </option>
          ))}
        </select>
      ) : null}
      {selectedProvincia && activeStep === 2 ? (
        <select
          className="form-select w-auto"
          onChange={(e) => {
            setSelectedMunicipio(e.target.value);
            handleNext();
          }}
        >
          <option value="">Selecciona tu municipio</option>
          {Municipios.filter(
            (municipio) => municipio.Provincia === selectedProvincia
          ).map((municipio) => (
            <option key={municipio.IDMunicipio} value={municipio.IDMunicipio}>
              {municipio.Municipio}
            </option>
          ))}
        </select>
      ) : null}
      {selectedMunicipio && activeStep === 3 ? (
        <select
          className="form-select w-auto"
          onChange={(e) => {
            setSelectedCombustible(e.target.value);
            if (GasolinerasOrdenadas.length > 0) {
              reordenarGasolinerasPorPrecio(
                //cuando ya hay gasolineras cargadas y se cambia SOLO el combustible
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
          {/* <option value="Gasoleo A">Gasoleo A</option>
            <option value="Gasolina 95 E5">Gasolina 95 E5</option> */}
          {Combustibles.map((combustible) => (
            <option value={combustible.Tipo} key={combustible.Tipo}>
              {combustible.Tipo}
            </option>
          ))}
        </select>
      ) : null}
      {selectedMunicipio && activeStep === 4 && gasolineras.length === 0 ? (
        <button
          onClick={() => {
            buscarGasolineras();
          }}
        >
          Buscar
        </button>
      ) : null}
      <div>
        {gasolineras &&
          activeStep >= 4 &&
          gasolineras.map(
            (gasolinera) =>
              gasolinera[`Precio ${selectedCombustible}`] !== null && (
                <div key={gasolinera.IDEESS}>
                  <h2>{gasolinera.Rótulo}</h2>
                  <p>
                    {gasolinera.Dirección}, {gasolinera.Localidad} (
                    {gasolinera.Provincia})
                  </p>
                  {
                    <p>
                      Precio {selectedCombustible}:{" "}
                      {gasolinera[`Precio ${selectedCombustible}`]}
                    </p>
                  }
                  {/*#region
                   <p>Click aquí para ver en Google Maps <a href={`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${gasolinera.Rótulo}&inputtype=textquery&locationbias=point:${gasolinera.Latitud},${gasolinera.Longitud}&fields=place_id,name,geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`}>enlace</a></p> 
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-icon lucide-map" onClick={async () => {window.open(`https://www.google.com/maps/search/?api=1&query=${gasolinera.Latitud},${gasolinera["Longitud (WGS84)"]},${gasolinera.Rótulo},${gasolinera.Provincia},${gasolinera.Localidad},${gasolinera.Dirección}`, "_blank"); }}>
                  <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/>
                  <path d="M15 5.764v15"/>
                  <path d="M9 3.236v15"/>
                  </svg>
                  Version con link directo a maps (sin usar el backend){/* onClick={async () => {
                  #endregion*/}
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
              )
          )}
      </div>
      <div>
        {activeStep >= 4 && GasolinerasOrdenadas.length > 0 && 
          (gasolineras.length > 0 ? (
            <>
              {actualPage < pages - 1 && (
                <button onClick={() => recalcularGasolineras(1)}>
                  Siguiente
                </button>
              )}
              {actualPage > 0 && (
                <button onClick={() => recalcularGasolineras(-1)}>
                  Anterior
                </button>
              )}
              <p>{`Mostrando ${actualPage * 10 + 1} - ${
                actualPage * 10 + gasolineras.length
              } de ${LengthGasolinerasFiltradas}`}</p>
            </>
          ) : (
            <p>
              No se encontraron gasolineras en este municipio o con {selectedCombustible}.
            </p>
          ))}
      </div>
      {/*De momento vamos a dejarlo asi, en futuras actualizaciones mejoraremos estetica y filtros aparte de llevarte directo a maps  */}
    </>
  );
}

export default App;
