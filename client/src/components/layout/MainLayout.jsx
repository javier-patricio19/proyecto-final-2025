import React from "react";
import { Link, Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import styles from "../../styles/stylesLayouts/MainLayout.module.css";

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
        <div className={styles.navLinksContainer}>
            {/* Puedes agregar un Logo aquí si quieres */}
            <div className={styles.brandContainer}>
            {/* AQUÍ AGREGAS LA IMAGEN */}
            <img 
                src="/logo.png" 
                alt="Logo" 
                className={styles.navLogo} 
            />
        </div>
            <Link to="/" className={styles.navItem}>Inicio</Link>
            <Link to="/observacion" className={styles.navItem}>Agregar Observación</Link>
            <Link to="/VerObservaciones" className={styles.navItem}>Ver Lista</Link>
            <Link to="/imagenes" className={styles.navItem}>Galería</Link>
            <Link to="/gestion" className={styles.navItem}>Gestión</Link>
        </div>
        
        <div className={styles.navActions}>
            <ThemeToggle />
        </div>
    </nav>
  );
};

export const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Menú Gestión</h3>
            <Link to="/gestion/Tramos" className={styles.sidebarLink}>📍 Tramos</Link>
            <Link to="/gestion/Elementos" className={styles.sidebarLink}>🚧 Elementos</Link>
        </aside>
    );
};

export const DashboardLayout = () => {
    return (
        <div className={styles.dashboardContainer}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
}