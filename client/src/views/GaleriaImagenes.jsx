import React, { useState, useMemo } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import { useFetchObservaciones } from '../hooks/observacionesHooks';
import { useFetchTramos } from '../hooks/tramosHook';
import { useFetchElementos } from '../hooks/elementosHook'
import { useFiltros } from "../hooks/FiltrosSeccion";
import FiltrosSeccion from '../components/observaciones/FiltrosSeccion';
import ObservacionModal from "../components/observaciones/ObservacionModal";
import styles from '../styles/GaleriaImagenes.module.css';
import { usePageTitle } from "../hooks/usePageTitle";

function GaleriaImagenes() {
    usePageTitle("Galería");
    const { observaciones, loading, error } = useFetchObservaciones();
    const { tramos } = useFetchTramos();
    const { elementos } = useFetchElementos();

    const safeObservaciones = observaciones || [];
    const safeTramos = tramos || [];
    const safeElementos = elementos || [];

    const { 
        filtros, 
        datosFiltrados, 
        handleChange, 
        limpiarFiltros 
    } = useFiltros(safeObservaciones, safeTramos, safeElementos);

    const [index, setIndex] = useState(-1);
    const[modalId, setModalId] = useState(null);

    const slides = useMemo(() => {
        return datosFiltrados.flatMap(obs => 
            (obs.imagenes || []).map(img => ({ src: img.ruta }))
        );
    }, [datosFiltrados]);

    const handleImageClick = (src) => {
        const slideIndex = slides.findIndex(s => s.src === src);
        setIndex(slideIndex);
    };

    if (loading) return <p className={styles.loading}>Cargando galería...</p>;
    if (error) return <p className={styles.error}>Error: {error.message}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Galería de Imágenes</h1>
            <FiltrosSeccion
                tramos={safeTramos}
                elementos={safeElementos}
                filtros={filtros}
                onChange={handleChange}
                onLimpiar={limpiarFiltros}
            />
            <Lightbox
                index={index}
                slides={slides}
                open={index >= 0}
                close={() => setIndex(-1)}
                plugins={[Zoom, Counter]}
                animation={{ fade: 300 }}
                controller={{ closeOnBackdropClick: true }}
                zoom={{ maxZoomPixelRatio: 3, zoomInMultiplier: 2 }}
            />
            {datosFiltrados.length > 0 ? (
                datosFiltrados.map(obs => {
                    if (!obs.imagenes || obs.imagenes.length === 0) return null;
                    
                    return (
                        <div key={obs.id} className={styles.groupContainer}>
                            <h3 
                                className={`${styles.groupHeader} ${styles.clickableHeader}`}
                                onClick={() => setModalId(obs.id)}
                                title="Click para ver detalles completos"
                            >
                                <span>Reporte: {obs.codigo || `ID ${obs.id}`}</span> 
                                <small> - {obs.observacion_corta || "Sin descripción corta"}</small>
                                <span style={{ fontSize: '0.8rem', marginLeft: 'auto', opacity: 0.7 }}>🔍 Ver Detalle</span>
                            </h3>
                            
                            <div className={styles.imageGrid}>
                                {obs.imagenes.map((img) => (
                                    <div key={img.id} className={styles.imageWrapper}>
                                        <img 
                                            src={img.ruta} 
                                            alt={img.nombre || "Evidencia"}
                                            className={styles.thumbnail}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleImageClick(img.ruta);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className={styles.noResults}>No se encontraron imágenes con los filtros actuales.</p>
            )}
            {modalId && (
                <ObservacionModal 
                    observacionId={modalId} 
                    onClose={() => setModalId(null)} 
                />
            )}
        </div>
    );
}

export default GaleriaImagenes;