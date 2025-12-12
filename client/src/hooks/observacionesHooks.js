import { useState, useEffect } from "react";
import { fetchObservaciones, updateObservacion, deleteObservacion, crearObservacion } from "../services/observacionesService";

export const useObservacionForm = (onSuccessCallback) => {
    const [tramoId, setTramoId] = useState('');
    const [elementoId, setElementoId] = useState('');
    const [kilometro, setKilometro] = useState('');
    const [cuerpo, setCuerpo] = useState('');
    const [carril, setCarril] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
    const [observacion, setObservacion] = useState('');
    const [observacionCorta, setObservacionCorta] = useState('');
    const [recomendacion, setRecomendacion] = useState('');
    const [encurso, setEncurso] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState(null);
    const [imagenes, setImagenes] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imagenes || imagenes.length === 0) {
            setErrorEnvio('Por favor, seleccione al menos una imagen.');
            setEncurso(false);
            return;
        }
        setEncurso(true);
        setErrorEnvio(null);

        const formData = new FormData();
        formData.append('tramoId', tramoId);
        formData.append('elementoId', elementoId);
        formData.append('kilometro', kilometro);
        formData.append('cuerpo', cuerpo);
        formData.append('carril', carril);
        formData.append('fecha', new Date(fecha).toISOString());
        formData.append('observacion', observacion);
        formData.append('observacion_corta', observacionCorta);
        formData.append('recomendacion', recomendacion);
        formData.append('estado', 'Reportado');

        for (let i = 0; i < imagenes.length; i++) {
            formData.append('imagenes', imagenes[i]);
        }

        try {
            const nuevaObservacion = await crearObservacion(formData);
            if (onSuccessCallback) onSuccessCallback(nuevaObservacion);

            setTramoId(''); setElementoId(''); setKilometro(''); setCuerpo('');
            setCarril(''); setFecha(new Date().toISOString().slice(0, 10));
            setObservacion(''); setObservacionCorta(''); setRecomendacion('');
            setImagenes(null); setEncurso(false);
        } catch (err) {
            setErrorEnvio(err.message);
            setEncurso(false);
        }
    };

    return {
        tramoId, setTramoId, elementoId, setElementoId, kilometro, setKilometro,
        cuerpo, setCuerpo, carril, setCarril, fecha, setFecha, observacion, setObservacion,
        observacionCorta, setObservacionCorta, recomendacion, setRecomendacion, imagenes, setImagenes,
        encurso, errorEnvio, handleSubmit
    };
};

export const useFetchObservaciones = () => {
    const [observaciones, setObservaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchObservaciones();
                setObservaciones(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        loadData();
    }, []);
    return { observaciones, loading, error };
};

export const useUpdateObservacion = (onSuccessCallback) => {
    const [encursoUpdate, setencursoUpdate] = useState(false);
    const [errorUpdate, setErrorUpdate] = useState(null);

    const handleUpdateSubmit = async (event, id, data) => {
        event.preventDefault();
        setencursoUpdate(true);
        setErrorUpdate(null);
        
        try {
            const registroActualizado = await updateObservacion(id, data);
            setencursoUpdate(false);
            if (onSuccessCallback) onSuccessCallback(registroActualizado);
        } catch (err) {
            setErrorUpdate(err);
            setencursoUpdate(false);
        }
    };
    return { encursoUpdate, errorUpdate, handleUpdateSubmit };
};

export const useDeleteObservacion = (onSuccessCallback) => {
    const handleDelete = async (id) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar esta observación ID: ${id}?`)) {
            try {
                await deleteObservacion(id);
                alert("Observación eliminado correctamente.");
                if (onSuccessCallback) onSuccessCallback(id);
            } catch (err) {
                alert(`Error al eliminar la observación: ${err.message}`);
            }
        }
    };
    return { handleDelete };
};
