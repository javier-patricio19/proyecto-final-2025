import { useState, useMemo } from 'react';

export const useFiltros = (datos, tramosDisponibles, elementosDisponibles) => {
    const [filtros, setFiltros] = useState({
        busqueda: '',
        tramoId: '',
        elementoId: '',
        estado: '',
        orden: 'desc'
    });

    const datosFiltrados = useMemo(() => {
        if (!datos) return [];

        return datos.filter(item => {
            const texto = filtros.busqueda.toLowerCase();
            const coincideTexto = 
                (item.codigo && item.codigo.toLowerCase().includes(texto)) ||
                item.observacion?.toLowerCase().includes(texto) ||
                item.observacion_corta?.toLowerCase().includes(texto) ||
                item.kilometro?.toLowerCase().includes(texto) ||
                item.recomendacion?.toLowerCase().includes(texto);

            const coincideTramo = filtros.tramoId ? item.tramoId === parseInt(filtros.tramoId) : true;
            const coincideElemento = filtros.elementoId ? item.elementoId === parseInt(filtros.elementoId) : true;
            const coincideEstado = filtros.estado ? item.estado === filtros.estado : true;
            return coincideTexto && coincideTramo && coincideElemento && coincideEstado;
        }).sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            return filtros.orden === 'asc' ? fechaA - fechaB : fechaB - fechaA;
        });
    }, [datos, filtros]);

    const handleChange = (campo, valor) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    };

    const limpiarFiltros = () => {
        setFiltros({
            busqueda: '',
            tramoId: '',
            elementoId: '',
            estado: '',
            orden: 'desc'
        });
    };

    return {
        filtros,
        datosFiltrados,
        handleChange,
        limpiarFiltros
    };
};