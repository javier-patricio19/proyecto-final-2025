import React,{ useState, useEffect } from "react";
import { useFetchObservaciones } from "../hooks/observacionesHooks";
import { ListaObservaciones } from "../components/observacionesComponents";
import { useNavigate } from "react-router-dom";

function VerObservaciones() {
    const { observaciones: fetchedObservaciones, loading, error } = useFetchObservaciones();
    const [listaObservaciones, setListaObservaciones] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (fetchedObservaciones) {
            setListaObservaciones(fetchedObservaciones);
        }
     }, [fetchedObservaciones]);

    const handleDataChange = (dataModifiedOrId) => {
        if (typeof dataModifiedOrId === 'number' || typeof dataModifiedOrId === 'string') {
            const idToDelete = dataModifiedOrId;
            setListaObservaciones(prevList => prevList.filter(item => item.id !== idToDelete));
        }
    };

    const handreEditClick = (observacion) => {
        navigate(`/editarObservaciones/${observacion.id}`);
    };

    return (
        <div style={{padding: '20px'}}>
            <h1>Gestión de Observaciones</h1>
            <ListaObservaciones
                observaciones={listaObservaciones}
                loading={loading}
                error={error}
                onEdit={handreEditClick}
                onDataChangeCallback={handleDataChange}
            />
        </div>
    );
}

export default VerObservaciones;