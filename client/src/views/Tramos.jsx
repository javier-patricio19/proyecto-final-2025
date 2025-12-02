import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {useFetchTramos} from '../hooks/tramosHook';
import { ListaTramos, AgregarTramo } from '../components/tramosComponents';

function Tramos(){
  const { tramos: fetchedTramos, loading, error } = useFetchTramos();
  const [listaTramos, setListaTramos] = useState([]);

  useEffect(() => {
    if (fetchedTramos) {
      setListaTramos(fetchedTramos);
    }
  }, [fetchedTramos]);

  const handleNewDataAdded = (tramoNuevo) => {
    setListaTramos(prevlist => [...prevlist, tramoNuevo]);
    alert("tramo agregado con éxito");
  };
  return(
    <div>
      <AgregarTramo onDataAddedCallback={handleNewDataAdded} />
      <hr />
      <ListaTramos tramos={listaTramos} loading={loading} error={error}/>
      <hr />
      <Link to="/">
        <button>Volver a ventana principal</button>
      </Link>
    </div>
  );

}

export default Tramos;