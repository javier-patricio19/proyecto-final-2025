import React, { useState, useEffect } from "react";
import { fetchObservacionById } from "../services/observacionesService";
import { fetchTramos } from "../services/tramosService";
import { fetchElementos } from "../services/elementosService";
import '../styles/ObservacionModal.css'

const ObservacionModal = ({ observacionId, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="modal-overlay"><div className="modal-content">Cargando...</div></div>;
    if (error) return <div className="modal-overlay"><div className="modal-content">Error: {error}</div></div>;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Detalles ID: {data.id}</h2>
                <div className="modal-body">
                    <p><strong>Tramo:</strong> {data.observacion}</p>
                    <p><strong>Ubicación:</strong> KM {data.kilometro}, Cuerpo {data.cuerpo}, Carril {data.carril}</p>
                    <p><strong>Observación:</strong> {data.observacion}</p>
                    <p><strong>Estado:</strong> {data.estado}</p>
                    <p><strong>recomendación:</strong> {data.recomendacion}</p>
                    <div className="modal-images">
                        {data.imagenes?.map(img => (
                            <img key={img.id} src={`${img.ruta}`} alt="evidencia" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObservacionModal;
