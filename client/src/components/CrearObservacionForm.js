import React from 'react';
import { useObservacionForm } from '../hooks/observacionesHooks';
import { useFetchTramos } from "../hooks/tramosHook";
import { useFetchElementos } from "../hooks/elementosHook";
import '../styles/Formularios.css';

export const CrearObservacionForm = ({ onSuccessCallback }) => {
    const {
        tramoId, setTramoId, elementoId, setElementoId, kilometro, setKilometro,
        cuerpo, setCuerpo, carril, setCarril, fecha, setFecha, observacion, setObservacion,
        observacionCorta, setObservacionCorta, recomendacion, setRecomendacion, setImagenes,
        lat, setLat, lng, setLng, obtenerUbicacionGPS, encurso, errorEnvio, handleSubmit
    } = useObservacionForm(onSuccessCallback);

    const { tramos, loading: loadingTramos, error: errorTramos } = useFetchTramos();
    const { elementos, loading: loadingElementos, error: errorElementos } = useFetchElementos();

    if (loadingTramos || loadingElementos) return <p className="form-loading">Cargando catálogos...</p>;
    if (errorTramos || errorElementos) return <p className="form-error">Error al cargar datos.</p>;

    const opcionesCuerpo = ['A', 'B'];
    const opcionesCarril = ['1', '2', '3', 'Acotamiento'];

    return (
        <form className="main-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Nueva Observación</h2>

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

            <div className="form-group">
                <label>Evidencia Fotográfica:</label>
                <input className="form-input" type="file" accept="image/*" multiple required onChange={(e) => setImagenes(e.target.files)} />
            </div>

            <div className="gps-section">
                <h4>📍 Geolocalización <small>(opcional)</small></h4>
                <div className="gps-inputs">
                    <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitud" />
                    <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitud" />
                    <button type="button" onClick={obtenerUbicacionGPS} className="btn-gps">Obtener GPS</button>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={encurso}>
                    {encurso ? 'Enviando...' : 'Agregar Observación'}
                </button>
            </div>
            {errorEnvio && <p className="text-danger">Error: {errorEnvio}</p>}
        </form>
    );
};
