import { useState, useEffect } from "react";
import { useFetchElementos } from "../hooks/elementosHook";
import { toast } from 'react-toastify';
import { ListaElementos } from "../components/elementos/ListaElementos";
import { AgregarElemento } from "../components/elementos/AgregarElemento";
import { EditarElemento } from "../components/elementos/EditarElemento";
import { usePageTitle } from "../hooks/usePageTitle";

function Elementos() {
    usePageTitle("Elementos");
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
            const exists = listaElementos.some(t => t.id === elementoModificadoEliminado.id);
            if (exists) {
                setListaElementos((prevlist) =>
                    prevlist.map((t) => t.id === elementoModificadoEliminado.id ? elementoModificadoEliminado : t)
                );
                toast.success("Elemento Actualizado con éxito");
            } else {
                setListaElementos((prevlist) => [...prevlist, elementoModificadoEliminado]);
                toast.success("Elemento agregado con éxito");
            }
        } else if (typeof elementoModificadoEliminado === "number" || typeof elementoModificadoEliminado === "string") {
            const idToDelete = elementoModificadoEliminado;
            setListaElementos((prevlist) => prevlist.filter((t) => t.id !== idToDelete));
            toast.info("Elemento eliminado con éxito");
        }  

        setEditingElemento(null);
    };

    const handleEditClick = (elemento) => {
        setEditingElemento(elemento);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Gestión de Elementos</h1>
            
            {editingElemento ? (
                <EditarElemento
                    elemento={editingElemento}
                    onDataUpdatedCallback={handleDataChange}
                    onCancel={() => setEditingElemento(null)}
                />
            ) : (
                <AgregarElemento onDataAddedCallback={handleDataChange} />
            )}
            
            <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid var(--border-color)' }} />
            
            <ListaElementos
                elementos={listaElementos}
                loading={loading}
                error={error}
                onEdit={handleEditClick}
                onDataChangeCallback={handleDataChange}
            />
        </div>
    );
}

export default Elementos;