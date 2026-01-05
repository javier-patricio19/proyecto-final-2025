import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchObservacionById } from "../../services/observacionesService";
import styles from "../../styles/stylesObservacion/ObservacionModal.module.css";

const ObservacionModal = ({ observacionId, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Nuevo estado para errores
    const navigate = useNavigate();

    // 1. Cargar datos
    useEffect(() => {
        const loadData = async () => {
            if (!observacionId) return;
            setLoading(true);
            setError(null);
            
            try {
                const result = await fetchObservacionById(observacionId);
                if (result) {
                    setData(result);
                } else {
                    setError("No se encontró la observación.");
                }
            } catch (err) {
                console.error("Error cargando observación:", err);
                setError("Ocurrió un error al cargar los detalles.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [observacionId]);

    // 2. Cerrar con tecla ESC (Mejora de UX)
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const verEnMapa = () => {
        if (!data?.lat || !data?.lng) {
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

    // Renderizado condicional
    if (loading) return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.loaderContainer}> {/* Asume que tienes un spinner o texto */}
                    <p className={styles.loadingText}>Cargando detalles...</p>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <div className={styles.errorContainer}>
                    <p>⚠️ {error}</p>
                </div>
            </div>
        </div>
    );

    if (!data) return null;

    // Formateo seguro de fecha
    const fechaFormato = data.fecha ? new Date(data.fecha).toLocaleDateString("es-MX", {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : "Fecha desconocida";

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
                    {/* Uso de optional chaining (?.) para evitar errores si estado es null */}
                    <span className={`${styles.statusBadge} ${styles[data.estado?.replace(/\s+/g, '') || 'default']}`}>
                        {data.estado || 'Sin Estado'}
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
                        <p>{data.elemento?.nombre || "General"}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <label>📍 Ubicación Exacta:</label>
                        <p>KM {data.kilometro ?? '--'} • Cuerpo {data.cuerpo ?? '--'} • Carril {data.carril ?? '--'}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <label>📡 GPS:</label>
                        {data.lat && data.lng ? (
                            <button 
                                type="button"
                                onClick={verEnMapa}
                                className={styles.gpsLink}
                                // Moví los estilos inline a una clase idealmente, pero los dejé aquí por respeto al código original
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', textAlign: 'left', color: '#007bff' }}
                            >
                                {Number(data.lat).toFixed(5)}, {Number(data.lng).toFixed(5)} ↗
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
                        <p className={styles.longText}>{data.observacion || "Sin detalles adicionales."}</p>
                    </div>

                    <div className={styles.detailBlock}>
                        <h3>💡 Recomendación</h3>
                        <p className={styles.recommendationText}>{data.recomendacion || "Sin recomendaciones."}</p>
                    </div>
                </div>

                {data.imagenes?.length > 0 && (
                    <div className={styles.gallerySection}>
                        <h3>📸 Evidencia Fotográfica ({data.imagenes.length})</h3>
                        <div className={styles.imageScroll}>
                            {data.imagenes.map((img, index) => (
                                <div key={img.id || index} className={styles.imgWrapper}>
                                    <img 
                                        src={img.ruta} 
                                        alt={`Evidencia ${index + 1}`}
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.style.display = 'none'; // Ocultar si falla
                                        }}
                                    />
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