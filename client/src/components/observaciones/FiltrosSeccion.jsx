import React, { useState, useEffect } from 'react';
import styles from '../../styles/FiltrosSeccion.module.css'; 

const FiltrosSeccion = ({ 
    tramos, 
    elementos, 
    filtros, 
    onChange, 
    onLimpiar 
}) => {
    // Estado local para lo que el usuario escribe inmediatamente
    const [busquedaLocal, setBusquedaLocal] = useState(filtros.busqueda);

    // 1. Efecto Debounce: Espera 500ms antes de avisar al componente padre
    useEffect(() => {
        const timer = setTimeout(() => {
            if (busquedaLocal !== filtros.busqueda) {
                onChange('busqueda', busquedaLocal);
            }
        }, 500); // Medio segundo de espera

        return () => clearTimeout(timer);
    }, [busquedaLocal, onChange, filtros.busqueda]);

    // 2. Sincronizar si se limpia desde fuera (botón Limpiar)
    useEffect(() => {
        setBusquedaLocal(filtros.busqueda);
    }, [filtros.busqueda]);

    return (
        <div className={styles.container}>
            {/* Buscador de Texto */}
            <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    placeholder="Buscar por código, descripción, km..."
                    value={busquedaLocal}
                    onChange={(e) => setBusquedaLocal(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* Grid de Selectores */}
            <div className={styles.filtersGrid}>
                
                <div className={styles.selectWrapper}>
                    <select 
                        value={filtros.tramoId} 
                        onChange={(e) => onChange('tramoId', e.target.value)}
                        className={styles.select}
                    >
                        <option value="">🛣️ Todos los Tramos</option>
                        {tramos.map(t => (
                            <option key={t.id} value={t.id}>{t.inicio} - {t.destino}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.selectWrapper}>
                    <select 
                        value={filtros.elementoId} 
                        onChange={(e) => onChange('elementoId', e.target.value)}
                        className={styles.select}
                    >
                        <option value="">🏗️ Todos los Elementos</option>
                        {elementos.map(e => (
                            <option key={e.id} value={e.id}>{e.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.selectWrapper}>
                    <select 
                        value={filtros.estado} 
                        onChange={(e) => onChange('estado', e.target.value)}
                        className={styles.select}
                    >
                        <option value="">📌 Todos los Estados</option>
                        <option value="Reportado">Reportado</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Completado">Completado</option>
                    </select>
                </div>

                <div className={styles.selectWrapper}>
                    <select 
                        value={filtros.orden} 
                        onChange={(e) => onChange('orden', e.target.value)}
                        className={styles.select}
                    >
                        <option value="desc">📅 Más recientes</option>
                        <option value="asc">📅 Más antiguos</option>
                    </select>
                </div>

                <button onClick={onLimpiar} className={styles.btnClear} title="Restablecer todos los filtros">
                    🗑️ Limpiar
                </button>
            </div>
        </div>
    );
};

export default FiltrosSeccion;