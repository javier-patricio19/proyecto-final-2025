import React,{ useState, useEffect } from "react";
import { useFetchObservaciones } from "../hooks/observacionesHooks";
import { ListaObservaciones } from "../components/observaciones/ListaObservaciones";
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
        if (typeof dataModifiedOrId === 'object' && dataModifiedOrId !== null ) {
            setListaObservaciones((prevList) => 
                prevList.map((item) =>
                    item.id === dataModifiedOrId.id ? dataModifiedOrId : item
                )
            );
        } else {
            const idToDelete = dataModifiedOrId;
            setListaObservaciones((prevList) => prevList.filter((item) => item.id !== idToDelete));
        }
    };

    const handreEditClick = (observacion) => {
        navigate(`/editarObservaciones/${observacion.id}`);
    };

    return (
        <div style={{padding: '20px'}}>
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