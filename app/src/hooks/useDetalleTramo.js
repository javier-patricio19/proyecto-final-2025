export const useDetalleTramo = (navigation, routeParams) => {
    // Extraemos los datos que vienen de la pantalla anterior
    const { tramoId, tramoNombre } = routeParams;

    // Acción 1: Ir a capturar evidencia
    const irACaptura = () => {
        navigation.navigate('CapturaCamara', { tramoId, tramoNombre });
    };

    // Acción 2: Ver lista de lo capturado
    const irALista = () => {
        navigation.navigate('ListaObservaciones', { tramoId });
    };

    return {
        tramoNombre,
        irACaptura,
        irALista
    };
};