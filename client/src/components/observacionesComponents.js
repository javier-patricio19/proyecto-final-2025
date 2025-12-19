import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteObservacion, useObservacionForm, useUpdateObservacion } from '../hooks/observacionesHooks';
import { useFetchTramos } from "../hooks/tramosHook";
import { useFetchElementos } from "../hooks/elementosHook";
import { deleteMultipleObservaciones, actualizarEstadoObservacion } from "../services/observacionesService";
import { obtenerPreviewPDF, descargarPDF } from "../services/reporteService";
import ObservacionCard from './ObservacionCard';
import FiltrosSeccion from './FiltrosSeccion';
import ObservacionModal from './ObservacionModal';
import PDFPreviewModal from "./PDFPreviewModal";
import ActionDrop from "./ActionDrop"; 
import '../styles/Formularios.css'; 
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import '../styles/Observaciones.css'

export const ListaObservaciones = ({ observaciones, loading, error, onEdit, onDataChangeCallback }) => {
    const { handleDelete } = useDeleteObservacion(onDataChangeCallback);
    const [expandedObsId, setExpandedObsId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filterTramo, setFilterTramo] = useState('Todos');
    const [filterElemento, setFilterElemento] = useState('Todos');
    const [filterEstado, setFilterEstado] = useState('Todos');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [tempObs, setTempObs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('fecha_desc');
    const Navigate = useNavigate();

    const { tramos } = useFetchTramos();
    const { elementos } = useFetchElementos();
    const estados = ['Todos', 'Reportado', 'En proceso', 'Completado'];


    const verEnMapa = (item) => {
        if (!item.lat || !item.lng) {
            toast.info("Esta observación no tiene coordenadas GPS.");
            return;
        }
        Navigate(`/?lat=${item.lat}&lng=${item.lng}&zoom=18&id=${item.id}`);
    };

    const handleVerPreview = async (seleccion) => {
        try {
            const url = await obtenerPreviewPDF(seleccion); 
            if (url) {
                setPreviewUrl(url);
                setTempObs(seleccion);
            }
        } catch (error) {
            console.error("Error crítico al generar PDF:", error);
            toast.error("Error al procesar las imágenes para el PDF");
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        const result = await Swal.fire({
            title: '¿Eliminar selección?',
            text: `Se borrarán ${selectedIds.length} observaciones permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar todo',
            confirmButtonColor: '#d33'
        });

        if (result.isConfirmed) {
            try {
                await deleteMultipleObservaciones(selectedIds);
                selectedIds.forEach(id => {
                    if (onDataChangeCallback) onDataChangeCallback(id);
                });
                setSelectedIds([]); 
                toast.info("Eliminación masiva completada.");
            } catch (error) {
                toast.error("Error en la eliminación masiva.");
            }
        }
    };

    const handleCambiarEstado = async (item) => {
        const { value: nuevoEstado } = await Swal.fire({
            title: 'Actualizar Estado',
            input: 'select',
            inputOptions: {
                'Reportado': 'Reportado',
                'En proceso': 'En proceso',
                'Completado': 'Completado'
            },
            inputValue: item.estado,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar'
        });

        if (nuevoEstado && nuevoEstado !== item.estado) {
            try {
                const actualizado = await actualizarEstadoObservacion(item.id, nuevoEstado);
                onDataChangeCallback({ ...item, ...actualizado }); 
                toast.success(`Estado: ${nuevoEstado}`);
            } catch (error) {
                toast.error("Error al actualizar estado");
            }
        }
    };

    const safeTramos = tramos || [];
    const safeElementos = elementos || [];

    let processedData = observaciones.filter(item => {
        const matchesTramo = filterTramo === 'Todos' || item.tramoId === parseInt(filterTramo);
        const matchesElemento = filterElemento === 'Todos' || item.elementoId === parseInt(filterElemento);
        const matchesEstado = filterEstado === 'Todos' || item.estado === filterEstado;
        const busqueda = searchTerm.toLowerCase();
        return matchesTramo && matchesElemento && matchesEstado && (
            item.observacion.toLowerCase().includes(busqueda) ||
            item.observacion_corta.toLowerCase().includes(busqueda) ||
            item.kilometro.toLowerCase().includes(busqueda)
        );
    });

    processedData.sort((a, b) => {
        if (sortBy === 'fecha_desc') return new Date(b.fecha) - new Date(a.fecha);
        if (sortBy === 'fecha_asc') return new Date(a.fecha) - new Date(b.fecha);
        if (sortBy === 'km_asc') return parseFloat(a.kilometro) - parseFloat(b.kilometro);
        if (sortBy === 'km_desc') return parseFloat(b.kilometro) - parseFloat(a.kilometro);
        if (sortBy === 'id_desc') return b.id - a.id;
        return 0;
    });

    const getTramoNombre = (id) => {
        const t = safeTramos.find(x => x.id === id);
        return t ? `${t.inicio} - ${t.destino}` : 'N/A';
    };

    const getElementoNombre = (id) => safeElementos.find(e => e.id === id)?.nombre || 'N/A';

    if (loading) return <p className="loading-text">Cargando observaciones...</p>;
    if (error) return <p className="error-text">Error: {error.message}</p>;

    return (
        <div className="lista-main-container">
            <h2 className="title-view">Lista de Observaciones: {observaciones.length} elementos</h2>
            
            <FiltrosSeccion 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                filterTramo={filterTramo} setFilterTramo={setFilterTramo}
                filterElemento={filterElemento} setFilterElemento={setFilterElemento}
                filterEstado={filterEstado} setFilterEstado={setFilterEstado}
                sortBy={sortBy} setSortBy={setSortBy}
                tramos={safeTramos} elementos={safeElementos} estados={estados}
                onClear={() => {setSearchTerm(''); setFilterTramo('Todos'); setFilterElemento('Todos'); setFilterEstado('Todos');}}
            />

            {selectedIds.length > 0 && (
                <div className="bulk-panel">
                    <span>{selectedIds.length} seleccionadas</span>
                    <div className="bulk-buttons">
                        <button onClick={() => handleVerPreview(observaciones.filter(o => selectedIds.includes(o.id)))}>Reporte Grupal</button>
                        <button onClick={handleBulkDelete} className="btn-danger-action">Eliminar Seleccionadas</button>
                        <button onClick={() => setSelectedIds([])} className="btn-cancel-flat">Cancelar</button>
                    </div>
                </div>
            )}

            <div className="cards-list">
                {processedData.length > 0 ? (
                    processedData.map(item => (
                        <ObservacionCard 
                            key={item.id}
                            item={item}
                            isSelected={selectedIds.includes(item.id)}
                            onSelect={toggleSelect}
                            onStatusClick={handleCambiarEstado}
                            onViewMap={verEnMapa}
                            onPrint={handleVerPreview}
                            onExpand={setExpandedObsId}
                            onEdit={onEdit}
                            onDelete={handleDelete}
                            getTramoNombre={getTramoNombre}
                            getElementoNombre={getElementoNombre}
                            ActionDrop={ActionDrop}
                        />
                    ))
                ) : (
                    <p className="no-results">No se encontraron resultados.</p>
                )}
            </div>

            {expandedObsId && <ObservacionModal observacionId={expandedObsId} onClose={() => setExpandedObsId(null)} />}
            
            {previewUrl && (
                <PDFPreviewModal 
                    pdfUrl={previewUrl} 
                    onClose={() => { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}
                    onDownload={() => descargarPDF(tempObs)}
                />
            )}
        </div>
    );
};
