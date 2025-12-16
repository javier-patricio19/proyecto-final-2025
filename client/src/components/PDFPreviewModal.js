import React from 'react';

const PDFPreviewModal = ({ pdfUrl, onClose, onDownload }) => {
    const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' };
    const contentStyle = { width: '90%', height: '85%', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' };
    const toolbarStyle = { width: '90%', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' };

    return (
        <div style={overlayStyle}>
            <div style={toolbarStyle}>
                <button onClick={onClose} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}>Cerrar Vista Previa</button>
                <button onClick={onDownload} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px' }}>Descargar Ahora</button>
            </div>
            <div style={contentStyle}>
                <iframe title="Preview PDF" src={pdfUrl} width="100%" height="100%" style={{ border: 'none' }} />
            </div>
        </div>
    );
};

export default PDFPreviewModal;
