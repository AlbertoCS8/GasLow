import { useState } from 'react'
import CCAA from "../src/ApiData/CCAA.json"
import Provincias from "../src/ApiData/Provincias.json"
import Municipios from "../src/ApiData/Municipios.json"
import './App.css'
import { obtenerGasolinerasPorMunicipio } from './Servicios/RestPeticiones.js'

function App() {
  let [selectedCCAA, setSelectedCCAA] = useState("");
  let [selectedProvincia, setSelectedProvincia] = useState("");
  let [selectedMunicipio, setSelectedMunicipio] = useState("");
  let [gasolineras, setGasolineras] = useState([]);

  function buscarGasolineras() {
    // let codigoPostal = document.querySelector('input').value;
    // alert(`Buscando gasolineras en ${codigoPostal}...`);
    console.log(selectedCCAA, selectedProvincia, selectedMunicipio);
    //hacemos pet con servicio pasandole el idMunicipio
    obtenerGasolinerasPorMunicipio(selectedMunicipio).then(gasolineras => {
      setGasolineras(gasolineras.ListaEESSPrecio);
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
    });
  }

  return (
    <>
        <h1>Gas Low</h1>
        <p>Encuentra gasolineras cerca de ti a un precio razonable y sin anuncios.</p>
        {/* de momento vamos a hacerlo seleccionando el municipio y ya despues lo hare con proximidad y eso*/}
        <select placeholder="Selecciona tu CCAA" onChange={(e) => {setSelectedCCAA(e.target.value);}}>
          <option value="">Selecciona tu comunidad autónoma</option>
          {CCAA.map((ccaa) => (
            <option key={ccaa.IDCCAA} value={ccaa.IDCCAA}>
              {ccaa.CCAA}
            </option>
          ))}
        </select>
        {selectedCCAA && (
          <select onChange={(e) => {setSelectedProvincia(e.target.value); }}>
            <option value="">Selecciona tu provincia</option>
            {Provincias.filter(provincia => provincia.IDCCAA === selectedCCAA).map((provincia) => (
              <option key={provincia.IDProvincia} value={provincia.IDProvincia}>
                {provincia.Provincia}
              </option>
            ))}
          </select>
        )}
        {selectedProvincia && (
          <select onChange={(e) => setSelectedMunicipio(e.target.value)}>
            <option value="">Selecciona tu municipio</option>
            {Municipios.filter(municipio => municipio.Provincia === selectedProvincia).map((municipio) => (
              <option key={municipio.IDMunicipio} value={municipio.IDMunicipio}>
                {municipio.Municipio}
              </option>
            ))}
          </select>
        )}
        {selectedMunicipio && (
          <button onClick={() => buscarGasolineras()}>Buscar</button>
        )}
        <div>
          {gasolineras && (gasolineras.map((gasolinera) => (
            <div key={gasolinera.IDEESS}>
              <h2>{gasolinera.Rótulo}</h2>
              <p>Precio Gasóleo A: {gasolinera["Precio Gasoleo A"]}</p>
              <p>Precio Gasolina 95 E5: {gasolinera["Precio Gasolina 95 E5"]}</p>
              
            </div>
          )))}
        </div>
          {/*De momento vamos a dejarlo asi, en futuras actualizaciones mejoraremos estetica y filtros aparte de llevarte directo a maps  */}

    </>
  )
}


export default App

