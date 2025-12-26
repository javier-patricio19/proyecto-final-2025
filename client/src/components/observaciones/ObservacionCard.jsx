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
            
            <div className={styles.obsCardLeft}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(item.id)}
                    className={styles.obsCheckbox}
                />
                
                <div className={styles.obsImgContainer}>
                    {item.imagenes && item.imagenes.length > 0 ? (
                        <img src={item.imagenes[0].ruta} alt="Evidencia" />
                    ) : (
                        <span>Sin foto</span>
                    )}
                </div>
                
                <div className={styles.obsInfo}>
                    <span 
                        onClick={(e) => { e.stopPropagation(); onStatusClick(item); }} 
                        className={`${styles.statusBadge} ${getStatusClass(item.estado)}`}
                        title="Clic para cambiar estado"
                    >
                        {item.estado}
                    </span>
                    
                    <p className={styles.obsTramo}>
                       {item.codigo} • {getTramoNombre(item.tramoId)}
                    </p>
                    
                    <p className={styles.obsDetails}>
                        KM: {item.kilometro} • Cuerpo: {item.cuerpo} • Carril: {item.carril} <br/>
                        {getElementoNombre(item.elementoId)}
                    </p>
                </div>
            </div>
            
            <div className={styles.obsTopRightAction}>
                <ActionDrop item={item} onEdit={onEdit} onDelete={onDelete} />
            </div>
            
            <div className={styles.obsBottomRightActions}>
                <button className={styles.iconBtn} onClick={(e) => {e.stopPropagation(); onViewMap(item)}} title="Ver en mapa">📍</button>
                <button className={styles.iconBtn} onClick={(e) => {e.stopPropagation(); onPrint([item])}} title="Ver PDF">📄</button>
                <button className={styles.iconBtn} onClick={(e) => {e.stopPropagation(); onExpand(item.id)}} title="Ver detalles completos">🔍</button>
            </div>
        </div>
    );
};

export default ObservacionCard;