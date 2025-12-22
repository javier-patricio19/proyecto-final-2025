import React, { useEffect, useState } from 'react';
import { useObservacionForm } from '../../hooks/observacionesHooks';
import { useFetchTramos } from "../../hooks/tramosHook";
import { useFetchElementos } from "../../hooks/elementosHook";
import styles from '../../styles/stylesObservacion/CrearObservacionForm.module.css';

export const CrearObservacionForm = ({ onSuccessCallback }) => {
    const {
        tramoId, setTramoId, elementoId, setElementoId, kilometro, setKilometro,
        cuerpo, setCuerpo, carril, setCarril, fecha, setFecha, observacion, setObservacion,
        observacionCorta, setObservacionCorta, recomendacion, setRecomendacion, setImagenes,
        lat, setLat, lng, setLng, obtenerUbicacionGPS, encurso, errorEnvio, handleSubmit
    } = useObservacionForm(onSuccessCallback);

    const { tramos, loading: loadingTramos, error: errorTramos } = useFetchTramos();
    const { elementos, loading: loadingElementos, error: errorElementos } = useFetchElementos();

    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [previews]);

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImagenes(files);

            const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        }
    };

    if (loadingTramos || loadingElementos) return <p className="form-loading">Cargando catálogos...</p>;
    if (errorTramos || errorElementos) return <p className="form-error">Error al cargar datos.</p>;

    const opcionesCuerpo = ['A', 'B'];
    const opcionesCarril = ['1', '2', '3', 'Acotamiento'];

    return (
        <form className={styles.mainForm} onSubmit={handleSubmit}>
            <h2 className="styles.formTitle">Nueva Observación</h2>

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
                <div className={styles.formInput}>
                    <label className={styles.label}>Cuerpo:</label>
                    <select className={styles.formInput} value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} required>
                        <option value="">Seleccione...</option>
                        {opcionesCuerpo.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
                    </select>
                </div>
                <div className={styles.formInput}>
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
                <label className={styles.label}>Evidencia Fotográfica:</label>
                <input 
                    className={styles.formInput} 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    required 
                    onChange={handleFileChange}
                />
                {previews.length > 0 && (
                    <div className={styles.previewContainer} style={{display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap'}}>
                        {previews.map((src, index) => (
                            <img 
                                key={index} 
                                src={src} 
                                alt={`preview-${index}`} 
                                style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd'}} 
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.gpsSection}>
                <h4 className={styles.gpsTitle}>📍 Geolocalización <small>(opcional)</small></h4>
                <div className={styles.gpsInputs}>
                    <input className={styles.gpsInput} type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitud" />
                    <input className={styles.gpsInput} type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitud" />
                    <button type="button" onClick={obtenerUbicacionGPS} className={styles.btnGps}>Obtener GPS</button>
                </div>
            </div>

            <div className={styles.formActions}>
                <button type="submit" className={styles.btnPrimary} disabled={encurso}>
                    {encurso ? 'Enviando...' : 'Agregar Observación'}
                </button>
            </div>
            {errorEnvio && <p className="text-danger">Error: {errorEnvio}</p>}
        </form>
    );
};
