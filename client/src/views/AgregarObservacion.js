import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchTramos } from "../hooks/tramosHook";
import { useFetchElementos } from "../hooks/elementosHook";
import { crearObservacion } from "../services/observacionesService";

function AgregarObservacion() {
    const navigate = useNavigate();
    const [tramoId, setTramoId] = useState('');
    const [elementoId, setElementoId] = useState('');
    const [kilometro, setKilometro] = useState('');
    const [cuerpo, setCuerpo] = useState('');
    const [carril, setCarril] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
    const [observacion, setObservacion] = useState('');
    const [observacionCorta, setObservacionCorta] = useState('');
    const [recomendacion, setRecomendacion] = useState('');
    const [encurso, setEncurso] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState(null);
    const [imagenes, setimagenes] = useState(null);

    const opcionesCuerpo = ['A', 'B'];
    const opcionesCarril = ['1', '2', '3', 'Acotamiento'];

    const { tramos, loading: loadingTramos, error: errorTramos} = useFetchTramos();
    const { elementos, loading: loadingElementos, error: errorElementos} = useFetchElementos();

    if (loadingTramos || loadingElementos) return <p>Cargando...</p>;
    if (errorTramos) return <p>Error al cargar tramos: {errorTramos.message}</p>;
    if (errorElementos) return <p>Error al cargar elementos: {errorElementos.message}</p>;

    const formGroupStyle = { display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '15px' };
    const inputstyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc'};
    const labelStyle = { display: 'block', marginBottom: '5px'};

    const handlesubmit = async (e) => {
        e.preventDefault();
       setEncurso(true);
       setErrorEnvio(null);

       if (!imagenes || imagenes.length === 0) {
        setErrorEnvio('Por favor, seleccione al menos una imagen.');
        setEncurso(false);
        return;
       }

       const formData = new FormData();
       formData.append('tramoId', tramoId);
       formData.append('elementoId', elementoId);
       formData.append('kilometro', kilometro);
       formData.append('cuerpo', cuerpo);
       formData.append('carril', carril);
       formData.append('fecha', new Date(fecha).toISOString());
       formData.append('observacion', observacion);
       formData.append('observacion_corta', observacionCorta);
       formData.append('recomendacion', recomendacion);
       formData.append('estado', 'Reportado');

        for (let i = 0; i < imagenes.length; i++) {
            formData.append('imagenes', imagenes[i]);
        }

       try {
        await crearObservacion(formData);
        alert('Observación creada con éxito');
        setEncurso(false);
        navigate('/');
       } catch (err) {
            setErrorEnvio(err.message);
            setEncurso(false);
       }
    };

    return (
        <div style={{padding: '20 px'}}>
            <h1>Agregar Observación</h1>
            <form onSubmit={handlesubmit}>
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
                    <input type="file" accept="image/*" multiple required onChange={(e) => setimagenes(e.target.files)} style={inputstyle} />
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
        </div>
    );
}

export default AgregarObservacion;