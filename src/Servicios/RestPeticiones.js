export async function obtenerGasolinerasPorMunicipio(idMunicipio) {
  const response = await fetch(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${idMunicipio}`);
  const data = await response.json();
  return data;
}
