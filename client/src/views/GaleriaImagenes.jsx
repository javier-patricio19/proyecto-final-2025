import React, { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import { useGaleria } from '../hooks/useGaleria';
import styles from '../styles/GaleriaImagenes.module.css';

function GaleriaImagenes() {
    const {
        loading, error, tramos, galeriaFiltrada, slides,
        searchTerm, setSearchTerm,
        filterTramo, setFilterTramo,
        sortBy, setSortBy,
        resetFilters
    } = useGaleria();

    const [index, setIndex] = useState(-1);

    if (loading) return <p className={styles.loading}>Cargando galería...</p>;
    if (error) return <p className={styles.error}>Error: {error.message}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Galería de Imágenes</h1>

            <div className={styles.filterBar}>
                <input 
                    type="text" 
                    placeholder="Buscar en fotos (ID, KM, texto)..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                
                <select 
                    value={filterTramo} 
                    onChange={(e) => setFilterTramo(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="Todos">Todos los Tramos</option>
                    {tramos?.map(t => (
                        <option key={t.id} value={t.id}>{t.inicio} - {t.destino}</option>
                    ))}
                </select>

                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="fecha_desc">Fecha (Reciente)</option>
                    <option value="fecha_asc">Fecha (Antigua)</option>
                    <option value="km_asc">KM (Menor a Mayor)</option>
                    <option value="km_desc">KM (Mayor a Menor)</option>
                </select>

                <button onClick={resetFilters} className={styles.btnClear}>
                    Limpiar Filtros
                </button>
            </div>
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
            {galeriaFiltrada.length > 0 ? (
                galeriaFiltrada.map(obs => (
                    <div key={obs.id} className={styles.groupContainer}>
                        <h3 className={styles.groupHeader}>
                            ID #{obs.id} 
                            <small> - {obs.observacion_corta || "Sin descripción corta"}</small>
                        </h3>
                        
                        <div className={styles.imageGrid}>
                            {obs.imagenes.map((img) => {
                                const currentSrc = `${img.ruta}`;
                                return (
                                    <div key={img.id} className={styles.imageWrapper}>
                                        <img 
                                            src={currentSrc} 
                                            alt={img.nombre || "Evidencia"}
                                            className={styles.thumbnail}
                                            onClick={() => setIndex(slides.findIndex(s => s.src === currentSrc))}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            ) : (
                <p className={styles.noResults}>No se encontraron imágenes con los filtros actuales.</p>
            )}
        </div>
    );
}

export default GaleriaImagenes;