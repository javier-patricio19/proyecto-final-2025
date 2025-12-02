import {useState, useEffect} from 'react';
import {fetchTramos, crearTramos} from '../services/tramosService';

export const useFetchTramos = () => {
    const [tramos, setTramos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchTramos();
                console.log("Hook useFetchTramos: Datos recibidos:", data);
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
