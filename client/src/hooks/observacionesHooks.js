import { useState, useEffect, use } from "react";
import { fetchObservaciones, updateObservacion, deleteObservacion } from "../services/observacionesService";

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
                if (onSuccessCallback) onSuccessCallback(id);
            } catch (err) {
                alert(`Error al eliminar la observación: ${err.message}`);
            }
        }
    };
    return { handleDelete };
};
