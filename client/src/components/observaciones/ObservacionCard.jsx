import React from 'react';
import ActionDrop from "./ActionDrop";
import styles from '../../styles/stylesObservacion/ObservacionCard.module.css';

const ObservacionCard = ({ 
    item, onEdit, onDelete, onStatusClick, onSelect, 
    isSelected, onViewMap, onPrint, onExpand, 
    getTramoNombre, getElementoNombre, 
}) => {
    
    const getStatusClass = (estado) => {
        const normalized = estado?.toLowerCase();
        if (normalized === 'reportado') return styles.statusReportado;
        if (normalized === 'en proceso') return styles.statusEnProceso;
        if (normalized === 'completado') return styles.statusCompletado;
        return styles.statusDefault;
    };

    return (
        <div className={`${styles.obsCard} ${isSelected ? styles.selected : ''}`}>
            
            {/* 1. CABECERA: Checkbox a la izq, Menú a la der */}
            <div className={styles.cardHeader}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(item.id)}
                    className={styles.obsCheckbox}
                />
                <div className={styles.headerActions}>
                     <ActionDrop item={item} onEdit={onEdit} onDelete={onDelete} />
                </div>
            </div>

            {/* 2. IMAGEN: Ocupa todo el ancho */}
            <div className={styles.obsImgContainer} onClick={() => onExpand(item.id)}>
                {item.imagenes && item.imagenes.length > 0 ? (
                    <img src={item.imagenes[0].ruta} alt="Evidencia" loading="lazy" />
                ) : (
                    <div className={styles.noImage}>Sin foto</div>
                )}
                
                {/* Badge de estado flotando sobre la imagen */}
                <span 
                    onClick={(e) => { e.stopPropagation(); onStatusClick(item); }} 
                    className={`${styles.statusBadge} ${getStatusClass(item.estado)}`}
                    title="Clic para cambiar estado"
                >
                    {item.estado}
                </span>
            </div>

            {/* 3. INFORMACIÓN: Cuerpo de la tarjeta */}
            <div className={styles.obsBody} onClick={() => onExpand(item.id)}>
                <h4 className={styles.obsTitle}>
                    {item.codigo}
                </h4>
                <p className={styles.obsTramo}>
                    {getTramoNombre(item.tramoId)}
                </p>
                
                <div className={styles.obsDetails}>
                    <p><strong>Elemento:</strong> {getElementoNombre(item.elementoId)}</p>
                    <p><strong>Ubicación:</strong> KM {item.kilometro} • {item.cuerpo} • Carril {item.carril}</p>
                </div>
            </div>

            {/* 4. PIE DE PÁGINA: Acciones rápidas */}
            <div className={styles.cardFooter}>
                <button className={styles.iconBtn} onClick={(e) => {e.stopPropagation(); onViewMap(item)}} title="Ver en mapa">
                    📍 <span className={styles.btnLabel}>Mapa</span>
                </button>
                <button className={styles.iconBtn} onClick={(e) => {e.stopPropagation(); onPrint([item])}} title="Ver PDF">
                    📄 <span className={styles.btnLabel}>PDF</span>
                </button>
                <button className={styles.iconBtn} onClick={(e) => {e.stopPropagation(); onExpand(item.id)}} title="Detalles">
                    🔍 <span className={styles.btnLabel}>Ver</span>
                </button>
            </div>
        </div>
    );
};

export default ObservacionCard;