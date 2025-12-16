import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchElementos, crearElemento, updateElemento, deleteElemento } from "../services/elementosService";
import { toast } from 'react-toastify';

export const useFetchElementos = () => {
  const [elementos, setElementos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchElementos();
                setElementos(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        loadData();
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
        const dataToSend = { tipo, nombre, descripcion };

        try {
            const resultado = await crearElemento(dataToSend);
            setEncurso(false);
            if (onSuccessCallback) onSuccessCallback(resultado);
            setTipo(''); setNombre(''); setDescripcion('');
        } catch (err) {
            setError(err.message);
            setEncurso(false);
        }
    };
    return {tipo, setTipo, nombre, setNombre, descripcion, setDescripcion, encurso, error, handleSubmit };
};

export const useUpdateElemento = (onSuccessCallback) => {
    const [encursoUpdate, setEncursoUpdate] = useState(false);
    const [errorUpdate, setErrorUpdate] = useState(null);

    const handleUpdateSubmit = async (event, id, data) => {
        event.preventDefault();
        setEncursoUpdate(true);
        setErrorUpdate(null);

        try {
            const registroActualizado = await updateElemento(id, data);
            setEncursoUpdate(false);
            if (onSuccessCallback) onSuccessCallback(registroActualizado);
        } catch (err) {
            setErrorUpdate(err.message);
            setEncursoUpdate(false);
        }
    };
    return { encursoUpdate, errorUpdate, handleUpdateSubmit };
};

export const useDeleteElemento = (onSuccessCallback) => {
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Se eliminará el elemento ID: ${id}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        });
        if (result.isConfirmed) {
            try {
                await deleteElemento(id);
                toast.info("Elemento eliminado correctamente.");
                if (onSuccessCallback) onSuccessCallback(id);
            } catch (err) {
                toast.error(`Error al eliminar el elemento: ${err.message}`);
            }
        }
    };
    return { handleDelete };
};