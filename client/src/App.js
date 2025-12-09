import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VentanaPrincipal from './views/ventanaPrincipal';
import Tramos from './views/Tramos';
import Elementos from "./views/Elementos";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<VentanaPrincipal />} />
        {/* Ruta para los tramos */}
        <Route path="/Tramos" element={<Tramos />} />
        {/* Ruta para los elementos */}
        <Route path="/Elementos" element={<Elementos />} />
      </Routes>
    </Router>
  );
}

export default App;