import React, { useState, useEffect, useCallback } from 'react';
import { useFetchObservaciones } from '../hooks/observacionesHooks';

function GaleriaImagenes() {
    const { observaciones, loading, error } = useFetchObservaciones();
    const [allImages, setAllImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);

    useEffect(() => {
        if (observaciones) {
            const flatList = observaciones.flatMap(obs => 
                (obs.imagenes || []).map(img => `${img.ruta}`)
            );
            setAllImages(flatList);
        }
    }, [observaciones]);

    const nextImage = useCallback((e) => {
        if(e) e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, [allImages.length]);

    const prevImage = useCallback((e) => {
        if(e) e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    },[allImages.length]);

    const closeLightbox = useCallback(() => {
        setCurrentIndex(null);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (currentIndex === null) return;

            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "Escape") closeLightbox();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, nextImage, prevImage, closeLightbox]);

    if (loading) return <p style={{padding: '20px'}}>Cargando galería...</p>;
    if (error) return <p style={{padding: '20px', color: 'red'}}>Error: {error.message}</p>;

    const lightboxOverlay = {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center',
        alignItems: 'center', zIndex: 2000, outline: 'none'
    };

    const navButtonStyle = {
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: 'none',
        fontSize: '50px', padding: '20px', cursor: 'pointer', borderRadius: '10px',
        transition: '0.2s', outline: 'none'
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Galería de Imágenes</h1>
            {currentIndex !== null && (
                <div style={lightboxOverlay} onClick={(closeLightbox) => setCurrentIndex(null)}>
                    <button style={{ position: 'absolute', top: '20px', right: '30px', color: 'white', fontSize: '40px', background: 'none', border: 'none', cursor: 'pointer' }} onclick={closeLightbox}>&times;</button>
                    <button style={{ ...navButtonStyle, left: '20px' }} onClick={prevImage}>&#10094;</button>
                    <img 
                        src={allImages[currentIndex]} 
                        alt="Visualización" 
                        style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }} 
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button style={{ ...navButtonStyle, right: '20px' }} onClick={nextImage}>&#10095;</button>
                    <div style={{ position: 'absolute', bottom: '20px', color: 'white', fontSize: '1.1em' }}>
                        {currentIndex + 1} / {allImages.length}
                    </div>
                </div>
            )}
            {observaciones.map(obs => (
                obs.imagenes && obs.imagenes.length > 0 && (
                    <div key={obs.id} style={{ marginBottom: '40px' }}>
                        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '5px' }}>
                            ID #{obs.id} <small style={{fontSize: '0.8em', color: '#888'}}> - {obs.observacion_corta}</small>
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {obs.imagenes.map((img) => {
                                const fullPath = `${img.ruta}`;
                                return (
                                    <div key={img.id} style={{ overflow: 'hidden', borderRadius: '8px' }}>
                                        <img 
                                            src={fullPath} 
                                            alt={img.nombre} 
                                            onClick={() => setCurrentIndex(allImages.indexOf(fullPath))}
                                            style={{ 
                                                width: '180px', height: '130px', objectFit: 'cover', 
                                                cursor: 'pointer', transition: '0.3s transform' 
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
}

export default GaleriaImagenes;