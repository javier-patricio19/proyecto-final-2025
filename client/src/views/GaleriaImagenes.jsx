import React, { useState, useMemo } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";

// Hooks propios
import { useFetchObservaciones } from '../hooks/observacionesHooks';
import { useFetchTramos } from '../hooks/tramosHook';
import { useFetchElementos } from '../hooks/elementosHook';
import { useFiltros } from "../hooks/FiltrosSeccion";
import { usePageTitle } from "../hooks/usePageTitle";

// Componentes
import FiltrosSeccion from '../components/observaciones/FiltrosSeccion';
import ObservacionModal from "../components/observaciones/ObservacionModal";

// Estilos
import styles from '../styles/GaleriaImagenes.module.css';

function GaleriaImagenes() {
    usePageTitle("Galería");

    // 1. Obtención de datos
    const { observaciones, loading, error } = useFetchObservaciones();
    const { tramos } = useFetchTramos();
    const { elementos } = useFetchElementos();

    // 2. Seguridad de datos (Arrays vacíos por defecto)
    const safeObservaciones = useMemo(() => observaciones || [], [observaciones]);
    const safeTramos = useMemo(() => tramos || [], [tramos]);
    const safeElementos = useMemo(() => elementos || [], [elementos]);

    // 3. Lógica de filtros
    const { 
        filtros, 
        datosFiltrados, 
        handleChange, 
        limpiarFiltros 
    } = useFiltros(safeObservaciones, safeTramos, safeElementos);

    // 4. Estados locales
    const [index, setIndex] = useState(-1);
    const [modalId, setModalId] = useState(null);

    // 5. Preparar slides para el Lightbox (Memoizado para rendimiento)
    const slides = useMemo(() => {
        if (!datosFiltrados) return [];
        return datosFiltrados.flatMap(obs => 
            (obs.imagenes || []).map(img => ({ src: img.ruta }))
        );
    }, [datosFiltrados]);

    // Manejador para abrir lightbox en la imagen correcta
    const handleImageClick = (src) => {
        const slideIndex = slides.findIndex(s => s.src === src);
        if (slideIndex >= 0) {
            setIndex(slideIndex);
        }
    };

    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando galería...</p>
        </div>
    );
    
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

            {/* Lightbox Component (Visor a pantalla completa) */}
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

            {/* Renderizado de la lista de observaciones con fotos */}
            {datosFiltrados.length > 0 ? (
                datosFiltrados.map(obs => {
                    // Si no tiene imágenes, saltamos este bloque
                    if (!obs.imagenes || obs.imagenes.length === 0) return null;
                    
                    return (
                        <div key={obs.id} className={styles.groupContainer}>
                            <div 
                                className={`${styles.groupHeader} ${styles.clickableHeader}`}
                                onClick={() => setModalId(obs.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter') setModalId(obs.id); }}
                                title="Click para ver detalles completos del reporte"
                            >
                                <div className={styles.headerInfo}>
                                    <span className={styles.headerCode}>{obs.codigo || `ID ${obs.id}`}</span> 
                                    <small className={styles.headerDesc}> - {obs.observacion_corta || "Sin descripción"}</small>
                                </div>
                                <span className={styles.headerAction}>🔍 Ver Detalle</span>
                            </div>
                            
                            <div className={styles.imageGrid}>
                                {obs.imagenes.map((img, idx) => (
                                    <div key={img.id || idx} className={styles.imageWrapper}>
                                        <img 
                                            src={img.ruta} 
                                            alt={img.nombre || `Evidencia ${obs.codigo}`}
                                            className={styles.thumbnail}
                                            loading="lazy" // OPTIMIZACIÓN CLAVE: Carga diferida
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleImageClick(img.ruta);
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none'; // Ocultar si falla la carga
                                            }}
                                        />
                                        {/* Overlay opcional al hacer hover */}
                                        <div className={styles.overlayHover} onClick={(e) => {
                                            e.stopPropagation();
                                            handleImageClick(img.ruta);
                                        }}>
                                            <span>🔍</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className={styles.noResultsContainer}>
                    <p className={styles.noResults}>No se encontraron imágenes con los filtros actuales.</p>
                </div>
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