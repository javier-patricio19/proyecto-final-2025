import { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { fetchTramos, crearTramos, updateTramo, deleteTramo } from '../services/tramosService';
import { toast } from 'react-toastify';

export const useFetchTramos = () => {
    const [tramos, setTramos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const data = await fetchTramos();
                if(mounted) { setTramos(data); setLoading(false); }
            } catch (err) {
                if(mounted) { setError(err); setLoading(false); }
            }
        };
        load();
        return () => { mounted = false; };
    }, []);
    return { tramos, loading, error };
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
        try {
            const nuevo = await crearTramos({inicio, destino});
            setInicio(''); setDestino('');
            if (onSuccessCallback) onSuccessCallback(nuevo);
        } catch (err) { setError(err.message); }
        finally { setEncurso(false); }
    };
    return { inicio, setInicio, destino, setDestino, encurso, error, handleSubmit };
};

export const useUpdateTramo = (onSuccessCallback) => {
    const [encursoUpdate, setEncursoUpdate] = useState(false);
    const [errorUpdate, setErrorUpdate] = useState(null);

    const handleUpdateSubmit = async (event, id, data) => {
        event.preventDefault();
        setEncursoUpdate(true);
        setErrorUpdate(null);
        try {
            const actualizado = await updateTramo(id, data);
            if (onSuccessCallback) onSuccessCallback(actualizado);
        } catch (err) { setErrorUpdate(err.message); }
        finally { setEncursoUpdate(false); }
    };
    return { encursoUpdate, errorUpdate, handleUpdateSubmit };
};

export const useDeleteTramo = (onSuccessCallback) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?', text: `Se eliminará ID: ${id}`,
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#d33', confirmButtonText: 'Eliminar'
        });

        if (result.isConfirmed) {
            setDeleting(true);
            try {
                await deleteTramo(id);
                if (onSuccessCallback) onSuccessCallback(id);
            } catch (err) { toast.error(err.message); }
            finally { setDeleting(false); }
        }
    };
    return { deleting, handleDelete };
};