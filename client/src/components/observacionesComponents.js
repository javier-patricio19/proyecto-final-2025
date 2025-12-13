import React, { useState, useEffect, useRef } from "react";
import { useDeleteObservacion, useObservacionForm, useUpdateObservacion } from '../hooks/observacionesHooks';
import { useFetchTramos } from "../hooks/tramosHook";
import { useFetchElementos } from "../hooks/elementosHook";
import { fetchObservacionById } from "../services/observacionesService";

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

const ActionDrop = ({ item, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const dropdownRef =useRef(null);

    const handleClickOutside = (e) => {
        if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
            setIsOpen(false);
        }
    };

    useEffect(() =>{
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); 

    const toggleMenu = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };
    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit(item);
        setIsOpen(false);
    };
    const handleDeleteclick = (e) => {
        e.stopPropagation();
        onDelete(item.id);
        setIsOpen(false);
    };

    const menuStyle = {
        position: 'absolute',
        right: '0',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: 100,
        minWidth: '120px',
        display: isOpen ? 'block' : 'none',
        padding: '0'
    };
    const menuItemStyle= (itemName) => ({
        padding: '8px 12px',
        cursor: 'pointer',
        listStyle: 'none',
        margin: 0,
        backgroundColor: hoveredItem === itemName ? '#f2f2f2' : 'white',
        color: itemName === 'Eliminar' ? 'red' : 'inherit'
    });
    const buttonIconStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2em'
    };

    return (
        <div style={{position: 'relative'}} ref={dropdownRef}>
            <button onClick={toggleMenu} style={buttonIconStyle}>⋮</button>
            <ul style={menuStyle}>
                <li style={menuItemStyle('editar')} onClick={handleEditClick} onMouseEnter={() => setHoveredItem('editar')} onMouseLeave={() => setHoveredItem(null)} >
                    Editar
                </li>
                <li style={menuItemStyle('Eliminar')} onClick={handleDeleteclick} onMouseEnter={() => setHoveredItem('Eliminar')} onMouseLeave={() => setHoveredItem(null)}>
                    Eliminar
                </li>
            </ul>
        </div>
    );
};

