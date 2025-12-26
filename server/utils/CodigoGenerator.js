export const generarCodigoObservacion = (tramo, fecha, cantidadExistentes) => {
    const inicio = tramo.inicio ? tramo.inicio.charAt(0).toUpperCase() : 'X';
    const destino = tramo.destino ? tramo.destino.charAt(0).toUpperCase() : 'X';
    const fechaObj = new Date(fecha);
    const year = fechaObj.getFullYear().toString().slice(-2);
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0'); 
    const day = String(fechaObj.getDate()).padStart(2, '0');
    const fechaCodigo = `${day}${month}${year}`;
    const nuevoConsecutivo = String(cantidadExistentes + 1).padStart(2, '0');

    return `${inicio}${destino}${fechaCodigo}-${nuevoConsecutivo}`;
};