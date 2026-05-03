import React from "react";
import "./FondoAnimado.css";
// import logos from "../public/LogosGasolineras/*"; NO SE PUEDE HACER ASÍ
//antes lo tenia en public pero no se puede importar desde ahi, ahora en src/assets

function FondoAnimado() {
    const logos = import.meta.glob(
  "../src/assets/LogosGasolineras/*",
  { eager: true }
);
 const columnas = 8;
const logosArray = Object.values(logos);
const logosLoop = [...logosArray, ...logosArray, ...logosArray]; // x4// Repetimos los logos para un efecto continuo
    
    return (
        //No podemos renderizar directamente un objeto, por eso usamos Object.values para obtener un array con los valores de las propiedades del objeto.
        // <div className="fondo-animado">
        //   {Object.values(logos).map((logo, index) => (
        //     <div className="logo-container" key={index}>
        //       <img src={logo.default} alt="Logo Gasolinera" className="logo" />
        //     </div>
        //   ))}
        // </div>




<div className="fondo-animado">
  {Array.from({ length: columnas }).map((_, colIndex) => {
    const logosColumna = logosLoop.filter((_, index) => index % columnas === colIndex);
    const duracion = 100 + colIndex * 6;
    const direccion = colIndex % 2 === 0 ? "sube" : "baja";
    
    return (
      <div className="columna" key={colIndex}>
        {logosColumna.map((logo, logoIndex) => {
          const delay = -(logoIndex * (duracion / logosColumna.length));
          return (
            <div
              className={`logo-animado ${direccion}`}
              key={logoIndex}
              style={{
                animationDuration: `${duracion}s`,
                animationDelay: `${delay}s`
              }}
            >
              <img src={logo.default} className="logo" alt="" />
            </div>
          );
        })}
      </div>
    );
  })}
</div>



    );
}
export default FondoAnimado;