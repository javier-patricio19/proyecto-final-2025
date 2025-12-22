import { useState, useMemo } from 'react';
import { useFetchObservaciones } from './observacionesHooks';
import { useFetchTramos } from "./tramosHook";

export const useGaleria = () => {
    const { observaciones, loading, error } = useFetchObservaciones();
    const { tramos } = useFetchTramos();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTramo, setFilterTramo] = useState('Todos');
    const [sortBy, setSortBy] = useState('fecha_desc');

    const galeriaFiltrada = useMemo(() => {
        if (!observaciones) return [];

        let filtered = observaciones.filter(obs => {
            const tieneImagenes = obs.imagenes && obs.imagenes.length > 0;
            const matchesTramo = filterTramo === 'Todos' || obs.tramoId === parseInt(filterTramo);
            
            const term = searchTerm.toLowerCase();
            const matchesSearch = 
                obs.observacion.toLowerCase().includes(term) ||
                (obs.observacion_corta && obs.observacion_corta.toLowerCase().includes(term)) ||
                obs.kilometro.toString().toLowerCase().includes(term) ||
                (obs.recomendacion && obs.recomendacion.toLowerCase().includes(term));

            return tieneImagenes && matchesTramo && matchesSearch;
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'fecha_desc': return new Date(b.fecha) - new Date(a.fecha);
                case 'fecha_asc': return new Date(a.fecha) - new Date(b.fecha);
                case 'km_asc': return parseFloat(a.kilometro) - parseFloat(b.kilometro);
                case 'km_desc': return parseFloat(b.kilometro) - parseFloat(a.kilometro);
                case 'id_desc': return b.id - a.id;
                case 'id_asc': return a.id - b.id;
                default: return 0;
            }
        });

        return filtered;
    }, [observaciones, searchTerm, filterTramo, sortBy]);

    const slides = useMemo(() => {
        return galeriaFiltrada.flatMap(obs =>
            (obs.imagenes || []).map(img => ({
                src: `${img.ruta}`,
                title: obs.observacion_corta || "Sin título",
                description: `ID: ${obs.id} - KM: ${obs.kilometro}`,
                obsId: obs.id 
            }))
        );
    }, [galeriaFiltrada]);

    const resetFilters = () => {
        setSearchTerm('');
        setFilterTramo('Todos');
        setSortBy('fecha_desc');
    };

    return {
        loading,
        error,
        tramos,
        galeriaFiltrada,
        slides,
        searchTerm, setSearchTerm,
        filterTramo, setFilterTramo,
        sortBy, setSortBy,
        resetFilters
    };
};