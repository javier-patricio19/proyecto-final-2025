import React from 'react';
import styles from '../../styles/stylesObservacion/ListaObservaciones.module.css'; 

const FiltrosSeccion = ({ 
    searchTerm, setSearchTerm, 
    filterTramo, setFilterTramo, 
    filterElemento, setFilterElemento, 
    filterEstado, setFilterEstado,
    sortBy, setSortBy,
    tramos, elementos, estados, onClear 
}) => {
    return (
        <div className={styles.filtersContainer}>
            <input 
                type="text"
                placeholder="🔍 Buscar por descripción, kilómetro, recomendación..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className={styles.selectGroup}>
                <select className={styles.filterSelect} onChange={(e) => setFilterTramo(e.target.value)} value={filterTramo}>
                    <option value="Todos">Todos los tramos</option>
                    {tramos.map(t => <option key={t.id} value={t.id}>{t.inicio} - {t.destino}</option>)}
                </select>

                <select className={styles.filterSelect} onChange={(e) => setFilterElemento(e.target.value)} value={filterElemento}>
                    <option value="Todos">Todos los elementos</option>
                    {elementos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>

                <select className={styles.filterSelect} onChange={(e) => setFilterEstado(e.target.value)} value={filterEstado}>
                    {estados.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select className={styles.filterSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="fecha_desc">📅 Más reciente</option>
                    <option value="km_asc">🛣️ KM Ascendente</option>
                    <option value="id_desc">🔢 ID más reciente</option>
                </select>

                <button onClick={onClear} className={styles.btnClear}>Limpiar Filtros</button>
            </div>
        </div>
    );
};

export default FiltrosSeccion;