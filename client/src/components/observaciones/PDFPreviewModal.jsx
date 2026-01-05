import React, { useEffect, useState } from 'react';
import styles from '../../styles/stylesObservacion/PDFPreviewModal.module.css';

const PDFPreviewModal = ({ pdfUrl, onClose, onDownload }) => {
    const [isLoading, setIsLoading] = useState(true);

    // Cerrar con tecla ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Ocultar spinner cuando el iframe termina de cargar
    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!pdfUrl) return null;

    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.toolbar}>
                <button 
                    onClick={onClose} 
                    className={`${styles.btn} ${styles.btnClose}`}
                >
                    ✕ Cerrar
                </button>
                
                {/* Título opcional para contexto */}
                <span className={styles.modalTitle}>Vista Previa</span>

                <button 
                    onClick={onDownload} 
                    className={`${styles.btn} ${styles.btnDownload}`}
                >
                    ⬇ Descargar
                </button>
            </div>
            
            <div className={styles.content}>
                {/* Indicador de carga visible mientras isLoading es true */}
                {isLoading && (
                    <div className={styles.loaderContainer}>
                        <div className={styles.spinner}></div>
                        <p>Cargando documento...</p>
                    </div>
                )}

                <iframe 
                    title="Vista Previa PDF" 
                    src={pdfUrl} 
                    className={styles.iframe}
                    onLoad={handleIframeLoad}
                />
            </div>
        </div>
    );
};

export default PDFPreviewModal;