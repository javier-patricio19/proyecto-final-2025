import React from 'react';
import { useUpdateObservacion } from '../hooks/observacionesHooks';
import { useFetchTramos } from "../hooks/tramosHook";
import { useFetchElementos } from "../hooks/elementosHook";
import '../styles/Formularios.css';

export const EditarObservacion = ({ observacionId, onSuccessCallback, onCancel }) => {
    const {
        tramoId, setTramoId, elementoId, setElementoId, kilometro, setKilometro,
        cuerpo, setCuerpo, carril, setCarril, fecha, setFecha, observacion, setObservacion,
        observacionCorta, setObservacionCorta, recomendacion, setRecomendacion, estado, setEstado,
        setImagenesNuevas, imagenesExistentes, handleRemoveExistingImage,
        lat, setLat, lng, setLng, obtenerUbicacionGPS, encurso, errorEnvio, handleSubmit, loadingData
    } = useUpdateObservacion(observacionId, onSuccessCallback);

    const { tramos, loading: loadingTramos, error: errorTramos } = useFetchTramos();
    const { elementos, loading: loadingElementos, error: errorElementos } = useFetchElementos();

    if (loadingData || loadingTramos || loadingElementos) return <p className="form-loading">Cargando datos...</p>;
    if (errorTramos || errorElementos) return <p className="form-error">Error al cargar datos.</p>;

    const opcionesCuerpo = ['A', 'B'];
    const opcionesCarril = ['1', '2', '3', 'Acotamiento'];

    const opcionesEstado = ['Reportado', 'En proceso', 'Completado'];

    return (
        <form className="main-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Editar Observación #{observacionId}</h2>
            <div className="form-row">
                <div className="form-group">
                    <label>Tramo:</label>
                    <select className="form-input" value={tramoId} onChange={(e) => setTramoId(e.target.value)} required>
                        <option value="">Seleccione un tramo</option>
                        {tramos.map((t) => <option key={t.id} value={t.id}>{t.inicio} - {t.destino}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Elemento:</label>
                    <select className="form-input" value={elementoId} onChange={(e) => setElementoId(e.target.value)} required>
                        <option value="">Seleccione un elemento</option>
                        {elementos.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                    </select>
                </div>
                <div className="form-group small">
                    <label>Kilómetro:</label>
                    <input className="form-input" type="text" value={kilometro} onChange={(e) => setKilometro(e.target.value)} required />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Cuerpo:</label>
                    <select className="form-input" value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} required>
                        <option value="">Seleccione...</option>
                        {opcionesCuerpo.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Carril:</label>
                    <select className="form-input" value={carril} onChange={(e) => setCarril(e.target.value)} required>
                        <option value="">Seleccione...</option>
                        {opcionesCarril.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Fecha:</label>
                    <input className="form-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Observación Detallada:</label>
                    <textarea className="form-input" value={observacion} onChange={(e) => setObservacion(e.target.value)} required rows={3}></textarea>
                </div>
                <div className="form-group">
                    <label>Recomendaciones:</label>
                    <textarea className="form-input" value={recomendacion} onChange={(e) => setRecomendacion(e.target.value)} required rows={3}></textarea>
                </div>
            </div>

            <div className="form-group">
                <label>Observación Corta:</label>
                <input className="form-input" type="text" value={observacionCorta} onChange={(e) => setObservacionCorta(e.target.value)} required />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Estado del Reporte:</label>
                    <select className="form-input highlight" value={estado} onChange={(e) => setEstado(e.target.value)}>
                        {opcionesEstado.map(op => <option key={op} value={op}>{op}</option>)}
                    </select>
                </div>
            </div>

            <div className="image-edit-section">
                <label>Imágenes Actuales:</label>
                <div className="image-grid">
                    {imagenesExistentes.map(img => (
                        <div key={img.id} className="thumb-container">
                            <img src={`${img.ruta}`} alt="existente" />
                            <button type="button" onClick={() => handleRemoveExistingImage(img.id)} className="btn-remove">×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Agregar nuevas imágenes:</label>
                <input className="form-input" type="file" accept="image/*" multiple onChange={(e) => setImagenesNuevas(e.target.files)} />
            </div>

            <div className="gps-section">
                <h4>📍 Corregir GPS</h4>
                <div className="gps-inputs">
                    <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} />
                    <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} />
                    <button type="button" onClick={obtenerUbicacionGPS} className="btn-gps">GPS Actual</button>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={encurso}>
                    {encurso ? 'Guardando...' : 'Actualizar'}
                </button>
                <button type="button" className="btn-primary" onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    );
};
