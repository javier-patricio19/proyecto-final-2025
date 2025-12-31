import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, ScrollView, Platform } from 'react-native';
// ⚠️ NOTA: Ya no usamos Audio de expo-av para grabar archivos, usamos Voice para escuchar directo
import Voice from '@react-native-voice/voice';
import { Ionicons } from '@expo/vector-icons';
import { procesarTextoDictado } from '../utils/VoiceLogic';
import CustomAlert from '../components/CustomAlert';

const VoiceScreen = ({ route, navigation }) => {
    const { tramoId, fotos, coords } = route.params;
    
    const [grabando, setGrabando] = useState(false);
    const [textoParcial, setTextoParcial] = useState(''); // Lo que se ve escribiendo en tiempo real
    const [procesando, setProcesando] = useState(false);
    
    // Alertas
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({ type: 'info', title: '', message: '', buttons: [] });

    const showCustomAlert = (type, title, message, buttons = []) => {
        setModalConfig({ type, title, message, buttons });
        setModalVisible(true);
    };

    // 1. CONFIGURAR LOS EVENTOS DE VOZ AL CARGAR
    useEffect(() => {
        // Vinculamos las funciones de la librería
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults; // <--- LA MAGIA DEL TIEMPO REAL
        Voice.onSpeechError = onSpeechError;

        return () => {
            // Limpieza al salir de la pantalla
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechStart = (e) => {
        console.log('🎤 Comenzó a escuchar');
        setGrabando(true);
        setTextoParcial('');
    };

    const onSpeechEnd = (e) => {
        console.log('🛑 Terminó de escuchar');
        setGrabando(false);
    };

    const onSpeechError = (e) => {
        console.log('❌ Error de voz:', e);
        setGrabando(false);
        // Ignoramos errores de "no speech" (cuando hay silencio) para no molestar
        if (e.error?.message?.includes('7') || e.error?.message?.includes('no speech')) return;
        
        showCustomAlert('error', 'Error', 'Hubo un problema con el reconocimiento de voz.');
    };

    // Se ejecuta FINALMENTE cuando terminas de hablar
    const onSpeechResults = async (e) => {
        console.log('✅ Resultados finales:', e.value);
        if (e.value && e.value.length > 0) {
            const textoFinal = e.value[0]; // El mejor resultado
            procesarYNavegar(textoFinal);
        }
    };

    // Se ejecuta MIENTRAS hablas (letras apareciendo)
    const onSpeechPartialResults = (e) => {
        console.log('📝 Parcial:', e.value);
        if (e.value && e.value.length > 0) {
            setTextoParcial(e.value[0]);
        }
    };

    const iniciarGrabacion = async () => {
        setTextoParcial('');
        try {
            // Iniciamos el servicio nativo en Español
            await Voice.start('es-ES'); 
        } catch (e) {
            console.error(e);
        }
    };

    const detenerGrabacion = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    const procesarYNavegar = async (texto) => {
        setProcesando(true);
        try {
            console.log("⚙️ Procesando texto para formulario...");
            
            // Procesar lógica de negocio (usando tu misma función de siempre)
            const formBase = { elementoId: '', kilometro: '', cuerpo: '', carril: '', observacion: '', recomendacion: '' };
            const datosDetectados = await procesarTextoDictado(texto, formBase);

            setProcesando(false);
            navigation.navigate('FormularioObservacion', { tramoId, fotos, coords, datosDetectados });

        } catch (error) {
            console.error("❌ ERROR LOGICA:", error);
            setProcesando(false);
            showCustomAlert('error', 'Error al procesar', error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Tira de fotos */}
            <View style={{backgroundColor: '#000', paddingVertical: 10, width: '100%'}}>
                <ScrollView horizontal contentContainerStyle={{paddingHorizontal: 10}}>
                    {fotos && fotos.map((uri, i) => (
                        <Image key={i} source={{uri}} style={styles.thumbHeader} />
                    ))}
                </ScrollView>
            </View>

            <View style={styles.content}>
                
                <Text style={styles.title}>
                    {procesando ? "Procesando datos..." : (grabando ? "Escuchando..." : "Presiona para dictar")}
                </Text>

                {/* ZONA DE TEXTO EN TIEMPO REAL */}
                <View style={styles.realTimeContainer}>
                    <Text style={styles.realTimeText}>
                        {textoParcial || (grabando ? "..." : "El texto aparecerá aquí mientras hablas")}
                    </Text>
                </View>
                
                <TouchableOpacity 
                    style={[styles.micButton, grabando && styles.micActive]} 
                    onPress={grabando ? detenerGrabacion : iniciarGrabacion}
                    disabled={procesando}
                >
                     {procesando ? (
                        <ActivityIndicator color="#fff" size="large"/>
                      ) : (
                        <Ionicons name={grabando ? "stop" : "mic"} size={60} color="white" />
                      )}
                </TouchableOpacity>

                <View style={styles.hintContainer}>
                    <Text style={styles.hintTitle}>Dictado Nativo</Text>
                    <Text style={styles.hint}>
                        Usa el motor de voz de tu celular. Funciona offline en la mayoría de dispositivos modernos.
                    </Text>
                </View>
            </View>

            <CustomAlert 
                visible={modalVisible}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                buttons={modalConfig.buttons}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    thumbHeader: { width: 60, height: 60, borderRadius: 5, marginRight: 8, borderWidth: 1, borderColor: '#555' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', color: '#333' },
    
    // Estilo para el texto en tiempo real
    realTimeContainer: {
        width: '100%',
        minHeight: 100,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    realTimeText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        fontStyle: 'italic'
    },

    micButton: { 
        width: 120, height: 120, borderRadius: 60, 
        backgroundColor: '#007AFF', 
        justifyContent: 'center', alignItems: 'center',
        elevation: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5
    },
    micActive: { backgroundColor: '#F44336', transform: [{scale: 1.1}] },
    
    hintContainer: { marginTop: 40, padding: 20 },
    hintTitle: { fontWeight: 'bold', color: '#555', marginBottom: 5, textAlign: 'center' },
    hint: { color: '#777', fontStyle: 'italic', textAlign: 'center' }
});

export default VoiceScreen;