import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchObservacionById } from "../../services/observacionesService"; 
import styles from "../../styles/stylesObservacion/ObservacionModal.module.css";

const ObservacionModal = ({ observacionId, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchObservacionById(observacionId);
                setData(result);
            } catch (error) {
                console.error("Error cargando observación:", error);
            } finally {
                setLoading(false);
            }
        };
        if (observacionId) loadData();
    }, [observacionId]);

    const verEnMapa = () => {
        if (!data.lat || !data.lng) {
            toast.info("Esta observación no tiene coordenadas GPS.");
            return;
        }
        onClose();
        navigate(`/?lat=${data.lat}&lng=${data.lng}&zoom=18&id=${data.id}`);
    };

    if (!observacionId) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (loading) return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p className={styles.loadingText}>Cargando detalles...</p>
            </div>
        </div>
    );

    if (!data) return null;

    const fechaFormato = new Date(data.fecha).toLocaleDateString("es-MX", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>
                            {data.codigo || `Observación #${data.id}`}
                        </h2>
                        <span className={styles.dateBadge}>📅 {fechaFormato}</span>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[data.estado?.replace(/\s+/g, '')]}`}>
                        {data.estado}
                    </span>
                </div>

                <hr className={styles.divider} />

                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <label>🛣️ Tramo:</label>
                        <p>{data.tramo ? `${data.tramo.inicio} - ${data.tramo.destino}` : "No especificado"}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <label>🏗️ Elemento:</label>
                        <p>{data.elemento ? data.elemento.nombre : "General"}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <label>📍 Ubicación Exacta:</label>
                        <p>KM {data.kilometro} • Cuerpo {data.cuerpo} • Carril {data.carril}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <label>📡 GPS:</label>
                        {data.lat && data.lng ? (
                            <button 
                                type="button"
                                onClick={verEnMapa}
                                className={styles.gpsLink}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    padding: 0, 
                                    cursor: 'pointer', 
                                    font: 'inherit',
                                    textAlign: 'left'
                                }}
                            >
                                {data.lat.toFixed(5)}, {data.lng.toFixed(5)} ↗
                            </button>
                        ) : (
                            <p className={styles.muted}>Sin coordenadas</p>
                        )}
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.detailsSection}>
                    <div className={styles.detailBlock}>
                        <h3>📝 Observación Corta</h3>
                        <p>{data.observacion_corta || "---"}</p>
                    </div>
                    
                    <div className={styles.detailBlock}>
                        <h3>📄 Detalle Completo</h3>
                        <p className={styles.longText}>{data.observacion}</p>
                    </div>

                    <div className={styles.detailBlock}>
                        <h3>💡 Recomendación</h3>
                        <p className={styles.recommendationText}>{data.recomendacion}</p>
                    </div>
                </div>

                {data.imagenes && data.imagenes.length > 0 && (
                    <div className={styles.gallerySection}>
                        <h3>📸 Evidencia Fotográfica ({data.imagenes.length})</h3>
                        <div className={styles.imageScroll}>
                            {data.imagenes.map((img) => (
                                <div key={img.id} className={styles.imgWrapper}>
                                    <img src={img.ruta} alt="Evidencia" onClick={() => window.open(img.ruta, '_blank')} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObservacionModal;
