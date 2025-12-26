import { useState, useEffect } from 'react';
import { useFetchTramos } from '../hooks/tramosHook';
import { toast } from 'react-toastify';
import { ListaTramos } from '../components/tramos/ListaTramos';
import { AgregarTramo } from '../components/tramos/AgregarTramo';
import { EditarTramo } from '../components/tramos/EditarTramo';

function Tramos() {
  useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
  const { tramos: fetchedTramos, loading, error } = useFetchTramos();
  const [listaTramos, setListaTramos] = useState([]);
  const [editingTramo, setEditingTramo] = useState(null);

  useEffect(() => {
    if (fetchedTramos) {
      setListaTramos(fetchedTramos);
    }
  }, [fetchedTramos]);

  const handleDataChange = (tramoModificadoEliminado) => {
    if (typeof tramoModificadoEliminado === 'object') {
      const exits = listaTramos.some(t => t.id === tramoModificadoEliminado.id);
      
      if (exits) {
        setListaTramos(prevlist =>
          prevlist.map(t => t.id === tramoModificadoEliminado.id ? tramoModificadoEliminado : t)
        );
        toast.success("Tramo Actualizado con éxito");
      } else {

        setListaTramos(prevlist => [...prevlist, tramoModificadoEliminado]);
        toast.success("Tramo agregado con éxito");
      }
    } else if (typeof tramoModificadoEliminado === 'number' || typeof tramoModificadoEliminado === 'string') {
      const idToDelete = tramoModificadoEliminado;
      setListaTramos(prevlist => prevlist.filter(t => t.id !== idToDelete));
      toast.info("Tramo eliminado con éxito");
    }

    setEditingTramo(null);
  };

  const handleEditClick = (tramo) => {
    setEditingTramo(tramo); 
  };

  return (
    <div style={{ padding: '20px' }}> 
      <h1 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Gestión de Tramos</h1>

      {editingTramo ? (
          <EditarTramo 
            tramo={editingTramo} 
            onDataUpdatedCallback={handleDataChange}
            onCancel={() => setEditingTramo(null)}
          />
      ) : (
          <AgregarTramo onDataAddedCallback={handleDataChange} />
      )}
      
      <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid var(--border-color)' }} />
      
      <ListaTramos 
        tramos={listaTramos} 
        loading={loading} 
        error={error} 
        onEdit={handleEditClick} 
        onDataChangeCallback={handleDataChange}
      />
    </div>
  );
}

export default Tramos;