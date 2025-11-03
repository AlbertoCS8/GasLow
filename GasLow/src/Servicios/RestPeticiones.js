export async function obtenerGasolinerasPorMunicipio(idMunicipio) {
  // const response = await fetch(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${idMunicipio}`);
  // Antes usabamos una api externa pero ha evolucionado y ahora usaremos nuestra base de datos que nos permitirá hacer mas funciones como la de buscar por un radio de km
  const response = await fetch(`http://localhost:3000/gasolineras/municipio/${idMunicipio}`);
  const data = await response.json();
  return data;
}
export async function obtenerGasolinerasPorRadio(ubicacion, radioKm, combustible) {
  const response = await fetch(`http://localhost:3000/gasolineras/radio?lat=${ubicacion.lat}&lng=${ubicacion.lng}&radio=${radioKm}&combustible=${combustible}`);
  const data = await response.json();
  return data;
}
