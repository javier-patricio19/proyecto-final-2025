import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditarObservacion } from "../components/observaciones/EditarObservacion";
import { toast } from 'react-toastify';
import { usePageTitle } from "../hooks/usePageTitle";

// Si tienes un archivo de estilos globales o un módulo para el layout, impórtalo aquí.
// Ejemplo: import styles from '../styles/Layout.module.css';

const EditarObservacionesPage = () => {
    usePageTitle("Editar Observación");
    const navigate = useNavigate();
    const { id } = useParams();
    
    // Parseo seguro del ID
    const observationId = parseInt(id, 10);

    // Validación: Si el ID no es un número válido, redirigir
    useEffect(() => {
        if (isNaN(observationId)) {
            toast.error("ID de observación no válido.");
            navigate("/verObservaciones");
        }
    }, [observationId, navigate]);

    const handleSuccess = (observacionActualizada) => {
        // Mensaje más descriptivo
        toast.success(`Observación #${observacionActualizada.id || observationId} actualizada correctamente.`);
        navigate("/verObservaciones");
    };

    const handleCancel = () => {
        navigate("/verObservaciones");
    };

    // Evitar renderizar si el ID es inválido
    if (isNaN(observationId)) return null;

    return (
        /* Reemplazamos el style inline por una estructura más semántica */
        <div className="page-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <EditarObservacion
                observacionId={observationId}
                onSuccessCallback={handleSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default EditarObservacionesPage;