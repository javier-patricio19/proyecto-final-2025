export const generarCodigoObservacion = (tramo, fecha, cantidadExistentes) => {
    if (!tramo) {
        return `UNK-${Date.now()}`;
    }

    const inicio = tramo.inicio ? tramo.inicio.charAt(0).toUpperCase() : 'X';
    const destino = tramo.destino ? tramo.destino.charAt(0).toUpperCase() : 'X';
    const fechaObj = new Date(fecha);
    const year = fechaObj.getUTCFullYear().toString().slice(-2);
    const month = String(fechaObj.getUTCMonth() + 1).padStart(2, '0'); 
    const day = String(fechaObj.getUTCDate()).padStart(2, '0');
    const fechaCodigo = `${day}${month}${year}`;
    const nuevoConsecutivo = String(cantidadExistentes + 1).padStart(2, '0');

    return `${inicio}${destino}${fechaCodigo}-${nuevoConsecutivo}`;
};