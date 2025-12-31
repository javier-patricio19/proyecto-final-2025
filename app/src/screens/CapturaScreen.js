import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import CustomAlert from "../components/CustomAlert";

const CapturaCamaraScreen = ({ route, navigation }) => {
    const { tramoId } = route.params;
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const scrollRef = useRef(null); // Para mover el scroll al final automáticamente
    
    const [fotos, setFotos] = useState([]);
    const [coords, setCoords] = useState(null);
    const [tomandoFoto, setTomandoFoto] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: 'info',
        title: '',
        message: '',
        buttons: []
    });

    
    const showCustomAlert = (type, title, message, buttons = []) => {
        setModalConfig({ type, title, message, buttons });
        setModalVisible(true);
    };

    useEffect(() => {
        obtenerGPS();
    }, []);

    // Efecto para hacer scroll al final cuando se agrega una foto nueva
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: true });
        }
    }, [fotos]);

    const obtenerGPS = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            showCustomAlert('error', 'Permiso Requerido', 'Se requiere permiso de ubicación para geolocalizar la evidencia.', [
                { text: 'Entendido', onPress: () => navigation.goBack(), style: 'destructive' }
            ]);
            return;
        }
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setCoords(location.coords);
    };

    const tomarFoto = async () => {
        if (!cameraRef.current || tomandoFoto) return;
        setTomandoFoto(true);

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.5,
                skipProcessing: true 
            });

            // Agregamos foto al array
            setFotos(prevFotos => [...prevFotos, photo.uri]);

        } catch (error) {
            console.error(error);
            showCustomAlert('error', 'Error de Cámara', 'No se pudo capturar la foto. Intenta nuevamente.');
        } finally {
            setTomandoFoto(false);
        }
    };

    const finalizarCaptura = () => {
        if (fotos.length === 0) {
            showCustomAlert('warning', 'Falta Evidencia', 'Debes tomar al menos una foto para continuar.');
            return;
        }
        navigation.replace('VoiceRecord', { 
            tramoId, 
            fotos: fotos, 
            coords: coords 
        });
    };

    if (!permission) return <View style={styles.container} />;

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.textPermission}>Necesitamos acceso a la cámara</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.btnPermiso}>
                    <Text style={styles.txtBtn}>Dar Permiso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView 
                style={styles.camera} 
                facing="back"
                ref={cameraRef}
            >
                <View style={styles.overlay}>
                    
                    {/* BARRA SUPERIOR: GPS */}
                    <View style={styles.topBar}>
                        <View style={[styles.badge, coords ? styles.badgeGreen : styles.badgeGray]}>
                            <Text style={styles.badgeText}>
                                {coords ? "GPS ACTIVO" : "BUSCANDO GPS..."}
                            </Text>
                        </View>
                    </View>

                    {/* ZONA INFERIOR */}
                    <View style={styles.bottomArea}>
                        
                        {/* 1. CARRUSEL DE FOTOS TOMADAS */}
                        {fotos.length > 0 && (
                            <View style={styles.previewContainer}>
                                <ScrollView 
                                    horizontal 
                                    ref={scrollRef}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{paddingHorizontal: 10}}
                                >
                                    {fotos.map((uri, index) => (
                                        <Image key={index} source={{ uri }} style={styles.miniThumb} />
                                    ))}
                                </ScrollView>
                                <Text style={styles.countLabel}>{fotos.length} fotos</Text>
                            </View>
                        )}

                        {/* 2. CONTROLES (BOTONES) */}
                        <View style={styles.controlsRow}>
                            {/* Cancelar */}
                            <TouchableOpacity 
                                style={styles.smallBtn} 
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.smallBtnText}>✕</Text>
                            </TouchableOpacity>

                            {/* Disparador */}
                            <TouchableOpacity 
                                style={styles.shutterBtn} 
                                onPress={tomarFoto}
                                disabled={tomandoFoto}
                            >
                                <View style={styles.shutterInner} />
                            </TouchableOpacity>

                            {/* Finalizar (Check) */}
                            <TouchableOpacity 
                                style={[styles.smallBtn, {backgroundColor: fotos.length > 0 ? '#43a047' : '#555'}]} 
                                onPress={finalizarCaptura}
                                disabled={fotos.length === 0}
                            >
                                <Text style={styles.smallBtnText}>✓</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </CameraView>
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
    container: { flex: 1, backgroundColor: 'black' },
    camera: { flex: 1 },
    overlay: { flex: 1, justifyContent: 'space-between' },
    
    topBar: { 
        paddingTop: 50, 
        alignItems: 'center' 
    },
    badge: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
    badgeGreen: { backgroundColor: 'rgba(76, 175, 80, 0.8)' },
    badgeGray: { backgroundColor: 'rgba(0,0,0,0.5)' },
    badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    textPermission: { color: 'white', textAlign:'center', marginTop: 100, marginBottom: 20 },

    bottomArea: {
        paddingBottom: 30,
        backgroundColor: 'rgba(0,0,0,0.3)' // Fondo semitransparente abajo
    },
    
    // Estilos del carrusel de fotos
    previewContainer: {
        marginBottom: 15,
        height: 80,
    },
    miniThumb: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 2,
        borderColor: 'white'
    },
    countLabel: {
        color: 'white',
        textAlign: 'center',
        fontSize: 12,
        marginTop: 2,
        textShadowColor: 'black',
        textShadowRadius: 2
    },

    // Estilos de botones
    controlsRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center',
        paddingHorizontal: 20
    },
    shutterBtn: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 4, borderColor: '#ccc'
    },
    shutterInner: {
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: 'white', borderWidth: 2, borderColor: '#000'
    },
    smallBtn: {
        width: 50, height: 50, borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center', alignItems: 'center'
    },
    smallBtnText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    
    btnPermiso: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignSelf:'center' },
    txtBtn: { color: 'white' }
});

export default CapturaCamaraScreen;