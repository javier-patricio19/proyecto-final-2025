import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import styles from "../../styles/stylesLayouts/MainLayout.module.css";

export const Navbar = () => {
    // Estado para controlar el menú en móvil
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.brandContainer}>
                <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className={styles.navLogo} 
                />
            </div>

            {/* Botón Hamburguesa (Solo visible en móvil por CSS) */}
            <button className={styles.hamburger} onClick={toggleMenu}>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </button>

            {/* Links de Navegación */}
            <div className={`${styles.navLinksContainer} ${isOpen ? styles.open : ''}`}>
                <Link to="/" className={styles.navItem} onClick={toggleMenu}>Inicio</Link>
                <Link to="/observacion" className={styles.navItem} onClick={toggleMenu}>Agregar Observación</Link>
                <Link to="/VerObservaciones" className={styles.navItem} onClick={toggleMenu}>Ver Lista</Link>
                <Link to="/imagenes" className={styles.navItem} onClick={toggleMenu}>Galería</Link>
                <Link to="/gestion" className={styles.navItem} onClick={toggleMenu}>Gestión</Link>
                
                {/* Toggle visible solo dentro del menú móvil */}
                <div className={styles.mobileActions}>
                     <ThemeToggle />
                </div>
            </div>

            {/* Toggle visible solo en escritorio (A la derecha) */}
            <div className={styles.desktopActions}>
                <ThemeToggle />
            </div>
        </nav>
    );
};

export const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Menú Gestión</h3>
            <div className={styles.sidebarContent}>
                <Link to="/gestion/Tramos" className={styles.sidebarLink}>📍 Tramos</Link>
                <Link to="/gestion/Elementos" className={styles.sidebarLink}>🚧 Elementos</Link>
            </div>
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