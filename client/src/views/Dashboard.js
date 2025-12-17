import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useLocation } from "react-router-dom";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useFetchObservaciones } from "../hooks/observacionesHooks";
import { useFetchElementos } from "../hooks/elementosHook";
import { useFetchTramos } from "../hooks/tramosHook";
import { Pie, Bar } from "react-chartjs-2";
import { 
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
 } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function RecenterMap({ coords, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (coords && coords[0] && coords[1]) {
            map.setView(coords, zoom || 13);
        }
    }, [coords, zoom, map]);
    return null;
}

 function Dashboard() {
    const { observaciones, loading, error } = useFetchObservaciones();
    const { elementos, loading: loadElem } = useFetchElementos();
    const { tramos, loading: loadTramo } = useFetchTramos();
    const location = useLocation();
    const mapaRef = useRef(null);

    const defaultCenter = [23.70018665574605, -102.38329038465977];
    const defaultZoom = 5;
    const query = new URLSearchParams(location.search);
    const urlLat = parseFloat(query.get('lat'));
    const urlLng = parseFloat(query.get('lng'));
    const urlZoom = parseInt(query.get('zoom'));
    const urlId = parseInt(query.get('id'));

    const currentCenter = (urlLat && urlLng) ? [urlLat, urlLng] : defaultCenter;
    const currentZoom = urlZoom || defaultZoom;


    const totalObservaciones = observaciones ? observaciones.length : 0;
    const totalImagenes = observaciones ? observaciones.reduce((acc, obs) => acc + (obs.imagenes?.length || 0), 0) : 0;
    const completados = observaciones ? observaciones.filter(o => o.estado === 'Completado').length : 0;
    const estadisticasElementos = elementos?.map(el => {
        return {
            nombre: el.nombre,
            cantidad: observaciones.filter(obs => obs.elementoId === el.id).length
        };
    }) || [];

     useEffect(() => {
        if (urlId && mapaRef.current) {
            setTimeout(() => {
                mapaRef.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center'
                });
            }, 500); 
        }
    }, [urlId, loading]);

    if (loading) return <p style={{padding: '20px'}}>Cargando estadísticas...</p>;
    if (error) return <p>Error al cargar datos.</p>;

    const puntosMapa = observaciones?.map(obs => ({
        ...obs,
        lat: obs.lat || 19.4326 + (parseFloat(obs.kilometro) / 100),
        lng: obs.lng || -99.1332
    })) || [];



    const conteoEstados = {
        'Reportado' : observaciones.filter(o => o.estado === 'Reportado').length,
        'En proceso' : observaciones.filter(o => o.estado === 'En proceso').length,
        'Completado' : observaciones.filter(o => o.estado === 'Completado').length,
    };

    const dataPie = {
        labels: ['Reportado', 'En proceso', 'Completado'],
        datasets: [{
            data: [conteoEstados.Reportado, conteoEstados['En proceso'], conteoEstados.Completado],
            backgroundColor: ['#dc3445', '#ffc107', '#28a745'],
            hoverOffset: 4
        }]
    };

    const etiquetasTramos = tramos?.map(t => `${t.inicio} - ${t.destino}`) || [];

    const datosPorTramo = tramos?.map(t => {
        return observaciones.filter(obs => obs.tramoId === t.id).length;
    }) || [];
    const dataBar = {
        labels: etiquetasTramos,
        datasets: [{
            label: 'Número de observaciones',
            data: datosPorTramo,
            backgroundColor: ['#3498db'],
            borderColor: '#2980b9',
            borderWidth: 1
        }]
    };
    const optionsBar = {
        responsive: true,
        indexAxis: 'y',
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, 
            title: {
                display: true,
                text: 'Distribución de Daños por Tramo Carretero'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
            }
        }
    };



    const gridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    };

    const cardSummaryStyle = (color) => ({
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        borderLeft: `6px solid ${color}`,
        textAlign: 'center'
    });

    const numberStyle = {
        fontSize: '2.5em',
        fontWeight: 'bold',
        margin: '10px 0',
        color: '#333'
    };

    return(
        <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Dashboard de Control</h1>
             <div style={gridContainerStyle}>
                <div style={cardSummaryStyle('#3498db')}>
                    <span style={{ fontSize: '1.2em', color: '#7f8c8d' }}>Total Reportes</span>
                    <div style={numberStyle}>{totalObservaciones}</div>
                </div>
                <div style={cardSummaryStyle('#9b59b6')}>
                    <span style={{ fontSize: '1.2em', color: '#7f8c8d' }}>Fotos en Sistema</span>
                    <div style={numberStyle}>{totalImagenes}</div>
                </div>
                <div style={cardSummaryStyle('#27ae60')}>
                    <span style={{ fontSize: '1.2em', color: '#7f8c8d' }}>Reparaciones Listas</span>
                    <div style={numberStyle}>{completados}</div>
                </div>
            </div>

            <h2 style={{ color: '#34495e', marginBottom: '20px' }}>Afectaciones por Tipo de Elemento</h2>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                gap: '15px',
                marginBottom: '40px' 
            }}>
                {estadisticasElementos.map((item, index) => (
                    <div key={index} style={{
                        padding: '15px', 
                        backgroundColor: '#fff', 
                        borderRadius: '8px', 
                        border: '1px solid #e1e4e8',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{fontWeight: '500'}}>{item.nombre}</span>
                        <span style={{
                            backgroundColor: '#ebf5ff', 
                            color: '#007bff', 
                            padding: '4px 10px', 
                            borderRadius: '15px',
                            fontWeight: 'bold'
                        }}>
                            {item.cantidad}
                        </span>
                    </div>
                ))}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                    <h3>Total de Observaciones</h3>
                    <p style={{ fontSize: '3em', margin: '10px 0', color: '#333' }}>{observaciones.length}</p>
                </div>

                <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ textAlign: 'center' }}>Distribución por Estado</h3>
                    <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                        <Pie data={dataPie} />
                    </div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.8)', gridColumn: 'span 2' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Análisis por Ubicación</h3>
                    <div style={{ height: '350px' }}>
                        <Bar data={dataBar} options={optionsBar} />
                    </div>
                </div>
            </div>
            <div style={{ padding: '30px' }}>
            {/* ... tus tarjetas y gráficas ... */}

            <h2 style={{ marginBottom: '20px' }}>Geolocalización de Afectaciones</h2>
            <div ref={mapaRef} style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <MapContainer center={currentCenter} zoom={currentZoom} style={{ height: '500px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="www.openstreetmap.org">OpenStreetMap</a>'
                    />
                    <RecenterMap coords={currentCenter} zoom={currentZoom} />
                    {puntosMapa.map(punto => (
                        <Marker 
                            key={punto.id} 
                            position={[punto.lat, punto.lng]}
                            eventHandlers={{
                                add: (e) => {
                                    if (punto.id === urlId) e.target.openPopup();
                                }
                            }}
                            >
                            <Popup>
                                <strong>ID #{punto.id}</strong><br />
                                {punto.observacion_corta}<br />
                                <span style={{color: punto.estado === 'Completado' ? 'green' : 'red'}}>
                                    Estado: {punto.estado}
                                </span>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
        </div>
    );
 }

 export default Dashboard;