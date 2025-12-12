import { useState } from "react";
import { useDeleteObservacion, useObservacionForm } from '../hooks/observacionesHooks';
import { useFetchTramos } from "../hooks/tramosHook";
import { useFetchElementos } from "../hooks/elementosHook";

const cardStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
};

const filterContainerStyle = { display: 'flex', gap: '10px', marginBottom: '15px' };
const buttonStyle = { padding: '5px 8px', fontSize: '0.8em', cursor: 'pointer', marginLeft: '5px' };

export const ListaObservaciones = ({ observaciones, loading, error, onEdit, onDataChangeCallback }) => {
    const { handleDelete } = useDeleteObservacion(onDataChangeCallback);

    const [filterTramo, setFilterTramo] = useState('Todos');
    const [filterElemento, setFilterElemento] = useState('Todos');
    const [filterEstado, setFilterEstado] = useState('Todos');

    const {tramos} = useFetchTramos();
    const {elementos} = useFetchElementos();
    const estados = ['Todos', 'Reportado', 'En proceso', 'Completado'];

    if (loading) return <p>Cargando observaciones...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error.nessage}</p>;

    const safeTramos = tramos || [];
    const safeElementos = elementos || [];

    const filteredObservaciones = observaciones.filter(item => {
        const matchesTramo = filterTramo === 'Todos' || item.tramoId === parseInt(filterTramo);
        const matchesElemento = filterElemento === 'Todos' || item.elementoId === parseInt(filterElemento);
        const matchesEstado = filterEstado === 'Todos' || item.estado === filterEstado;
        return matchesTramo && matchesElemento && matchesEstado;
    });

    const getStatusStyle = (estado) => {
        if (estado === 'Sin atender' || estado === 'Reportado') return { backgroundColor: '#dc3545', color: 'white', padding: '3px 6px', borderRadius: '4px', fontSize: '0.8em' };
        return { backgroundColor: '#f2f2f2', padding: '3px 6px', borderRadius: '4px', fontSize: '0.8em' };
    };

    const getTramoNombre = (id) => safeTramos.find(t => t.id ===id)?.inicio+' - '+safeTramos.find(t => t.id ===id)?.destino || 'N/A';
    const getElementoNombre = (id) => safeElementos.find(e => e.id === id)?.nombre || 'N/A';

    return (
        <div>
            <h2>Lista de Obsevaciones: {observaciones.length} elementos</h2>
            <div style={filterContainerStyle}>
                <select onChange={(e) => setFilterTramo(e.target.value)} value={filterTramo} style={{padding: '8px'}}>
                    <option value="Todos">Todos los tramos</option>
                    {safeTramos.map(t => <option key={t.id} value={t.id}>{t.inicio} - {t.destino}</option>)}
                </select>
                
                <select onChange={(e) => setFilterElemento(e.target.value)} value={filterElemento} style={{padding: '8px'}}>
                    <option value="Todos">Todos los elementos</option>
                    {safeElementos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>

                <select onChange={(e) => setFilterEstado(e.target.value)} value={filterEstado} style={{padding: '8px'}}>
                    {estados.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {filteredObservaciones.map(item =>(
                <div key={item.id} style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '60px', height:'60px', background: '#ccc', borderRadius: '4px', marginRight: '15px'}}>
                            {item.imagenes && item.imagenes.length > 0 ? (
                                console.log("Cargando imagen desde URL:", `http://localhost:5000${item.imagenes[0].ruta}`),
                                <img
                                    src={`${item.imagenes[0].ruta}`}
                                    alt={item.observacion_corta}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <p style={{fontSize: '0.6em', textAlign: 'center', marginTop: '15px'}}>Sin imagen</p>
                            )} 
                        </div>
                        <div>
                            <span style={getStatusStyle(item.estado)}>{item.estado}</span>
                            <p style={{  margin: '5px 0 2px 0', fontWeight: 'bold' }}>Tramo: {getTramoNombre(item.tramoId)}</p>
                            <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>
                                Kilometro: {item.kilometro} Cuerpo: {item.cuerpo} Carril: {item.carril} Elemento: {getElementoNombre(item.elementoId)}
                            </p>
                        </div>
                    </div>

                    <div>
                        <button onClick={() => onEdit(item)} style={{ ...buttonStyle }}>Agregar a reporte</button>
                        <button onClick={() => handleDelete(item.id)} style={{ ...buttonStyle, color: 'red' }}>Eliminar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const CrearObservacionForm = ({ onSuccessCallback }) => {
    const{
        tramoId, setTramoId, elementoId, setElementoId, kilometro, setKilometro,
        cuerpo, setCuerpo, carril, setCarril, fecha, setFecha, observacion, setObservacion,
        observacionCorta, setObservacionCorta, recomendacion, setRecomendacion, imagenes, setImagenes,
        encurso, errorEnvio, handleSubmit
    } = useObservacionForm(onSuccessCallback);

    const { tramos, loading: loadingTramos, error: errorTramos} = useFetchTramos();
    const { elementos, loading: loadingElementos, error: errorElementos} = useFetchElementos();
    if (loadingTramos || loadingElementos) return <p>Cargando...</p>;
    if (errorTramos) return <p>Error al cargar tramos: {errorTramos.message}</p>;
    if (errorElementos) return <p>Error al cargar elementos: {errorElementos.message}</p>;

    const opcionesCuerpo = ['A', 'B'];
    const opcionesCarril = ['1', '2', '3', 'Acotamiento'];

    const formGroupStyle = { display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '15px' };
    const inputstyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc'};
    const labelStyle = { display: 'block', marginBottom: '5px'};

    return (
        <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
                <div>
                    <label style={labelStyle}>Tramo:</label>
                    <select value={tramoId} onChange={(e) => setTramoId(e.target.value)} style={inputstyle} required>
                        <option value="">Seleccione un tramo</option>
                        {tramos.map((tramo) => (
                            <option key={tramo.id} value={tramo.id}>
                                {tramo.inicio} - {tramo.destino}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>Elemento:</label>
                    <select value={elementoId} onChange={(e) => setElementoId(e.target.value)} style={inputstyle} required>
                        <option value="">Seleccione un elemento</option>
                        {elementos.map((elemento) => (
                            <option key={elemento.id} value={elemento.id}>
                                {elemento.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>Kilómetro:</label>
                    <input
                        type="text"
                        value={kilometro}
                        onChange={(e) => setKilometro(e.target.value)}
                        style={inputstyle}
                        required
                    />
                </div>
            </div>
            <div style={formGroupStyle}>
                <div>
                    <label style={labelStyle}>Cuerpo:</label>
                    <select value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} style={inputstyle} required>
                        <option value="">Seleccione un cuerpo</option>
                        {opcionesCuerpo.map((opcion) => (
                            <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>Carril:</label>
                    <select value={carril} onChange={(e) => setCarril(e.target.value)} style={inputstyle} required>
                        <option value="">Seleccione un carril</option>
                        {opcionesCarril.map((opcion) => (
                            <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>Fecha:</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        style={inputstyle}
                        required
                    />
                </div>
            </div>
            <div style={formGroupStyle}> 
                <div style={{flex: 1, margin: 0}}> 
                    <label style={labelStyle}>Observación:</label>
                    <textarea value={observacion} onChange={(e) => setObservacion(e.target.value)} required rows={4} style={inputstyle}></textarea>
                </div>
                <div style={{flex: 1}}> 
                    <label style={labelStyle}>Recomendaciones:</label>
                    <textarea value={recomendacion} onChange={(e) => setRecomendacion(e.target.value)} required rows={4} style={inputstyle}></textarea>
                </div>
            </div>
            <div>
                <label style={labelStyle}>imagenes:</label>
                <input type="file" accept="image/*" multiple required onChange={(e) => setImagenes(e.target.files)} style={inputstyle} />
            </div>
            <div style={{marginBottom: '15px'}}>
                <label style={labelStyle}>Observación Corta:</label>
                <input type="text" value={observacionCorta} onChange={(e) => setObservacionCorta(e.target.value)} required style={inputstyle} />
            </div>
            <div style={formGroupStyle}>
                <button type="submit" disabled={encurso} style={{padding: '8px 12px'}}>
                    {encurso ? 'Enviando...' : 'Agregar Observación'}
                </button>
            </div>
            {errorEnvio && <p style={{color: 'red'}}>Error al enviar: {errorEnvio}</p>}
        </form>
    );
};