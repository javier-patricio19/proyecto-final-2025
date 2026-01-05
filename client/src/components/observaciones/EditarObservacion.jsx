import React, { useState, useEffect } from 'react';
import styles from '../../styles/stylesObservacion/EditarObservacion.module.css';
import { useUpdateObservacion } from '../../hooks/observacionesHooks';
import { useFetchTramos } from "../../hooks/tramosHook";
import { useFetchElementos } from "../../hooks/elementosHook";

export const EditarObservacion = ({ observacionId, onSuccessCallback, onCancel }) => {
    // Hooks personalizados
    const {
        codigo, tramoId, setTramoId, elementoId, setElementoId, kilometro, setKilometro,
        cuerpo, setCuerpo, carril, setCarril, fecha, setFecha, observacion, setObservacion,
        observacionCorta, setObservacionCorta, recomendacion, setRecomendacion, estado, setEstado,
        setImagenesNuevas, imagenesExistentes, handleRemoveExistingImage,
        lat, setLat, lng, setLng, obtenerUbicacionGPS, encurso, errorEnvio, handleSubmit, loadingData
    } = useUpdateObservacion(observacionId, onSuccessCallback);

    const { tramos, loading: loadingTramos, error: errorTramos } = useFetchTramos();
    const { elementos, loading: loadingElementos, error: errorElementos } = useFetchElementos();

    // Estado local para previsualizaciones
    const [newPreviews, setNewPreviews] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]); // Manejo local de archivos para poder borrar

    // Limpieza de memoria (URLs de objetos)
    useEffect(() => {
        return () => newPreviews.forEach(obj => URL.revokeObjectURL(obj.url));
    }, [newPreviews]);

    // Manejador mejorado de archivos
    const handleNewFiles = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Combinar con los ya seleccionados si se desea, o reemplazar. 
            // Aquí reemplazamos para simplificar, o podrías hacer [...selectedFiles, ...files]
            setSelectedFiles(files); 
            setImagenesNuevas(files); // Actualizar hook

            // Generar previews
            const previews = files.map(file => ({
                name: file.name,
                url: URL.createObjectURL(file)
            }));
            setNewPreviews(previews);
        }
    };

    // Función para quitar una imagen NUEVA antes de subirla
    const removeNewImage = (indexToRemove) => {
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        const updatedPreviews = newPreviews.filter((_, index) => index !== indexToRemove);
        
        setSelectedFiles(updatedFiles);
        setImagenesNuevas(updatedFiles); // Actualizar hook con la lista filtrada
        setNewPreviews(updatedPreviews);
    };

    // Estados de carga inicial
    if (loadingData || loadingTramos || loadingElementos) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Cargando información del reporte...</p>
            </div>
        );
    }

    if (errorTramos || errorElementos) {
        return <div className={styles.errorContainer}>⚠️ Error al cargar catálogos. Intente recargar.</div>;
    }

    const opcionesCuerpo = ['A', 'B'];
    const opcionesCarril = ['1', '2', '3', 'Acotamiento'];
    const opcionesEstado = ['Reportado', 'En proceso', 'Completado'];

    return (
        <form className={styles.mainForm} onSubmit={handleSubmit}>
            <div className={styles.header}>
                <h2 className={styles.formTitle}>Editar Observación <span className={styles.codeHighlight}>{codigo}</span></h2>
                <span className={`${styles.statusBadge} ${styles[estado.replace(/\s+/g, '')]}`}>{estado}</span>
            </div>
            
            {/* SECCIÓN 1: UBICACIÓN */}
            <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>📍 Ubicación Física</legend>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="tramo" className={styles.label}>Tramo:</label>
                        <select id="tramo" className={styles.formInput} value={tramoId} onChange={(e) => setTramoId(e.target.value)} required>
                            <option value="">-- Seleccione --</option>
                            {tramos.map((t) => <option key={t.id} value={t.id}>{t.inicio} - {t.destino}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="elemento" className={styles.label}>Elemento:</label>
                        <select id="elemento" className={styles.formInput} value={elementoId} onChange={(e) => setElementoId(e.target.value)} required>
                            <option value="">-- Seleccione --</option>
                            {elementos.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                        </select>
                    </div>
                    <div className={`${styles.formGroup} ${styles.small}`}>
                        <label htmlFor="km" className={styles.label}>Kilómetro:</label>
                        <input id="km" className={styles.formInput} type="text" value={kilometro} onChange={(e) => setKilometro(e.target.value)} required />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="cuerpo" className={styles.label}>Cuerpo:</label>
                        <select id="cuerpo" className={styles.formInput} value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} required>
                            <option value="">--</option>
                            {opcionesCuerpo.map((op) => <option key={op} value={op}>{op}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="carril" className={styles.label}>Carril:</label>
                        <select id="carril" className={styles.formInput} value={carril} onChange={(e) => setCarril(e.target.value)} required>
                            <option value="">--</option>
                            {opcionesCarril.map((op) => <option key={op} value={op}>{op}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="fecha" className={styles.label}>Fecha:</label>
                        <input id="fecha" className={styles.formInput} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                    </div>
                </div>
            </fieldset>

            {/* SECCIÓN 2: DETALLES */}
            <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>📝 Detalles del Reporte</legend>
                
                <div className={styles.formGroup}>
                    <label htmlFor="obsCorta" className={styles.label}>Título / Observación Corta:</label>
                    <input id="obsCorta" className={styles.formInput} type="text" value={observacionCorta} onChange={(e) => setObservacionCorta(e.target.value)} required />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="obsDetallada" className={styles.label}>Descripción Detallada:</label>
                        <textarea id="obsDetallada" className={styles.formInput} value={observacion} onChange={(e) => setObservacion(e.target.value)} required rows={4}></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="recomendacion" className={styles.label}>Recomendación Técnica:</label>
                        <textarea id="recomendacion" className={styles.formInput} value={recomendacion} onChange={(e) => setRecomendacion(e.target.value)} required rows={4}></textarea>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="estado" className={styles.label}>Estado Actual:</label>
                    <select id="estado" className={styles.formInput} value={estado} onChange={(e) => setEstado(e.target.value)}>
                        {opcionesEstado.map(op => <option key={op} value={op}>{op}</option>)}
                    </select>
                </div>
            </fieldset>

            {/* SECCIÓN 3: EVIDENCIA Y GPS */}
            <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>📸 Evidencia y Geolocalización</legend>

                {/* Imágenes Existentes */}
                <div className={styles.imageSection}>
                    <label className={styles.subLabel}>Imágenes Guardadas:</label>
                    {imagenesExistentes.length === 0 ? (
                        <p className={styles.noImagesText}>No hay imágenes en el servidor.</p>
                    ) : (
                        <div className={styles.imageGrid}>
                            {imagenesExistentes.map(img => (
                                <div key={img.id} className={styles.thumbContainer}>
                                    <img src={img.ruta} alt="Evidencia existente" />
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveExistingImage(img.id)} 
                                        className={styles.btnRemove}
                                        title="Eliminar imagen existente"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Imágenes Nuevas */}
                <div className={styles.imageSection}>
                    <label className={`${styles.btnUpload} ${styles.label}`}>
                        📂 Seleccionar Nuevas Fotos
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handleNewFiles} 
                            style={{display: 'none'}} 
                        />
                    </label>
                    
                    {newPreviews.length > 0 && (
                        <div className={styles.newPreviewsGrid}>
                            {newPreviews.map((preview, idx) => (
                                <div key={idx} className={styles.thumbContainerNew}>
                                    <img src={preview.url} alt="Nueva" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeNewImage(idx)} 
                                        className={styles.btnRemoveNew}
                                        title="Quitar esta foto"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* GPS */}
                <div className={styles.gpsContainer}>
                    <label className={styles.subLabel}>Coordenadas GPS:</label>
                    <div className={styles.gpsInputs}>
                        <div className={styles.gpsInputGroup}>
                            <span>Lat:</span>
                            <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} />
                        </div>
                        <div className={styles.gpsInputGroup}>
                            <span>Lng:</span>
                            <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} />
                        </div>
                        <button type="button" onClick={obtenerUbicacionGPS} className={styles.btnGps}>
                            📡 Obtener Actual
                        </button>
                    </div>
                </div>
            </fieldset>

            {/* ACCIONES */}
            <div className={styles.formActions}>
                <button type="button" className={styles.btnSecondary} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={encurso}>
                    {encurso ? 'Guardando Cambios...' : '💾 Actualizar Observación'}
                </button>
            </div>
            
            {errorEnvio && <div className={styles.errorMessage}>⚠️ {errorEnvio}</div>}
        </form>
    );
};