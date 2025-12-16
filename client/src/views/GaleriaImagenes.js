import React, { useState, useEffect } from 'react';
import { useFetchObservaciones } from '../hooks/observacionesHooks';
import { useFetchTramos } from "../hooks/tramosHook";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";

function GaleriaImagenes() {
    const { observaciones, loading, error } = useFetchObservaciones();
    const { tramos } = useFetchTramos();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTramo, setFilterTramo] = useState('Todos');
    const [sortBy, setSortBy] = useState('fecha_desc');
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(-1);
    const [slides, setSlides] = useState([]);
    
    const getProcessedData = () => {
        if(!observaciones) return[];
        let filtered = observaciones.filter(obs => {
            const tieneImagenes = obs.imagenes && obs.imagenes.length > 0;
            const matchesTramo = filterTramo === 'Todos' || obs.tramoId === parseInt(filterTramo);
            const matchesSearch =   obs.observacion.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                                    obs.observacion_corta.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                                    obs.kilometro.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                                    obs.recomendacion.toLowerCase().includes(searchTerm.toLocaleLowerCase());
            return tieneImagenes && matchesTramo && matchesSearch;
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'fecha_desc': return new Date(b.fecha) - new Date(a.fecha);
                case 'fecha_asc': return new Date(a.fecha) - new Date(b.fecha);
                case 'km_asc': return parseFloat(a.kilometro) - parseFloat(b.kilometro);
                case 'km_desc': return parseFloat(b.kilometro) - parseFloat(a.kilometro);
                case 'id_desc': return b.id - a.id;
                case 'id_asc': return a.id - b.id;
                default: return 0;
            }
        });

        return filtered;
    };

     const galeriaFiltrada = getProcessedData();

    useEffect(() => {
        const list = galeriaFiltrada.flatMap(obs =>
            (obs.imagenes || []).map(img => ({
                src: `${img.ruta}`,
                title: obs.observacion_corta,
                description: `ID: ${obs.id} - KM: ${obs.kilometro}`
            }))
        );
        setSlides(list);
    }, [observaciones, searchTerm, filterTramo, sortBy]);



    if (loading) return <p style={{padding: '20px'}}>Cargando galería...</p>;
    if (error) return <p style={{padding: '20px', color: 'red'}}>Error: {error.message}</p>;
    
    const filterBarStyle = {
        display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap',
        backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px'
    };


    return (
        <div style={{ padding: '20px' }}>
            <h1>Galería de Imágenes</h1>
            <div style={filterBarStyle}>
                <input 
                    type="text" placeholder="Buscar en fotos..." 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 2, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                
                <select value={filterTramo} onChange={(e) => setFilterTramo(e.target.value)} style={{ padding: '10px', borderRadius: '4px' }}>
                    <option value="Todos">Todos los Tramos</option>
                    {tramos?.map(t => <option key={t.id} value={t.id}>{t.inicio} - {t.destino}</option>)}
                </select>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '10px', borderRadius: '4px' }}>
                    <option value="fecha_desc">Fecha (Reciente)</option>
                    <option value="fecha_asc">Fecha (Antigua)</option>
                    <option value="km_asc">KM (Menor a Mayor)</option>
                    <option value="km_desc">KM (Mayor a Menor)</option>
                    <option value="id_desc">ID (Antiguo)</option>
                    <option value="id_asc">ID (Reciente)</option>
                </select>

                <button onClick={() => {setSearchTerm(''); setFilterTramo('Todos'); setSortBy('fecha_desc');}} style={{padding: '10px', cursor: 'pointer'}}>
                    Limpiar
                </button>
            </div>
            <Lightbox
                index={index}
                slides={slides}
                open={index >= 0}
                close={() => setIndex(-1)}
                plugins={[Zoom, Counter]}
                animation={{fade: 500}}
                controller={{closeOnBackdropClick: true}}
                zoom={{
                    maxZoomPixelRatio: 3,
                    zoomInMultiplier: 2,
                    doubleTapDelay: 300,
                }}
            />
            {galeriaFiltrada.length > 0 ? (
                galeriaFiltrada.map(obs => (
                    obs.imagenes && obs.imagenes.length > 0 && (
                        <div key={obs.id} style={{ marginBottom: '40px' }}>
                            <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '5px' }}>
                                ID #{obs.id} <small style={{fontSize: '0.8em', color: '#888'}}> - {obs.observacion_corta}</small>
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {obs.imagenes.map((img) => {
                                    const currentSrc = `${img.ruta}`;
                                    return (
                                        <div key={img.id} style={{ overflow: 'hidden', borderRadius: '8px' }}>
                                            <img 
                                                src={currentSrc} 
                                                alt={img.nombre}
                                                onClick={() => setIndex(slides.findIndex(s => s.src === currentSrc))}
                                                style={{ 
                                                    width: '180px', height: '130px', objectFit: 'cover', 
                                                    cursor: 'pointer', transition: '0.3s transform'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                ))
            ) : (
                <p style={{textAlign: 'center', color: '#888', marginTop: '50px'}}>No hay imágenes que coincidan con los filtros aplicados.</p>
            )}
        </div>
    );
}

export default GaleriaImagenes;