const ObservacionModal = ({observacionId, onClose}) => {
    const[data, setData] = useState(null);
    const[loading,setLoading] = useState(true);
    const[error, setError] = useState(null);

    useEffect(() => {
      const loadDetails = async () => {
        try {
            setLoading(true);
            const details = await fetchObservacionById(observacionId);
            setData(details);
            setLoading(false); 
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
      };
      loadDetails();
    }, [observacionId]);


    const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
    const modalContentStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' };
    const imageStyle = { width: '150px', height: '150px', objectFit: 'cover', margin: '5px' };

    if (loading) return <div style={modalOverlayStyle}><div style={modalContentStyle}><p>Cargando detalles...</p></div></div>;
    if (error) return <div style={modalOverlayStyle}><div style={modalContentStyle}><p>Error al cargar detalles: {error}</p><button onClick={onClose}>Cerrar</button></div></div>;

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}> 
                <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer' }}>×</button>
                <h2>Detalles de Observación ID: {data.id}</h2>
                <p><strong>Estado:</strong> {data.estado}</p>
                <p><strong>Tramo:</strong> {data.tramoId} | <strong>Elemento:</strong> {data.elementoId}</p>
                <p><strong>Ubicación:</strong> KM {data.kilometro}, Cuerpo {data.cuerpo}, Carril {data.carril}</p>
                <p><strong>Fecha:</strong> {new Date(data.fecha).toLocaleDateString()}</p>
                <p><strong>Observación Corta:</strong> {data.observacion_corta}</p>
                <p><strong>Observación Detallada:</strong> {data.observacion}</p>
                <p><strong>Recomendación:</strong> {data.recomendacion}</p>

                <h3>Imágenes:</h3>
                <div>
                    {data.imagenes && data.imagenes.length > 0 ? (
                        data.imagenes.map(img => (
                            <img key={img.id} src={`${img.ruta}`} alt="observacion" style={imageStyle} />
                        ))
                    ) : (
                        <p>No hay imágenes adjuntas.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ListaObservaciones = ({ observaciones, loading, error, onEdit, onDataChangeCallback }) => {
    const { handleDelete } = useDeleteObservacion(onDataChangeCallback);
    const [expandedObsId, setExpandedObsId] = useState(null);

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
        if (estado === 'Sin atender' || estado === 'Reportado') {
            return { backgroundColor: '#dc3545', color: 'white', padding: '3px 6px', borderRadius: '4px', fontSize: '0.8em' };
    } else if (estado === 'En proceso') {
        return { backgroundColor: '#ffc107', color: 'white', padding: '3px 6px', borderRadius: '4px', fontSize: '0.8em' };
    }else if (estado === 'Completado') {
        return { backgroundColor: '#28a745', color: 'white', padding: '3px 6px', borderRadius: '4px', fontSize: '0.8em' };
    }else{
        return { backgroundColor: '#ccc', padding: '3px 6px', borderRadius: '4px', fontSize: '0.8em' };
    }
        
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
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            onClick={() => setExpandedObsId(item.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}
                            title="Ver detalles conmpletos">
                                🔍
                        </button>
                        <ActionDrop item={item} onEdit={onEdit} onDelete={handleDelete} />
                    </div>
                </div>
            ))}
            {expandedObsId && (
                <ObservacionModal
                    observacionId={expandedObsId}
                    onClose={() => setExpandedObsId(null)}
                />
            )}
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

export const EditarObservacion = ({observacionId, onSuccessCallback, onCancel}) => {
    const {
        tramoId, setTramoId, elementoId, setElementoId, kilometro, setKilometro,
        cuerpo, setCuerpo, carril, setCarril, fecha, setFecha, observacion, setObservacion,
        observacionCorta, setObservacionCorta, recomendacion, setRecomendacion, estado, setEstado,
        imagenesNuevas, setImagenesNuevas, imagenesExistentes, handleRemoveExistingImage,
        encurso, errorEnvio, handleSubmit, loadingData
    } = useUpdateObservacion(observacionId, onSuccessCallback);

    const { tramos, loading: loadingTramos } = useFetchTramos();
    const { elementos, loading: loadingElementos } = useFetchElementos();

    if (loadingData || loadingTramos || loadingElementos) return <p>Cargando datos de edición...</p>
    if (errorEnvio && !loadingData) return <p style={{ color: 'red' }}>Error al cargar los datos: {errorEnvio}</p>

    const opcionesCuerpo = ['A', 'B'];
    const opcionesCarril = ['1', '2', '3', 'Acotamiento'];
    const opcionesEstado = ['Reportado', 'En proceso', 'Completado'];

    const formGroupStyle = { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' };
    const inputstyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%'};
    const labelStyle = { display: 'block', marginBottom: '5px'};
    const imageStyle = { width: '100px', height: '100px', objectFit: 'cover', margin: '5px' };
    const imageContainerStyle = { position: 'relative', display: 'inline-block', margin: '5px' };
    const removeButtonStyle = {
        position: 'absolute',
        top: '0',
        right: '0',
        background: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        width: '24px',
        height: '24px',
        fontSize: '14px',
        textAlign: 'center',
        lineHeight: '24px'
    };
    return(
        <form onSubmit={handleSubmit}>
            <h1>Editar observación ID: {observacionId}</h1>

            <div style={formGroupStyle}>
                <div style={{flex: 1}}>
                    <label style={labelStyle}>Tramo:</label>
                    <select value={tramoId} onChange={(e) => setTramoId(e.target.value)} style={inputstyle} required>
                        <option value="">Seleccione un tramo</option>
                        {tramos.map((t) => (<option key={t.id} value={t.id}>{t.inicio} - {t.destino}</option>))}
                    </select>
                </div>
                <div style={{flex: 1}}>
                    <label style={labelStyle}>Elemento:</label>
                    <select value={elementoId} onChange={(e) => setElementoId(e.target.value)} style={inputstyle} required>
                        <option value="">Seleccione un Elemento</option>
                        {elementos.map((t) => (<option key={t.id} value={t.id}>{t.nombre}</option>))}
                    </select>
                </div>
                <div style={{flex: 0.5}}>
                    <label style={labelStyle}>Kilómetro:</label>
                    <input type="text" value={kilometro} onChange={(e) => setKilometro(e.target.value)} style={inputstyle} required />
                </div>
            </div>
            <div style={formGroupStyle}>
                <div style={{flex: 1}}>
                    <label style={labelStyle}>Cuerpo:</label>
                    <select value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} style={inputstyle} required>
                        {opcionesCuerpo.map((opcion) => (<option key={opcion} value={opcion}>{opcion}</option>))}
                    </select>
                </div>
                <div style={{flex: 1}}>
                    <label style={labelStyle}>Carril:</label>
                    <select value={carril} onChange={(e) => setCarril(e.target.value)} style={inputstyle} required>
                        {opcionesCarril.map((opcion) => (<option key={opcion} value={opcion}>{opcion}</option>))}
                    </select>
                </div>
                <div style={{flex: 1}}>
                    <label style={labelStyle}>Fecha:</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={inputstyle} required />
                </div>
                <div style={{flex: 1}}>
                    <label style={labelStyle}>Rstado:</label>
                    <select value={estado} onChange={(e) => setEstado(e.target.value)} style={inputstyle} required>
                        {opcionesEstado.map((opcion) => (<option key={opcion} value={opcion}>{opcion}</option>))}
                    </select>
                </div>
            </div>
            <div style={{marginBottom: '15px'}}>
                <div style={{marginBottom: '15px'}}>
                    <label style={labelStyle}>Observación:</label>
                    <textarea value={observacion} onChange={(e) => setObservacion(e.target.value)} required rows={4} style={inputstyle}></textarea>
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label style={labelStyle}>Recomendación:</label>
                    <textarea value={recomendacion} onChange={(e) => setRecomendacion(e.target.value)} required rows={4} style={inputstyle}></textarea>
                </div>
            </div>
            <div style={{marginBottom: '15px'}}>
                <label style={labelStyle}>Observación Corta:</label>
                <input type="text" value={observacionCorta} onChange={(e) => setObservacionCorta(e.target.value)} required style={inputstyle} />
            </div>
            <div style={{marginBottom: '15px'}}>
                <label style={labelStyle}>Imágenes Actuales:</label>
                <div>
                    {imagenesExistentes.length> 0 ? (
                        imagenesExistentes.map( img => (
                            <div key={img.id} style={imageContainerStyle}>
                                <img key={img.id} src={`${img.ruta}`} alt="existente" style={imageStyle} />
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveExistingImage(img.id)} 
                                    style={removeButtonStyle}
                                    title="Eliminar imagen"
                                >
                                    X
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>no hay imágenes existentes.</p>
                    )}
                </div>
            </div>
            <div style={{marginBottom: '15px'}}>
                <label style={labelStyle}>Agregar o cambiar imagenes (opcional):</label>
                <input type="file" accept="image/*" multiple onChange={(e) => setImagenesNuevas(e.target.files)} style={inputstyle} />
            </div>
            <div>
                <button type="submit" disabled={encurso} style={{padding: '8px 12px', marginRight: '10px'}}>
                    {encurso ? 'Actualizando....' : 'Guardar Cambios'}
                </button>
                <button type="button" onClick={onCancel} style={{ padding: '8px 12px', }}>
                    Cancelar
                </button>
            </div>
        </form>
    );
};
