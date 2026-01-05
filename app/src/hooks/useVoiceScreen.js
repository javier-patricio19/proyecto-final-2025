import { useState, useEffect, useCallback } from 'react';
import Voice from '@react-native-voice/voice';
import { procesarTextoDictado } from '../utils/VoiceLogic';

export const useVoiceScreen = (navigation, routeParams) => {
    const { tramoId, tramoNombre, fotos, coords } = routeParams;

    const [grabando, setGrabando] = useState(false);
    const [textoParcial, setTextoParcial] = useState('');
    const [procesando, setProcesando] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: '', title: '', message: '' });

    const showAlert = (type, title, message) => {
        setAlertConfig({ visible: true, type, title, message });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    // --- MANEJADORES DE VOZ ---
    
    // Se dispara cuando detecta que empezaste a hablar
    const onSpeechStart = () => {
        setGrabando(true);
        setTextoParcial('');
    };

    // Se dispara cuando detecta que dejaste de hablar
    const onSpeechEnd = () => {
        setGrabando(false);
    };

    // Resultados parciales (tiempo real)
    const onSpeechPartialResults = (e) => {
        if (e.value && e.value.length > 0) {
            setTextoParcial(e.value[0]);
        }
    };

    // Resultados finales
    const onSpeechResults = async (e) => {
        if (e.value && e.value.length > 0) {
            const textoFinal = e.value[0];
            await procesarYNavegar(textoFinal);
        }
    };

    const onSpeechError = (e) => {
        setGrabando(false);
        // Ignoramos errores de "no speech" (7) o reconocimiento en progreso (5)
        const errMsg = e.error?.message || '';
        if (errMsg.includes('7') || errMsg.includes('no speech')) return;
        
        showAlert('error', 'Error de Voz', 'No te escuché bien, intenta de nuevo.');
        console.log("Error Voice:", e);
    };

    // --- CICLO DE VIDA ---
    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    // --- ACCIONES ---

    const toggleGrabacion = async () => {
        if (grabando) {
            try { await Voice.stop(); } catch (e) { console.error(e); }
        } else {
            try { 
                setTextoParcial('');
                await Voice.start('es-ES'); 
            } catch (e) { console.error(e); }
        }
    };

    const procesarYNavegar = async (texto) => {
        setProcesando(true);
        try {
            // Tu lógica de Regex
            const formBase = { elementoId: '', kilometro: '', cuerpo: '', carril: '', observacion: '', recomendacion: '' };
            const datosDetectados = await procesarTextoDictado(texto, formBase);

            setProcesando(false);
            // Navegación
            navigation.navigate('FormularioObservacion', { 
                tramoId, tramoNombre, fotos, coords, datosDetectados 
            });

        } catch (error) {
            setProcesando(false);
            showAlert('error', 'Error Lógica', 'No pude procesar los datos del dictado.');
        }
    };

    return {
        grabando,
        textoParcial,
        procesando,
        alertConfig,
        hideAlert,
        toggleGrabacion,
        fotos
    };
};