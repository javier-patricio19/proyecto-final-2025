import { useState, useEffect } from 'react';
import {useUpdateTramo, useFormTramos, useDeleteTramo} from '../hooks/tramosHook';

export const ListaTramos = ({tramos, loading, error, onEdit, onDataChangeCallback }) => {
  const {deleting, handleDelete } = useDeleteTramo(onDataChangeCallback);
  if (loading) return <p>Cargando Tramos...</p>;
  if (error) return <p>Error al cargar: {error.message}</p>;

  const tableStyle = { borderCollapse: 'collapse', width: '100%' };
  const thTdStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' };
  const thStyle = { ...thTdStyle, backgroundColor: '#f2f2f2' };

  return(
    <div>
      <h2>Lista de Tramos ({tramos.length} elementos)</h2>
      {deleting && <p>eliminando elemento...</p>}

      {tramos.length === 0 ? (
        <p>No hay tramos registrados aún.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Inicio</th>
              <th style={thStyle}>Destino</th>
              <th style={thStyle}>Editar</th>
              <th style={thStyle}>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {tramos.map(item => (
              <tr key={item.id}>
                <td style={thTdStyle}>{item.id}</td>
                <td style={thTdStyle}>{item.inicio}</td>
                <td style={thTdStyle}>{item.destino}</td>
                <td style={thTdStyle}>
                  <button onClick={() => onEdit(item)} style={{ marginRight: '5px' }} disabled={deleting}>
                    Editar
                  </button>
                </td>
                <td style={thTdStyle}>
                  <button onClick={() => handleDelete(item.id)} style={{ color: 'red' }} disabled={deleting}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

  const formGroupStyle = { display: 'flex', gap: '15px', alignItems: 'flex-end' };
  const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
  const buttonStyle = { padding: '8px 12px' };

  return(
    <form onSubmit={handleSubmit}>
      <h1>Tramos</h1>
      <hr />
      <h2>Tramo Nuevo</h2>
      <div style={formGroupStyle}>
        <div>
          <label style={{display: 'block', marginBottom: '5px'}}>
            inicio de tramo:
            <input type="text" value={inicio} onChange={ (e) => setInicio(e.target.value)} style={inputStyle} required />
          </label>
        </div>
        
        <div>
          <label style={{display: 'block', marginBottom: '5px'}}>
            destino de tramo:
            <input type='text' value={destino} onChange={(e) => setDestino(e.target.value)} style={inputStyle} required />
          </label>
        </div>
      </div>

      <button type='submit' disabled={encurso} style={buttonStyle}>
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

    const formGroupStyle = { display: 'flex', gap: '15px', alignItems: 'flex-end' };
    const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
    const buttonStyle = { padding: '8px 12px' };

    return (
        <form onSubmit={onSubmit}>
            <h2>Editar Tramo ID: {tramo.id}</h2>
            <div style={formGroupStyle}>
              <div>
                <label style={{display: 'block', marginBottom: '5px'}}>
                    Inicio:
                    <input type="text" value={inicio} onChange={(e) => setInicio(e.target.value)} style={inputStyle} required />
                </label>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px'}}>
                    Destino:
                    <input type='text' value={destino} onChange={(e) => setDestino(e.target.value)} style={inputStyle} required />
                </label>
              </div>
            </div>  
            <button type='submit' disabled={encursoUpdate} style={buttonStyle}>
                {encursoUpdate ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
            <button type="button" onClick={onCancel} style={buttonStyle}>
                Cancelar
            </button>
            {errorUpdate && <p style={{ color: 'red' }}>{errorUpdate}</p>}
        </form>
    );
};

