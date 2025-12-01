import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FormularioDatos() {
  const [datos, setDatos] = useState('');

  // Lógica del formulario, envío a la API de Node, etc.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', datos);
    // Aquí harías una llamada fetch/axios a tu backend (ej: /api/guardar)
  };

  return (
    <div>
      <h1>Página de Llenado de Datos</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Datos a ingresar:
          <input type="text" value={datos} onChange={(e) => setDatos(e.target.value)} />
        </label>
        <button type="submit">Guardar</button>
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

export default FormularioDatos;