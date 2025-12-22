import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import styles from '../../styles/stylesLayouts/ThemeToggle.module.css';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <button 
            className={styles.toggleBtn} 
            onClick={toggleTheme}
            title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            aria-label="Cambiar tema"
        >
            {isDarkMode ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeToggle;