import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Slide, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import Dashboard from './views/Dashboard';
import Tramos from './views/Tramos';
import Elementos from "./views/Elementos";
import AgregarObservacion from './views/AgregarObservacion';
import VerObservaciones from "./views/VerObservaciones";
import EditarObservaciones from './views/EditarObservacion';
import { Navbar, DashboardLayout } from './components/layout';
import GaleriaImagenes from "./views/GaleriaImagenes";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Dashboard />} />
        {/*Ruta de Agregar Obsrvación*/}
        <Route path="/observacion" element={<AgregarObservacion />} />
        {/*Ruta para Gestionar Observaciones*/}
        <Route path="VerObservaciones" element={<VerObservaciones />} />
        {/*Ruta para Editar observaciones*/}
        <Route path="editarObservaciones/:id" element={<EditarObservaciones />} />
        {/*Ruta para Ver Imagenes*/}
        <Route path="/imagenes" element={<GaleriaImagenes />} />
        {/*Rutas de Gestión*/}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Tramos />} />
          <Route path="Tramos" element={<Tramos />} />
          <Route path="Elementos" element={<Elementos />} />
        </Route>
      </Routes>
      <ToastContainer position='top-right' autoClose={1500} theme='light' transition={Slide} closeOnClick newestOnTop />
    </Router>
  );
}

export default App;