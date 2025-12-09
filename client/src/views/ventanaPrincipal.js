import React from 'react';
import { Link } from 'react-router-dom';

function VentanaPrincipal() {
  return (
    <div>
      <h1>Ventana Principal del Proyecto</h1>
      <p>Bienvenido!!.</p>
      <Link to="/Tramos">
        <button>
          Tramos
        </button>
      </Link>
      <Link to="/Elementos">
        <button>
          Elementos
        </button>
      </Link>
    </div>
  );
}

export default VentanaPrincipal;