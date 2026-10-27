import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
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

    // --- CICLO DE VIDA ---
    useEffect(() => {
        const onSpeechStart = () => {
            setGrabando(true);
            setTextoParcial('');
        };

        const onSpeechEnd = () => {
            setGrabando(false);
        };

        const onSpeechPartialResults = (e) => {
            if (e.value && e.value.length > 0) {
                setTextoParcial(e.value[0]);
            }
        };

        const onSpeechResults = async (e) => {
            if (e.value && e.value.length > 0) {
                const textoFinal = e.value[0];
                setProcesando(true);
                try {
                    const formBase = { elementoId: '', kilometro: '', cuerpo: '', carril: '', observacion: '', recomendacion: '' };
                    const datosDetectados = await procesarTextoDictado(textoFinal, formBase);

                    setProcesando(false);
                    // Navegación
                    navigation.navigate('FormularioObservacion', { 
                        tramoId, tramoNombre, fotos, coords, datosDetectados 
                    });

                } catch (error) {
                    setProcesando(false);
                    showAlert('error', 'Error Lógica', 'No pude procesar los datos del dictado.');
                }
            }
        };

        const onSpeechError = (e) => {
            setGrabando(false);
            const errMsg = e.error?.message || '';
            if (errMsg.includes('7') || errMsg.includes('no speech')) return;
            
            showAlert('error', 'Error de Voz', 'No te escuché bien, intenta de nuevo.');
            console.log("Error Voice:", e);
        };

        if (Voice) {
            Voice.onSpeechStart = onSpeechStart;
            Voice.onSpeechEnd = onSpeechEnd;
            Voice.onSpeechPartialResults = onSpeechPartialResults;
            Voice.onSpeechResults = onSpeechResults;
            Voice.onSpeechError = onSpeechError;
        } else {
            console.warn("Módulo de voz no disponible.");
        }
     
        return () => {
            if (Voice && typeof Voice.destroy === 'function'){
                Voice.destroy().then(() => Voice.removeAllListeners()).catch(e => console.warn(e));
            }
        };
    }, [navigation, tramoId, tramoNombre, fotos, coords]); 

    // --- ACCIONES ---
    const toggleGrabacion = async () => {
        if (!Voice || typeof Voice.start !== 'function') {
            showAlert('error', 'Error de entorno', 'La grabación de voz no está disponible. Usa el APK compilado.');
            return;
        }

        if (grabando) {
            try { await Voice.stop(); } catch (e) { console.error(e); }
        } else {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        showAlert('error', 'Permiso Denegado', 'Necesitas dar permiso al micrófono.');
                        return;
                    }
                } catch (err) {
                    console.warn(err);
                }
            }

            try { 
                setTextoParcial('');
                await Voice.start('es-MX'); 
            } catch (e) { 
                console.log("modulo de voz no disponible.", e);
                const formBase = { elementoId: '', kilometro: '', cuerpo: '', carril: '', observacion: '', recomendacion: ''};
                navigation.navigate('FormularioObservacion', {
                    tramoId,
                    tramoNombre,
                    fotos,
                    coords,
                    datosDetectados: formBase
                });
            }
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