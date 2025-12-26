import React from 'react';
import styles from '../../styles/FiltrosSeccion.module.css'; 

const FiltrosSeccion = ({ 
    tramos, 
    elementos, 
    filtros, 
    onChange, 
    onLimpiar 
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    placeholder="Buscar por Código descripción, km, recomendación..."
                    value={filtros.busqueda}
                    onChange={(e) => onChange('busqueda', e.target.value)}
                    className={styles.searchInput}
                />
            </div>
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

                <button onClick={onLimpiar} className={styles.btnClear}>
                    Limpiar
                </button>
            </div>
        </div>
    );
};

export default FiltrosSeccion;