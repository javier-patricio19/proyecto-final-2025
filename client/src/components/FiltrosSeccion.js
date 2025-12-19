import React from 'react';
import '../styles/Observaciones.css'

const FiltrosSeccion = ({ 
    searchTerm, setSearchTerm, 
    filterTramo, setFilterTramo, 
    filterElemento, setFilterElemento, 
    filterEstado, setFilterEstado,
    sortBy, setSortBy,
    tramos, elementos, estados, onClear 
}) => {
    return (
        <div className="filters-container">
            <input 
                type="text"
                placeholder="Buscar por descripción, kilómetro, recomendación..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="select-group">
                <select onChange={(e) => setFilterTramo(e.target.value)} value={filterTramo}>
                    <option value="Todos">Todos los tramos</option>
                    {tramos.map(t => <option key={t.id} value={t.id}>{t.inicio} - {t.destino}</option>)}
                </select>
                <select onChange={(e) => setFilterElemento(e.target.value)} value={filterElemento}>
                    <option value="Todos">Todos los elementos</option>
                    {elementos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
                <select onChange={(e) => setFilterEstado(e.target.value)} value={filterEstado}>
                    {estados.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="fecha_desc">Más reciente</option>
                    <option value="km_asc">KM Ascendente</option>
                    <option value="id_desc">ID más reciente</option>
                </select>
                <button onClick={onClear} className="btn-clear">Limpiar</button>
            </div>
        </div>
    );
};

export default FiltrosSeccion;