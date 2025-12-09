import {useState, useEffect} from 'react';
import {fetchTramos, crearTramos, updateTramo, deleteTramo} from '../services/tramosService';

export const useFetchTramos = () => {
    const [tramos, setTramos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchTramos();
                setTramos(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
    
        loadData();
    }, []);

    return {tramos, loading, error };
};

export const useFormTramos = (onSuccessCallback) => {
    const [inicio, setInicio] = useState('');
    const [destino, setDestino] = useState('');
    const [encurso, setEncurso] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setEncurso(true);
        setError(null);

        const dataToSend = {inicio, destino};

        try {
            const nuevoRegitro = await crearTramos(dataToSend);

            setInicio('');
            setDestino('');
            setEncurso(false);

            if (onSuccessCallback) {
                onSuccessCallback(nuevoRegitro);
            }
        } catch (err) {
            setError(err.message);
            setEncurso(false);
        }
    };

    return {
        inicio, setInicio,
        destino, setDestino,
        encurso,
        error,
        handleSubmit,
    };
};

export const useUpdateTramo = (onSuccessCallback) => {
    const [encursoUpdate, setEncursoUpdate] = useState(false);
    const [errorUpdate, setErrorUpdate] = useState(null);

    const handleUpdateSubmit = async (event, id, data) => {
        event.preventDefault();
        setEncursoUpdate(true);
        setErrorUpdate(null);

        try {
            const registroActualizado = await updateTramo(id, data);
            
            setEncursoUpdate(false);
            if (onSuccessCallback) {
                onSuccessCallback(registroActualizado);
            }

        } catch (err) {
            setErrorUpdate(err.message);
            setEncursoUpdate(false);
        }
    };

    return {
        encursoUpdate,
        errorUpdate,
        handleUpdateSubmit,
    };
};

export const useDeleteTramo = (onSuccessCallback) => {
    const handleDelete = async (id) => {
        if (window.confirm(`¿Estás seguro de querer eliminar el tramo ID: ${id}?`)) {
            try {
                await deleteTramo(id);
                alert("Tramo eliminado con éxito."); 
                if (onSuccessCallback) {
                    onSuccessCallback(id);
                }
            } catch (err) {
                alert(`Error al eliminar: ${err.message}`);
            }   
        }
    };
    return { handleDelete };
};