import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { 
    fetchObservaciones, updateObservacion, deleteObservacion, 
    crearObservacion, fetchObservacionById, deleteImagen 
} from "../services/observacionesService";
import { toast } from 'react-toastify';

export const useFetchObservaciones = () => {
    const [observaciones, setObservaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const data = await fetchObservaciones();
                if(mounted) { setObservaciones(data); setLoading(false); }
            } catch (err) {
                if(mounted) { setError(err); setLoading(false); }
            }
        };
        load();
        return () => { mounted = false; };
    }, []);
    return { observaciones, loading, error };
};

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
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [imagenes, setImagenes] = useState(null);
    const [encurso, setEncurso] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState(null);

    const obtenerUbicacionGPS = () => {
        if (!navigator.geolocation) return toast.error("Sin soporte GPS");
        navigator.geolocation.getCurrentPosition(
            (pos) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); toast.success("Ubicación OK"); },
            (err) => toast.error("Error GPS: " + err.message)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imagenes || imagenes.length === 0) return setErrorEnvio('Falta imagen');
        setEncurso(true); setErrorEnvio(null);

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
        formData.append('lat', lat);
        formData.append('lng', lng);
        for (let i = 0; i < imagenes.length; i++) formData.append('imagenes', imagenes[i]);

        try {
            const res = await crearObservacion(formData);
            if (onSuccessCallback) onSuccessCallback(res);
            // Reset
            setTramoId(''); setElementoId(''); setKilometro(''); setCuerpo('');
            setCarril(''); setFecha(new Date().toISOString().slice(0, 10));
            setObservacion(''); setObservacionCorta(''); setRecomendacion('');
            setImagenes(null);
        } catch (err) { setErrorEnvio(err.message); }
        finally { setEncurso(false); }
    };
    return {
        tramoId, setTramoId, elementoId, setElementoId, kilometro, setKilometro,
        cuerpo, setCuerpo, carril, setCarril, fecha, setFecha, observacion, setObservacion,
        observacionCorta, setObservacionCorta, recomendacion, setRecomendacion, imagenes, setImagenes,
        encurso, errorEnvio, lat, setLat, lng, setLng, obtenerUbicacionGPS, handleSubmit
    };
};

export const useUpdateObservacion = (observacionId, onSuccessCallback) => {
    const [tramoId, setTramoId] = useState('');
    const [elementoId, setElementoId] = useState('');
    const [kilometro, setKilometro] = useState('');
    const [cuerpo, setCuerpo] = useState('');
    const [carril, setCarril] = useState('');
    const [fecha, setFecha] = useState('');
    const [observacion, setObservacion] = useState('');
    const [observacionCorta, setObservacionCorta] = useState('');
    const [recomendacion, setRecomendacion] = useState('');
    const [estado, setEstado] = useState(''); 
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [imagenesNuevas, setImagenesNuevas] = useState(null); 
    const [imagenesExistentes, setImagenesExistentes] = useState([]);
    const [imagenesEliminarIds, setImagenesEliminarIds] = useState([]);
    const [encurso, setEncurso] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    const handleRemoveExistingImage = (id) => {
        setImagenesEliminarIds(prev => [...prev, id]);
        setImagenesExistentes(prev => prev.filter(img => img.id !== id));
    };

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const data = await fetchObservacionById(observacionId);
                if (mounted) {
                    setTramoId(data.tramoId); setElementoId(data.elementoId);
                    setKilometro(data.kilometro); setCuerpo(data.cuerpo); setCarril(data.carril);
                    setFecha(new Date(data.fecha).toISOString().slice(0, 10));
                    setObservacion(data.observacion); setObservacionCorta(data.observacion_corta);
                    setRecomendacion(data.recomendacion); setEstado(data.estado);
                    setImagenesExistentes(data.imagenes || []);
                    setLat(data.lat || ''); setLng(data.lng || '');
                    setLoadingData(false);
                }
            } catch (err) { if(mounted) { setErrorEnvio("Error carga"); setLoadingData(false); } }
        };
        load();
        return () => { mounted = false; };
    }, [observacionId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEncurso(true); setErrorEnvio(null);
        try {
            if (imagenesEliminarIds.length > 0) await Promise.all(imagenesEliminarIds.map(id => deleteImagen(id)));
            
            const formData = new FormData();
            formData.append('tramoId', tramoId); formData.append('elementoId', elementoId);
            formData.append('kilometro', kilometro); formData.append('cuerpo', cuerpo);
            formData.append('carril', carril); formData.append('fecha', new Date(fecha).toISOString());
            formData.append('observacion', observacion); formData.append('observacion_corta', observacionCorta);
            formData.append('recomendacion', recomendacion); formData.append('estado', estado);
            formData.append('lat', lat); formData.append('lng', lng);
            if(imagenesNuevas) for (let i = 0; i < imagenesNuevas.length; i++) formData.append('imagenes', imagenesNuevas[i]);

            const res = await updateObservacion(observacionId, formData);
            if (onSuccessCallback) onSuccessCallback(res);
        } catch (err) { setErrorEnvio(err.message); }
        finally { setEncurso(false); }
    };
    return {
         tramoId, setTramoId, elementoId, setElementoId, kilometro, setKilometro,
        cuerpo, setCuerpo, carril, setCarril, fecha, setFecha, observacion, setObservacion,
        observacionCorta, setObservacionCorta, recomendacion, setRecomendacion, 
        estado, setEstado, imagenesNuevas, setImagenesNuevas, imagenesExistentes, handleRemoveExistingImage,
        encurso, errorEnvio, lat, setLat, lng, setLng, handleSubmit, loadingData
    };
};

export const useDeleteObservacion = (onSuccessCallback) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar?', text: `ID: ${id}`,
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#d33', confirmButtonText: 'Sí'
        });
        if (result.isConfirmed) {
            setDeleting(true);
            try {
                await deleteObservacion(id);
                toast.info("Eliminado.");
                if (onSuccessCallback) onSuccessCallback(id);
            } catch (err) { toast.error(err.message); }
            finally { setDeleting(false); }
        }
    };
    return { deleting, handleDelete };
};