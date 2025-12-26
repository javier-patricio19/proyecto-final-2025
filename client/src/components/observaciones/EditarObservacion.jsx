import React, { useState, useEffect } from 'react';
import styles from '../../styles/stylesObservacion/EditarObservacion.module.css';
import { useUpdateObservacion } from '../../hooks/observacionesHooks';
import { useFetchTramos } from "../../hooks/tramosHook";
import { useFetchElementos } from "../../hooks/elementosHook";

export const EditarObservacion = ({ observacionId, onSuccessCallback, onCancel }) => {
    const {
        codigo, tramoId, setTramoId, elementoId, setElementoId, kilometro, setKilometro,
        cuerpo, setCuerpo, carril, setCarril, fecha, setFecha, observacion, setObservacion,
        observacionCorta, setObservacionCorta, recomendacion, setRecomendacion, estado, setEstado,
        setImagenesNuevas, imagenesExistentes, handleRemoveExistingImage,
        lat, setLat, lng, setLng, obtenerUbicacionGPS, encurso, errorEnvio, handleSubmit, loadingData
    } = useUpdateObservacion(observacionId, onSuccessCallback);

    const { tramos, loading: loadingTramos, error: errorTramos } = useFetchTramos();
    const { elementos, loading: loadingElementos, error: errorElementos } = useFetchElementos();

    const [newPreviews, setNewPreviews] = useState([]);

    useEffect(() => {
        return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
    }, [newPreviews]);

    const handleNewFiles = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImagenesNuevas(files);
            const previews = Array.from(files).map(file => URL.createObjectURL(file));
            setNewPreviews(previews);
        }
    };

    if (loadingData || loadingTramos || loadingElementos) return <p className={styles.formLoading}>Cargando datos...</p>;
    if (errorTramos || errorElementos) return <p className={styles.formError}>Error al cargar datos.</p>;

    const opcionesCuerpo = ['A', 'B'];
    const opcionesCarril = ['1', '2', '3', 'Acotamiento'];
    const opcionesEstado = ['Reportado', 'En proceso', 'Completado'];

    return (
        <form className={styles.mainForm} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>Editar Observación {codigo}</h2>
            
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Tramo:</label>
                    <select className={styles.formInput} value={tramoId} onChange={(e) => setTramoId(e.target.value)} required>
                        <option value="">Seleccione un tramo</option>
                        {tramos.map((t) => <option key={t.id} value={t.id}>{t.inicio} - {t.destino}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Elemento:</label>
                    <select className={styles.formInput} value={elementoId} onChange={(e) => setElementoId(e.target.value)} required>
                        <option value="">Seleccione un elemento</option>
                        {elementos.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                    </select>
                </div>
                <div className={`${styles.formGroup} ${styles.small}`}>
                    <label className={styles.label}>Kilómetro:</label>
                    <input className={styles.formInput} type="text" value={kilometro} onChange={(e) => setKilometro(e.target.value)} required />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Cuerpo:</label>
                    <select className={styles.formInput} value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} required>
                        <option value="">Seleccione...</option>
                        {opcionesCuerpo.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Carril:</label>
                    <select className={styles.formInput} value={carril} onChange={(e) => setCarril(e.target.value)} required>
                        <option value="">Seleccione...</option>
                        {opcionesCarril.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Fecha:</label>
                    <input className={styles.formInput} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Observación Detallada:</label>
                    <textarea className={styles.formInput} value={observacion} onChange={(e) => setObservacion(e.target.value)} required rows={3}></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Recomendaciones:</label>
                    <textarea className={styles.formInput} value={recomendacion} onChange={(e) => setRecomendacion(e.target.value)} required rows={3}></textarea>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Observación Corta:</label>
                <input className={styles.formInput} type="text" value={observacionCorta} onChange={(e) => setObservacionCorta(e.target.value)} required />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Estado del Reporte:</label>
                <select className={styles.formInput} value={estado} onChange={(e) => setEstado(e.target.value)}>
                    {opcionesEstado.map(op => <option key={op} value={op}>{op}</option>)}
                </select>
            </div>

            <div className={styles.imageEditSection}>
                <label className={styles.label}>Imágenes Actuales:</label>
                {imagenesExistentes.length === 0 ? (
                    <p style={{color: 'var(--text-muted)', fontStyle: 'italic'}}>No hay imágenes guardadas.</p>
                ) : (
                    <div className={styles.imageGrid}>
                        {imagenesExistentes.map(img => (
                            <div key={img.id} className={styles.thumbContainer}>
                                <img src={img.ruta} alt="Evidencia existente" />
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveExistingImage(img.id)} 
                                    className={styles.btnRemove}
                                    title="Eliminar imagen"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Agregar nuevas imágenes:</label>
                <input className={styles.formInput} type="file" accept="image/*" multiple onChange={handleNewFiles} />
                
                {newPreviews.length > 0 && (
                     <div className={styles.previewContainer}>
                        {newPreviews.map((src, idx) => (
                             <img 
                                key={idx} 
                                src={src} 
                                alt="Nueva previsualización" 
                                style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px'}} 
                             />
                        ))}
                     </div>
                )}
            </div>

            <div className={styles.gpsSection}>
                <h4 className={styles.gpsTitle}>📍 Corregir GPS</h4>
                <div className={styles.gpsInputs}>
                    <input className={styles.gpsInput} type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} />
                    <input className={styles.gpsInput} type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} />
                    <button type="button" onClick={obtenerUbicacionGPS} className={styles.btnGps}>GPS Actual</button>
                </div>
            </div>

            <div className={styles.formActions}>
                <button type="submit" className={styles.btnPrimary} disabled={encurso}>
                    {encurso ? 'Guardando...' : 'Actualizar'}
                </button>                
                <button type="button" className={styles.btnSecondary} onClick={onCancel}>
                    Cancelar
                </button>
            </div>
            
            {errorEnvio && <p className={styles.formError}>Error: {errorEnvio}</p>}
        </form>
    );
};