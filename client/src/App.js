import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VentanaPrincipal from './views/ventanaPrincipal';
import Tramos from './views/Tramos';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<VentanaPrincipal />} />
        {/* Ruta para los tramos */}
        <Route path="/Tramos" element={<Tramos />} />
      </Routes>
    </Router>
  );
}

export default App;