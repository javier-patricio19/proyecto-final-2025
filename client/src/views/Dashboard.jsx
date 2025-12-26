import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useLocation } from "react-router-dom";
import { Pie, Bar, Line } from "react-chartjs-2";
import { 
    Chart as ChartJS, ArcElement, Tooltip, Legend, 
    CategoryScale, LinearScale, BarElement, Title,
    PointElement, LineElement, Filler
} from "chart.js";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useDashboardStats } from "../hooks/useDashboardStats";
import styles from "../styles/Dashboard.module.css";
import { usePageTitle } from "../hooks/usePageTitle";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler);

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
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
    usePageTitle("Dashboard");
    const { 
        loading, error, 
        stats, elementosStats, 
        pieChartData, barChartData, 
        elementosChartData, lineChartData,
         mapPoints 
    } = useDashboardStats();

    const location = useLocation();
    const mapaRef = useRef(null);
    
    const query = new URLSearchParams(location.search);
    const urlLat = parseFloat(query.get('lat'));
    const urlLng = parseFloat(query.get('lng'));
    const urlZoom = parseInt(query.get('zoom'));
    const urlId = parseInt(query.get('id'));

    const defaultCenter = [23.700, -102.383];
    const currentCenter = (urlLat && urlLng) ? [urlLat, urlLng] : defaultCenter;
    const currentZoom = urlZoom || 5;

    useEffect(() => {
        if (urlId && mapaRef.current) {
            setTimeout(() => {
                mapaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [urlId, loading]);

    const [chartColor, setChartColor] = React.useState('#cccccc');

    useEffect(() => {
        const updateColor = () => {
            const color = getComputedStyle(document.documentElement)
                .getPropertyValue('--text-main')
                .trim();
            if (color) setChartColor(color);
        };
        updateColor();
        
        const observer = new MutationObserver(updateColor);
        
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });

        return () => observer.disconnect();
    }, []); 

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { 
                position: 'bottom',
                labels: { 
                    color: chartColor, 
                    font: { size: 12 }
                } 
            },
            title: { display: false }
        },
        scales: {
            y: { 
                ticks: { 
                    color: chartColor, 
                    font: { weight: '500' }
                }, 
                grid: { color: 'rgba(128, 128, 128, 0.25)' } 
            },
            x: { 
                ticks: { 
                    color: chartColor, 
                    font: { weight: '500' }
                }, 
                grid: { display: false } 
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { 
                position: 'bottom', 
                labels: { color: chartColor } 
            } 
        }
    };

    if (loading) return <div className={styles.container}><p>Cargando estadísticas...</p></div>;
    if (error) return <div className={styles.container}><p style={{color: 'var(--danger)'}}>Error al cargar datos.</p></div>;

    return(
        <div className={styles.container}>
            <h1 className={styles.title}>Dashboard de Control</h1>
            
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard} style={{borderLeftColor: '#3498db'}}>
                    <span className={styles.cardLabel}>Total Reportes</span>
                    <div className={styles.cardNumber}>{stats.total}</div>
                </div>
                <div className={styles.summaryCard} style={{borderLeftColor: '#9b59b6'}}>
                    <span className={styles.cardLabel}>Fotos en Sistema</span>
                    <div className={styles.cardNumber}>{stats.imagenes}</div>
                </div>
                <div className={styles.summaryCard} style={{borderLeftColor: '#27ae60'}}>
                    <span className={styles.cardLabel}>Reparaciones Listas</span>
                    <div className={styles.cardNumber}>{stats.completados}</div>
                </div>
            </div>

            <h2 style={{color: 'var(--text-main)', marginBottom: '15px'}}>Afectaciones por Elemento</h2>
            <div className={styles.elementsGrid}>
                {elementosStats.map((item, index) => (
                    <div key={index} className={styles.elementCard}>
                        <span style={{fontWeight: '500'}}>{item.nombre}</span>
                        <span className={styles.badge}>{item.cantidad}</span>
                    </div>
                ))}
            </div>
        
            <div className={styles.chartsSection}>
                {pieChartData && (
                    <div className={styles.chartContainer}>
                        <h3 className={styles.chartTitle}>Distribución por Estado</h3>
                        <div style={{flex: 1, position: 'relative'}}>
                            <Pie data={pieChartData} options={pieOptions} />
                        </div>
                    </div>
                )}

                {elementosChartData && (
                    <div className={styles.chartContainer}>
                        <h3 className={styles.chartTitle}>Reportes por Elemento</h3>
                        <div style={{flex: 1, position: 'relative'}}>
                            <Bar 
                                data={elementosChartData} 
                                options={{...chartOptions, indexAxis: 'y'}} 
                            />
                        </div>
                    </div>
                )}
                
                {barChartData && (
                    <div className={`${styles.chartContainer} ${styles.fullWidth}`}>
                        <h3 className={styles.chartTitle}>Distribución por Tramo</h3>
                        <div style={{flex: 1, position: 'relative'}}>
                            <Bar 
                                data={barChartData} 
                                options={{...chartOptions, indexAxis: 'y'}} 
                            />
                        </div>
                    </div>
                )}
                
                {lineChartData && (
                    <div className={`${styles.chartContainer} ${styles.fullWidth}`} style={{ marginTop: '20px' }}>
                        <h3 className={styles.chartTitle}>Historial de Reportes</h3>
                        <div style={{flex: 1, position: 'relative', minHeight: '300px'}}>
                            <Line 
                                data={lineChartData} 
                                options={chartOptions} 
                            />
                        </div>
                    </div>
                )}
            </div>
            <h2 style={{color: 'var(--text-main)', marginBottom: '15px'}}>Geolocalización</h2>
            <div ref={mapaRef} className={styles.mapWrapper}>
                <MapContainer center={currentCenter} zoom={currentZoom} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap'
                    />
                    <RecenterMap coords={currentCenter} zoom={currentZoom} />
                    
                    {mapPoints.map(punto => (
                        <Marker 
                            key={punto.id} 
                            position={[punto.lat, punto.lng]}
                            eventHandlers={{
                                add: (e) => { if (punto.id === urlId) e.target.openPopup(); }
                            }}
                        >
                            <Popup className={styles.customPopupWrapper}>
                                <div className={styles.popupCard}>
                                    <div className={styles.popupHeader}>
                                        {punto.fotoPortada ? (
                                            <img 
                                                src={punto.fotoPortada} 
                                                alt="Evidencia" 
                                                className={styles.popupImage} 
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className={styles.popupNoImage}>Sin Foto</div>
                                        )}
                                        <span className={`${styles.popupBadge} ${styles[punto.estado.replace(/\s+/g, '')]}`}>
                                            {punto.estado}
                                        </span>
                                    </div>

                                    <div className={styles.popupContent}>
                                        <h4 className={styles.popupTitle}>{punto.codigo || `ID: ${punto.id}`}</h4>
                                        <p className={styles.popupText}>
                                            {punto.observacion_corta || "Sin descripción disponible."}
                                        </p>
                                        
                                        {/* Link falso para indicar que se puede ver más */}
                                        <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '5px' }}>
                                            <small style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                                                📍 KM {punto.kilometro}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default Dashboard;