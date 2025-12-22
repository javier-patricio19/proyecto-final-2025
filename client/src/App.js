import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Slide, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import Dashboard from './views/Dashboard';
import Tramos from './views/Tramos';
import Elementos from "./views/Elementos";
import AgregarObservacion from './views/AgregarObservacion';
import VerObservaciones from "./views/VerObservaciones";
import EditarObservaciones from './views/EditarObservacion';
import GaleriaImagenes from "./views/GaleriaImagenes";
import { Navbar, DashboardLayout } from './components/layout/MainLayout';

function App() {
  return (
      <Router>
        <Navbar />
        
        <Routes>
          {/* Vista Principal (Mapa) */}
          <Route path="/" element={<Dashboard />} />

          {/* Rutas de Observaciones */}
          <Route path="/observacion" element={<AgregarObservacion />} />
          <Route path="/VerObservaciones" element={<VerObservaciones />} />
          <Route path="/editarObservaciones/:id" element={<EditarObservaciones />} />
          <Route path="/imagenes" element={<GaleriaImagenes />} />

          {/* Rutas de Gestión (Con Sidebar) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Tramos />} />
            <Route path="Tramos" element={<Tramos />} />
            <Route path="Elementos" element={<Elementos />} />
          </Route>
        </Routes>

        <ToastContainer 
            position='top-right' 
            autoClose={1500} 
            theme='colored'
            transition={Slide} 
            closeOnClick 
            newestOnTop 
        />
      </Router>
  );
}

export default App;