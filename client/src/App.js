import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VentanaPrincipal from './views/ventanaPrincipal';
import Tramos from './views/Tramos';
import Elementos from "./views/Elementos";
import AgregarObservacion from './views/AgregarObservacion';
import VerObservaciones from "./views/VerObservaciones";
import { Navbar, DashboardLayout } from './components/layout';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<VentanaPrincipal />} />
        {/*Ruta de Agregar Obsrvación*/}
        <Route path="/observacion" element={<AgregarObservacion />} />
        {/*Ruta para Gestionar Observaciones*/}
        <Route path="VerObservaciones" element={<VerObservaciones />} />
        {/*Rutas de Gestión*/}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Tramos />} />
          <Route path="Tramos" element={<Tramos />} />
          <Route path="Elementos" element={<Elementos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;