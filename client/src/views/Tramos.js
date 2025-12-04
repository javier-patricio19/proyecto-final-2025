import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {useFetchTramos} from '../hooks/tramosHook';
import { ListaTramos, AgregarTramo, EditarTramo } from '../components/tramosComponents';

function Tramos(){
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
        alert("Tramo Actualizado con éxito");
    } else {
      setListaTramos(prevlist => [...prevlist, tramoModificadoEliminado]);
      alert("Tramo agregado con éxito");
    }
    }else if (typeof tramoModificadoEliminado === 'number' || typeof tramoModificadoEliminado === 'string') {
      const idToDelete = tramoModificadoEliminado;
      setListaTramos(prevlist => prevlist.filter(t => t.id !== idToDelete));
    }

    setEditingTramo(null);
  };


  const handleEditClick = (tramo) => {
    setEditingTramo(tramo); 
  };

  return(
    <div>
      {editingTramo ? (
          <EditarTramo 
            tramo={editingTramo} 
            onDataUpdatedCallback={handleDataChange}
            onCancel={() => setEditingTramo(null)}
          />
      ) : (
          <AgregarTramo onDataAddedCallback={handleDataChange} />
      )}
      
      <hr />
      
      <ListaTramos 
        tramos={listaTramos} 
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

export default Tramos;