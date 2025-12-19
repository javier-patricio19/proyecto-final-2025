import React from 'react';
import ActionDrop from './ActionDrop';
import '../styles/ObservacionCard.css';

const ObservacionCard = ({ 
    item, onEdit, onDelete, onStatusClick, onSelect, 
    isSelected, onViewMap, onPrint, onExpand, 
    getTramoNombre, getElementoNombre, 
}) => {
    const statusClass = `status-badge status-${item.estado.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className={`obs-card ${isSelected ? 'selected' : ''}`}>
            <div className="obs-card-left">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(item.id)}
                    className="obs-checkbox"
                />
                <div className="obs-img-container">
                    {item.imagenes && item.imagenes.length > 0 ? (
                        <img src={`${item.imagenes[0].ruta}`} alt={item.observacion_corta} />
                    ) : (
                        <span>Sin imagen</span>
                    )}
                </div>
                <div className="obs-info">
                    <span 
                        onClick={() => onStatusClick(item)} 
                        className={statusClass}
                        title="Clic para cambio rápido"
                    >
                        ✎ {item.estado}
                    </span>
                    <p className="obs-tramo">Tramo: {getTramoNombre(item.tramoId)}</p>
                    <p className="obs-details">
                        KM: {item.kilometro} | Cuerpo: {item.cuerpo} | Carril: {item.carril} | {getElementoNombre(item.elementoId)}
                    </p>
                </div>
            </div>
            
            <div className="obs-top-right-action">
                <ActionDrop item={item} onEdit={onEdit} onDelete={onDelete} />
            </div>
            <div className="obs-bottom-right-actions">
                <button onClick={() => onViewMap(item)} title="Ver en mapa">📍</button>
                <button onClick={() => onPrint([item])} title="PDF">📄</button>
                <button onClick={() => onExpand(item.id)} title="Detalles">🔍</button>
            </div>
        </div>
    );
};

export default ObservacionCard;
