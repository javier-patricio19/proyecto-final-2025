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

  const handleDataChange = (tramoModificado) => {
    const exits = listaTramos.some(t => t.id === tramoModificado.id);

    if (exits) {
      setListaTramos(prevlist =>
        prevlist.map(t => t.id === tramoModificado.id ? tramoModificado : t)
      );
      alert("Tramo Actualizado con éxito")
    } else {
      setListaTramos(prevlist => [...prevlist, tramoModificado]);
      alert("Tramo agregado con éxito");
    }

    setEditingTramo(null);
  };


  /*const handleNewDataAdded = (tramoNuevo) => {
    setListaTramos(prevlist => [...prevlist, tramoNuevo]);
    alert("tramo agregado con éxito");
  };*/

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
      />
      
      <hr />
      <Link to="/">
        <button>Volver a ventana principal</button>
      </Link>
    </div>
  );

}

export default Tramos;