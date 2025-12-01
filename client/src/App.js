import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VentanaPrincipal from './ventanaPrincipal';
import FormularioDatos from './formulario';
import Datos from './datos';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<VentanaPrincipal />} />
        {/* Ruta para el formulario de datos */}
        <Route path="/llenar-datos" element={<FormularioDatos />} />
        {/*Ruta para ver los datos*/}
        <Route path="/datos" element={<Datos />} />
      </Routes>
    </Router>
  );
}

export default App;