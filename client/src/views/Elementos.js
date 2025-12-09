import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetchElementos } from "../hooks/elementosHook";
import { ListaElementos, AgregarElemento, EditarElemento } from "../components/elementosComponents";

function Elementos() {
    const { elementos: fetchedElementos, loading, error } = useFetchElementos();
    const [listaElementos, setListaElementos] = useState([]);
    const [editingElemento, setEditingElemento] = useState(null);

    useEffect(() => {
        if (fetchedElementos) {
            setListaElementos(fetchedElementos);
        }
    }, [fetchedElementos]);

    const handleDataChange = (elementoModificadoEliminado) => {
        if (typeof elementoModificadoEliminado === "object") {
            const exists = listaElementos.some( t=> t.id === elementoModificadoEliminado.id );
            if (exists) {
                setListaElementos((prevlist) =>
                    prevlist.map((t) => t.id === elementoModificadoEliminado.id ? elementoModificadoEliminado : t)
                );
                alert("Elemento Actualizado con éxito");
            } else {
                setListaElementos((prevlist) => [...prevlist, elementoModificadoEliminado]);
                alert("Elemento agregado con éxito");
            }
        } else if (typeof elementoModificadoEliminado === "number" || typeof elementoModificadoEliminado === "string") {
            const idToDelete = elementoModificadoEliminado;
            setListaElementos((prevlist) => prevlist.filter((t) => t.id !== idToDelete));
        }  

        setEditingElemento(null);
    };


    const handleEditClick = (elemento) => {
        setEditingElemento(elemento);
    };

    return (
        <div>
            {editingElemento ? (
                <EditarElemento
                    elemento={editingElemento}
                    onDataUpdatedCallback={handleDataChange}
                    onCancel={() => setEditingElemento(null)}
                />
            ) : (
                <AgregarElemento onDataAddedCallback={handleDataChange} />
            )}
            <hr />
            <ListaElementos
                elementos={listaElementos}
                loading={loading}
                error={error}
                onEdit={handleEditClick}
                onDataChangeCallback={handleDataChange}
            />

            <hr />
            <Link to="/">
                <button>Volver a ventana principal</button>
            </Link>
        </div>
    );
}

export default Elementos;