export function ordenarGasolinerasPorPrecio(gasolineras, tipoCombustible) {
   let GasolinerasOrdenadas;
      gasolineras = gasolineras.map(cambioComaPorPunto); //convertimos comas a puntos para poder ordenarlas si hiciera falta y para mantener 
      //una armonía en el formato
      if (tipoCombustible){
       GasolinerasOrdenadas = gasolineras.sort((a, b) => a[`Precio ${tipoCombustible}`] - b[`Precio ${tipoCombustible}`]);
       return GasolinerasOrdenadas;
      }
};
export function cambioComaPorPunto(gasolinera){
    //la api nos devuelve los precios con coma y en JS tenemos que convertirlos a punto para poder hacer operaciones matematicas
    for (const key in gasolinera) {
      if (gasolinera.hasOwnProperty(key) && typeof gasolinera[key] === "string" && (key.startsWith("Precio") || key === "Latitud" || key === "Longitud (WGS84)")) {
        gasolinera[key] = gasolinera[key].replace(",", ".");
      }
    }
    return gasolinera;
  }
export function filtrarNulosEnPrecio(gasolineras, tipoCombustible) {
  return gasolineras.filter((gasolinera) => {
    const precio = gasolinera[`Precio ${tipoCombustible}`];
    return precio !== null && precio !== undefined;
  });
}