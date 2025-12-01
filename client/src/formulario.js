import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AgregarTramo({onDataAdded}) {
  const [inicio, setinicio] = useState('');
  const [destino, setDestino] = useState('');
  const [encurso, setEncurso] = useState(false);
  const [error, setError] = useState(null);

  
  const handleSubmit = async(event) => {
    event.preventDefault();
    setEncurso(true);
    setError(null);

    const update = new Date().toISOString();

    const dataToSend = {
      inicio,
      destino,
      updated_at: update,
    }

    try {
      const response = await fetch("/api/agregarTramos", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      if(!response.ok){
        const errorDatos = await response.json();
        throw new Error(errorDatos.error || 'fallo al agregar el dato');
      }

      const nuevoRegitro = await response.json();
      setinicio('');
      setDestino('');
      setEncurso(false);

      if(onDataAdded){
        onDataAdded(nuevoRegitro);
      }
      
    } catch (error) {
      console.error("error en fetch POST:", error);
      setError(error.message);
      setEncurso(false);
    }
  };

  return (
    <div>
      <h1>Página de Llenado de Datos</h1>
      <form onSubmit={handleSubmit}>
        <h2>Nuevo Tramo</h2>
        <div>
          <label>
            Inicio de tramo:
            <input 
            type="text" 
            value={inicio} 
            onChange={(e) => setinicio(e.target.value)}
            required
            />
          </label>
        </div>
        <div>
          <label>
            Destino de tramo:
            <input 
            type="text" 
            value={destino} 
            onChange={(e) => setDestino(e.target.value)}
            required
            />
          </label>
        </div>

        <button type="submit" disabled={encurso}>
          {encurso ? 'Guardando...' : 'Guardar Tramo'}
        </button>
      </form>
      
      {/* Botón para regresar */}
      <Link to="/">
        <button>
          Volver a la principal
        </button>
      </Link>
    </div>
  );
}

export default AgregarTramo;