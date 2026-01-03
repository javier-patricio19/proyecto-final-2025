import { useState, useEffect, useRef } from 'react';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';

export const useCapturaScreen = (navigation, routeParams) => {
    const { tramoId, tramoNombre } = routeParams;
    
    // Referencias
    const cameraRef = useRef(null);
    const scrollRef = useRef(null);
    
    // Estado
    const [permission, requestPermission] = useCameraPermissions();
    const [fotos, setFotos] = useState([]);
    const [coords, setCoords] = useState(null);
    const [tomandoFoto, setTomandoFoto] = useState(false);
    
    // Alertas
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '', buttons: [] });

    // --- ALERTAS HELPERS ---
    const showAlert = (type, title, message, buttons = []) => {
        setAlertConfig({ visible: true, type, title, message, buttons });
    };
    
    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    // --- CICLO DE VIDA ---
    useEffect(() => {
        obtenerGPS();
    }, []);

    // Auto-scroll al tomar foto nueva
    useEffect(() => {
        if (scrollRef.current && fotos.length > 0) {
            scrollRef.current.scrollToEnd({ animated: true });
        }
    }, [fotos]);

    // --- LÓGICA GPS ---
    const obtenerGPS = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                showAlert('error', 'Permiso Requerido', 'Se requiere ubicación para geolocalizar la evidencia.', [
                    { text: 'Salir', onPress: () => navigation.goBack(), style: 'destructive' }
                ]);
                return;
            }
            
            // Obtenemos posición (High Accuracy)
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setCoords(location.coords);
        } catch (e) {
            console.log("Error GPS:", e);
        }
    };

    // --- LÓGICA CÁMARA ---
    const tomarFoto = async () => {
        if (!cameraRef.current || tomandoFoto) return;
        setTomandoFoto(true);

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.5,
                skipProcessing: true 
            });

            setFotos(prev => [...prev, photo.uri]);
        } catch (error) {
            console.error(error);
            showAlert('error', 'Error', 'No se pudo capturar la foto.');
        } finally {
            setTomandoFoto(false);
        }
    };

    // --- FINALIZAR ---
    const finalizarCaptura = () => {
        if (fotos.length === 0) {
            showAlert('warning', 'Falta Evidencia', 'Toma al menos una foto.');
            return;
        }
        
        // Navegamos al dictado, pasando fotos y coords
        navigation.replace('VoiceRecord', { 
            tramoId,
            tramoNombre,  
            fotos, 
            coords 
        });
    };

    return {
        // Refs
        cameraRef,
        scrollRef,
        // State
        permission,
        requestPermission,
        fotos,
        coords,
        tomandoFoto,
        alertConfig,
        // Actions
        tomarFoto,
        finalizarCaptura,
        hideAlert
    };
};