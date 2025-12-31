import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, ScrollView, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { procesarTextoDictado } from '../utils/VoiceLogic';
import CustomAlert from '../components/CustomAlert';

const API_URL = "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3";
// Nota: Asegúrate de que este token sea válido
const HF_TOKEN = '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'; 

const recordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.MAX,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

const VoiceScreen = ({ route, navigation }) => {
    const { tramoId, fotos, coords } = route.params;
    
    const [grabando, setGrabando] = useState(false);
    const [recordingObj, setRecordingObj] = useState(null);
    const [procesando, setProcesando] = useState(false);
    
    // Alertas
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({ type: 'info', title: '', message: '', buttons: [] });

    const showCustomAlert = (type, title, message, buttons = []) => {
        setModalConfig({ type, title, message, buttons });
        setModalVisible(true);
    };

    const iniciarGrabacion = async () => {
        try {
            const permiso = await Audio.requestPermissionsAsync();
            if (permiso.status !== 'granted') {
                showCustomAlert('error', 'Permiso denegado', 'Necesitamos acceso al micrófono.');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            
            const { recording } = await Audio.Recording.createAsync(recordingOptions); 
            
            setRecordingObj(recording);
            setGrabando(true);
        } catch (err) {
            console.error("Error al iniciar grabación:", err);
            showCustomAlert('error', 'Error', 'No se pudo iniciar la grabación');
        }
    };

const detenerYProcesar = async () => {
        if (!recordingObj) return;

        setGrabando(false);
        setProcesando(true);

        try {
            console.log("🔍 DEBUG: Deteniendo grabación...");
            await recordingObj.stopAndUnloadAsync();
            const uri = recordingObj.getURI();

            // Corrección de URI para Android
            let uriParaSubir = uri;
            if (Platform.OS === 'android' && !uri.startsWith('file://')) {
                uriParaSubir = `file://${uri}`;
            }

            // 1. LEER EL ARCHIVO LOCAL COMO BLOB
            console.log("🔍 DEBUG: Convirtiendo archivo a Blob...");
            const fileResponse = await fetch(uriParaSubir);
            const audioBlob = await fileResponse.blob();
            console.log("🔍 DEBUG: Blob creado. Tamaño:", audioBlob.size);

            
            console.log("🔍 DEBUG: Enviando a URL:", API_URL);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    // CAMBIO CLAVE: Decirle al servidor que es un contenedor MP4 genérico
                    "Content-Type": "audio/mp4", 
                },
                body: audioBlob,
            });

            console.log("🔍 DEBUG: Respuesta Status:", response.status);

            // 4. LEER RESPUESTA
            const responseText = await response.text();
            // console.log("🔍 DEBUG: Cuerpo de la respuesta (Raw):", responseText);

            // 5. PARSEAR
            let data;
            try {
                data = JSON.parse(responseText);
                console.log("🔍 DEBUG: JSON Parseado correctamente:", data);
            } catch (e) {
                console.error("🔍 DEBUG: Falló el JSON.parse.");
                throw new Error(`El servidor devolvió: "${responseText.substring(0, 50)}..." (Status: ${response.status})`);
            }

            if (data.error) {
                throw new Error(JSON.stringify(data.error));
            }

            const textoTranscrito = data.text;
            
            if (!textoTranscrito) throw new Error("La API no devolvió campo 'text'.");

            // ÉXITO
            console.log("✅ ÉXITO: Transcripción recibida:", textoTranscrito);
            
            // Procesar lógica de negocio
            const formBase = { elementoId: '', kilometro: '', cuerpo: '', carril: '', observacion: '', recomendacion: '' };
            const datosDetectados = await procesarTextoDictado(textoTranscrito, formBase);

            navigation.navigate('FormularioObservacion', { tramoId, fotos, coords, datosDetectados });

        } catch (error) {
            console.error("❌ ERROR FINAL:", error);
            showCustomAlert('error', 'Error al procesar', error.message);
        } finally {
            setProcesando(false);
            setRecordingObj(null);
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
                    {procesando ? "Analizando audio..." : (grabando ? "🔴 Escuchando..." : "Presiona para grabar")}
                </Text>
                
                <TouchableOpacity 
                    style={[styles.micButton, grabando && styles.micActive]} 
                    onPress={grabando ? detenerYProcesar : iniciarGrabacion}
                    disabled={procesando}
                >
                     {procesando ? (
                        <ActivityIndicator color="#fff" size="large"/>
                      ) : (
                        <Ionicons name={grabando ? "stop" : "mic"} size={60} color="white" />
                      )}
                </TouchableOpacity>

                <View style={styles.hintContainer}>
                    <Text style={styles.hintTitle}>Sugerencia de dictado:</Text>
                    <Text style={styles.hint}>
                        "Elemento Señalización, Kilómetro 45, Cuerpo B, Carril 1. Se observa pintura desgastada..."
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
    title: { fontSize: 24, marginBottom: 40, fontWeight: 'bold', color: '#333' },
    
    micButton: { 
        width: 120, height: 120, borderRadius: 60, 
        backgroundColor: '#007AFF', 
        justifyContent: 'center', alignItems: 'center',
        elevation: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5
    },
    micActive: { backgroundColor: '#F44336', transform: [{scale: 1.1}] },
    
    hintContainer: { marginTop: 60, padding: 20, backgroundColor: '#e3f2fd', borderRadius: 10 },
    hintTitle: { fontWeight: 'bold', color: '#1565c0', marginBottom: 5 },
    hint: { color: '#555', fontStyle: 'italic', textAlign: 'center' }
});

export default VoiceScreen;