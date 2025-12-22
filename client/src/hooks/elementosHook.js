import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchElementos, crearElemento, updateElemento, deleteElemento } from "../services/elementosService";
import { toast } from 'react-toastify';

export const useFetchElementos = () => {
    const [elementos, setElementos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const data = await fetchElementos();
                if(mounted) { setElementos(data); setLoading(false); }
            } catch (err) {
                if(mounted) { setError(err); setLoading(false); }
            }
        };
        load();
        return () => { mounted = false; };
    }, []);
    return { elementos, loading, error };
};

export const useCrearElemento = (onSuccessCallback) => {
    const [tipo, setTipo] = useState('');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [encurso, setEncurso] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setEncurso(true);
        setError(null);
        try {
            const res = await crearElemento({ tipo, nombre, descripcion });
            setTipo(''); setNombre(''); setDescripcion('');
            if (onSuccessCallback) onSuccessCallback(res);
        } catch (err) { setError(err.message); }
        finally { setEncurso(false); }
    };
    return { tipo, setTipo, nombre, setNombre, descripcion, setDescripcion, encurso, error, handleSubmit };
};

export const useUpdateElemento = (onSuccessCallback) => {
    const [encursoUpdate, setEncursoUpdate] = useState(false);
    const [errorUpdate, setErrorUpdate] = useState(null);

    const handleUpdateSubmit = async (event, id, data) => {
        event.preventDefault();
        setEncursoUpdate(true);
        setErrorUpdate(null);
        try {
            const res = await updateElemento(id, data);
            if (onSuccessCallback) onSuccessCallback(res);
        } catch (err) { setErrorUpdate(err.message); }
        finally { setEncursoUpdate(false); }
    };
    return { encursoUpdate, errorUpdate, handleUpdateSubmit };
};

export const useDeleteElemento = (onSuccessCallback) => {
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
                await deleteElemento(id);
                if (onSuccessCallback) onSuccessCallback(id);
            } catch (err) { toast.error(err.message); }
            finally { setDeleting(false); }
        }
    };
    return { deleting, handleDelete };
};