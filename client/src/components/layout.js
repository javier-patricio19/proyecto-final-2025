import  React  from "react";
import { Link, Outlet } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{background: '#333', color: 'white', padding:'10px 20px', display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <Link to="/" style={{color: 'white', textDecoration: 'none', fontSize: '1.2em'}}>
                Inicio
            </Link>
            <Link to="/observacion" style={{color: 'white', textDecoration: 'none', fontSize: '1.2em'}}>
                Agregar Observación
            </Link>
            <Link to="/verObservaciones" style={{color: 'white', textDecoration: 'none', fontSize: '1.2em'}}>
                Ver Observaciones
            </Link>
            <Link to="/imagenes" style={{color: 'white', textDecoration: 'none', fontSize: '1.2em'}}>
                Galería de Imágenes
            </Link>
            <Link to="/dashboard" style={{color: 'white', textDecoration: 'none', fontSize: '1.2em'}}>
                Gestión
            </Link>

        </div>
    </nav>
  );
};

const Sidebar = () => {
    const sidebarStyle = {
        width: '200px',
        background: '#f4f4f4',
        padding: '20px',
        height: 'calc(100vh - 40px)',
        boxSizing: 'border-box'
    };
    const linkStyle = { display: 'block', margin: '10px 0', color: '#333', textDecoration: 'none' };

    return (
        <div style={sidebarStyle}>
            <Link to="/dashboard/Tramos" style={linkStyle}>Tramos</Link>
            <Link to="/dashboard/Elementos" style={linkStyle}>Elementos</Link>
        </div>
    );
};

const DashboardLayout = () => {
    const layoutStyle = { display: 'flex' };
    const contentStyle = { flexGrow: 1, padding: '20px'};

    return (
        <div>
            <div style={layoutStyle}>
                <Sidebar />
                <main style={contentStyle}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export { Navbar, Sidebar, DashboardLayout };