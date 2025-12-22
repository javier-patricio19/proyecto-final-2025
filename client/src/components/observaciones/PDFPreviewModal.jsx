import React from 'react';
import styles from '../../styles/stylesObservacion/PDFPreviewModal.module.css';

const PDFPreviewModal = ({ pdfUrl, onClose, onDownload }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.toolbar}>
                <button 
                    onClick={onClose} 
                    className={`${styles.btn} ${styles.btnClose}`}
                >
                    Cerrar Vista Previa
                </button>
                <button 
                    onClick={onDownload} 
                    className={`${styles.btn} ${styles.btnDownload}`}
                >
                    ⬇ Descargar Ahora
                </button>
            </div>
            
            <div className={styles.content}>
                <iframe 
                    title="Preview PDF" 
                    src={pdfUrl} 
                    className={styles.iframe}
                />
            </div>
        </div>
    );
};

export default PDFPreviewModal;