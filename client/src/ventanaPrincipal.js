import React from 'react';
import { Link } from 'react-router-dom';

function VentanaPrincipal() {
  return (
    <div>
      <h1>Ventana Principal del Proyecto</h1>
      <p>Bienvenido a la aplicación. Usa el botón para ir al formulario.</p>
      
      {/* El componente Link funciona como un <a> pero maneja el enrutamiento interno */}
      <Link to="/llenar-datos">
        <button>
          Ir a llenar datos
        </button>
      </Link>
      <div>
        <Link to="/datos">
          <button>
            mostrar datos
          </button>
        </Link>
      </div>
    </div>
  );
}

export default VentanaPrincipal;