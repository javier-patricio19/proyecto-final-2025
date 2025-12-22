import React, { useState, useEffect } from "react";
import { fetchObservacionById } from "../../services/observacionesService";
import styles from '../../styles/stylesObservacion/ObservacionModal.module.css';

const ObservacionModal = ({ observacionId, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                setLoading(true);
                const details = await fetchObservacionById(observacionId);
                setData(details);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        loadDetails();
    }, [observacionId]);

    if (loading) return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} style={{textAlign: 'center'}}>
                Cargando detalles...
            </div>
        </div>
    );

    if (error) return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p style={{color: 'var(--danger)'}}>Error: {error}</p>
                <button onClick={onClose} className={styles.closeBtn}>×</button>
            </div>
        </div>
    );

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
                
                <div className={styles.modalHeader}>
                    <h2>Detalles ID: {data.id}</h2>
                </div>
                
                <div className={styles.modalBody}>
                    <p><strong>Tramo:</strong> {data.tramoNombre || "Cargando..."}</p>
                    <p><strong>Ubicación:</strong> KM {data.kilometro}, Cuerpo {data.cuerpo}, Carril {data.carril}</p>
                    <p><strong>Observación:</strong> {data.observacion}</p>
                    <p><strong>Estado:</strong> {data.estado}</p>
                    <p><strong>Recomendación:</strong> {data.recomendacion}</p>
                    
                    {data.imagenes && data.imagenes.length > 0 && (
                        <div className={styles.modalImages}>
                            {data.imagenes.map(img => (
                                <img key={img.id} src={img.ruta} alt="Evidencia" />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ObservacionModal;