import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteObservacion } from '../../hooks/observacionesHooks';
import { useFetchTramos } from "../../hooks/tramosHook";
import { useFetchElementos } from "../../hooks/elementosHook";
import { useFiltros } from "../../hooks/FiltrosSeccion";
import FiltrosSeccion from './FiltrosSeccion';
import { deleteMultipleObservaciones, updateEstadoObservacion } from "../../services/observacionesService";
import { obtenerPreviewPDF, descargarPDF } from "../../services/reporteService";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import ObservacionCard from './ObservacionCard';
import ObservacionModal from './ObservacionModal';
import PDFPreviewModal from "./PDFPreviewModal";
import ActionDrop from "./ActionDrop";
import styles from '../../styles/stylesObservacion/ListaObservaciones.module.css';

export const ListaObservaciones = ({ observaciones, loading, error, onEdit, onDataChangeCallback }) => {
    const { handleDelete } = useDeleteObservacion(onDataChangeCallback);
    const Navigate = useNavigate();

    const { tramos } = useFetchTramos();
    const { elementos } = useFetchElementos();

    const safeTramos = tramos || [];
    const safeElementos = elementos || [];

    const [expandedObsId, setExpandedObsId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [tempObs, setTempObs] = useState([]);

    const { 
        filtros, 
        datosFiltrados, 
        handleChange, 
        limpiarFiltros 
    } = useFiltros(observaciones, safeTramos, safeElementos);

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
            confirmButtonColor: '#d33',
            background: 'var(--card-bg)',
            color: 'var(--text-main)'
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
            cancelButtonText: 'Cancelar',
            background: 'var(--card-bg)',
            color: 'var(--card-bg)'
        });

        if (nuevoEstado && nuevoEstado !== item.estado) {
            try {
                const actualizado = await updateEstadoObservacion(item.id, nuevoEstado);
                if (onDataChangeCallback) onDataChangeCallback({ ...item, ...actualizado }); 
                toast.success(`Estado: ${nuevoEstado}`);
            } catch (error) {
                toast.error("Error al actualizar estado");
            }
        }
    };

     const getTramoNombre = (id) => {
        const t = safeTramos.find(x => x.id === id);
        return t ? `${t.inicio} - ${t.destino}` : 'N/A';
    };
    const getElementoNombre = (id) => safeElementos.find(e => e.id === id)?.nombre || 'N/A';

    const areAllSelected = datosFiltrados.length > 0 && selectedIds.length === datosFiltrados.length;
    const handleSelectAll = () => {
        if (areAllSelected) {
            setSelectedIds([]); 
        } else {
            setSelectedIds(datosFiltrados.map(item => item.id));
        }
    };

    if (loading) return <p className={styles.loadingText}>Cargando observaciones...</p>;
    if (error) return <p className={styles.errorText}>Error: {error.message}</p>;

    return (
        <div className={styles.mainContainer}>
            <h2 className={styles.titleView}>Lista de Observaciones: {observaciones.length} elementos</h2>
            
            <FiltrosSeccion 
                tramos={safeTramos}
                elementos={safeElementos}
                filtros={filtros}
                onChange={handleChange}
                onLimpiar={limpiarFiltros}
            />

            {selectedIds.length > 0 && (
                <div className={styles.bulkPanel}>
                    <button 
                        onClick={handleSelectAll} 
                        className={styles.btnSelectAll}
                        title={areAllSelected ? "Deseleccionar todo" : "Seleccionar todo lo visible"}
                    >
                        {areAllSelected ? '☑ Todo' : '☐ Todo'}
                    </button>
                    <span>{selectedIds.length} seleccionadas</span>
                    <div className={styles.bulkButtons}>
                        <button onClick={() => handleVerPreview(observaciones.filter(o => selectedIds.includes(o.id)))} className={styles.btnBulk}>
                            📄 Reporte Grupal
                        </button>
                        <button onClick={handleBulkDelete} className={styles.btnDangerAction}>
                            🗑 Eliminar
                        </button>
                        <button onClick={() => setSelectedIds([])} className={styles.btnCancelFlat}>
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.cardsList}>
                {datosFiltrados.length > 0 ? (
                    datosFiltrados.map(item => (
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
                    <p className={styles.noResults}>No se encontraron resultados.</p>
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