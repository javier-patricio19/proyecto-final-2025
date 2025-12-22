import { useMemo } from 'react';
import { useFetchObservaciones } from "../hooks/observacionesHooks";
import { useFetchElementos } from "../hooks/elementosHook";
import { useFetchTramos } from "../hooks/tramosHook";

export const useDashboardStats = () => {
    const { observaciones, loading: loadObs, error } = useFetchObservaciones();
    const { elementos, loading: loadElem } = useFetchElementos();
    const { tramos, loading: loadTramo } = useFetchTramos();

    const loading = loadObs || loadElem || loadTramo;

    const stats = useMemo(() => {
        if (!observaciones) return { total: 0, imagenes: 0, completados: 0 };
        return {
            total: observaciones.length,
            imagenes: observaciones.reduce((acc, obs) => acc + (obs.imagenes?.length || 0), 0),
            completados: observaciones.filter(o => o.estado === 'Completado').length
        };
    }, [observaciones]);

    const elementosStats = useMemo(() => {
        if (!elementos || !observaciones) return [];
        return elementos.map(el => ({
            nombre: el.nombre,
            cantidad: observaciones.filter(obs => obs.elementoId === el.id).length
        }));
    }, [elementos, observaciones]);

    const pieChartData = useMemo(() => {
        if (!observaciones) return null;
        const counts = {
            Reportado: observaciones.filter(o => o.estado === 'Reportado').length,
            EnProceso: observaciones.filter(o => o.estado === 'En proceso').length,
            Completado: observaciones.filter(o => o.estado === 'Completado').length,
        };
        return {
            labels: ['Reportado', 'En proceso', 'Completado'],
            datasets: [{
                data: [counts.Reportado, counts.EnProceso, counts.Completado],
                backgroundColor: ['#dc3545', '#ffc107', '#28a745'],
                hoverOffset: 4
            }]
        };
    }, [observaciones]);
    const barChartData = useMemo(() => {
        if (!tramos || !observaciones) return null;
        return {
            labels: tramos.map(t => `${t.inicio} - ${t.destino}`),
            datasets: [{
                label: 'Observaciones',
                data: tramos.map(t => observaciones.filter(obs => obs.tramoId === t.id).length),
                backgroundColor: '#3498db',
                borderRadius: 4
            }]
        };
    }, [tramos, observaciones]);

    const mapPoints = useMemo(() => {
        return observaciones?.map(obs => ({
            ...obs,
            lat: obs.lat || 19.4326 + (parseFloat(obs.kilometro) / 100),
            lng: obs.lng || -99.1332
        })) || [];
    }, [observaciones]);

    const elementosChartData = useMemo(() => {
        if (!elementos || !observaciones) return null;

        const dataProcesada = elementos.map(el => ({
            nombre: el.nombre,
            cantidad: observaciones.filter(obs => obs.elementoId === el.id).length
        })).filter(item => item.cantidad > 0);

        return {
            labels: dataProcesada.map(d => d.nombre),
            datasets: [{
                label: 'Fallas reportadas',
                data: dataProcesada.map(d => d.cantidad),
                backgroundColor: 'rgba(255, 206, 86, 0.7)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
                borderRadius: 4,
            }]
        };
    }, [elementos, observaciones]);

    const lineChartData = useMemo(() => {
        if (!observaciones) return null;

        const porMes = observaciones.reduce((acc, obs) => {
            const fecha = new Date(obs.fecha);
            const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const llavesOrdenadas = Object.keys(porMes).sort();

        const labels = llavesOrdenadas.map(key => {
            const [year, month] = key.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
        });

        return {
            labels: labels,
            datasets: [{
                label: 'Reportes por Mes',
                data: llavesOrdenadas.map(key => porMes[key]),
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.2)', 
                tension: 0.4, 
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#3498db'
            }]
        };
    }, [observaciones]);

    return {
        loading,
        error,
        stats,
        elementosStats,
        pieChartData,
        barChartData,
        elementosChartData,
        lineChartData,
        mapPoints
    };
};