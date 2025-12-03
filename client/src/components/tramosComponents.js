import React, { useState, useEffect } from 'react';
import {useUpdateTramo, useFormTramos} from '../hooks/tramosHook';

export const ListaTramos = ({tramos, loading, error, onEdit }) => {
  if (loading) return <p>Cargando Tramos...</p>;
  if (error) return <p>Error al cargar: {error.message}</p>;

  return(
    <div>
      <h2>Lista de Tramos ({tramos.length} elementos)</h2>
      {tramos.length === 0 ? (
        <p>No hay tramos registrados aún.</p>
      ) : (
        <ul>
        {tramos.map(item => (
          <li key={item.id}>
            {item.inicio} - {item.destino}
            <button onClick={() => onEdit(item)} style={{marginLeft: '10px'}}>Editar</button>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export const AgregarTramo = ({ onDataAddedCallback}) => {
  const {
    inicio, setInicio,
    destino, setDestino,
    encurso,
    error,
    handleSubmit,
  } = useFormTramos(onDataAddedCallback);

  return(
    <form onSubmit={handleSubmit}>
      <h1>Tramos</h1>
      <hr />
      <h2>Tramo Nuevo</h2>
      <div>
        <label>
          inicio de tramo:
          <input type="text" value={inicio} onChange={ (e) => setInicio(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          destino de tramo:
          <input type='text' value={destino} onChange={(e) => setDestino(e.target.value)} required />
        </label>
      </div>

      <button type='submit' disabled={encurso}>
        {encurso ? 'Guardando...' : 'Guardar Tramo'}
      </button>
      {error && <p style={{ color : 'red'}}>{error}</p>}
    </form>
  );
};

export const EditarTramo = ({ tramo, onDataUpdatedCallback, onCancel }) => {
    const [inicio, setInicio] = useState(tramo.inicio);
    const [destino, setDestino] = useState(tramo.destino);
    
    const { encursoUpdate, errorUpdate, handleUpdateSubmit } = useUpdateTramo(onDataUpdatedCallback);

    
    useEffect(() => {
        setInicio(tramo.inicio);
        setDestino(tramo.destino);
    }, [tramo]);

    const onSubmit = (e) => {
        const data = { inicio, destino };
        handleUpdateSubmit(e, tramo.id, data);
    };

    return (
        <form onSubmit={onSubmit}>
            <h2>Editar Tramo ID: {tramo.id}</h2>
            <div>
                <label>
                    Inicio:
                    <input type="text" value={inicio} onChange={(e) => setInicio(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                    Destino:
                    <input type='text' value={destino} onChange={(e) => setDestino(e.target.value)} required />
                </label>
            </div>
            <button type='submit' disabled={encursoUpdate}>
                {encursoUpdate ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
            <button type="button" onClick={onCancel} style={{marginLeft: '10px'}}>
                Cancelar
            </button>
            {errorUpdate && <p style={{ color: 'red' }}>{errorUpdate}</p>}
        </form>
    );
};