import React from 'react';
// 1. IMPORTAR useWindowDimensions
import { View, Text, TouchableOpacity, Image, ScrollView, useColorScheme, useWindowDimensions } from 'react-native';
import { CameraView } from 'expo-camera';

import { getStyles } from '../styles/CapturaScreen.styles';
import { useCapturaScreen } from '../hooks/useCapturaScreen';
import CustomAlert from "../components/CustomAlert";

const CapturaScreen = ({ route, navigation }) => {
    // 2. DETECTAR DIMENSIONES Y ORIENTACIÓN
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const theme = useColorScheme();
    const isDark = theme === 'dark';
    
    // 3. PASAR isLandscape A LOS ESTILOS
    const styles = getStyles(isDark, isLandscape);

    const {
        cameraRef,
        scrollRef,
        permission,
        requestPermission,
        fotos,
        coords,
        tomandoFoto,
        alertConfig,
        tomarFoto,
        finalizarCaptura,
        hideAlert
    } = useCapturaScreen(navigation, route.params);

    if (!permission) return <View style={styles.container} />;
    
    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.textPermission}>Necesitamos acceso a la cámara para capturar evidencia.</Text>
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
            />

            {/* Capa GPS */}
            <View style={styles.topOverlay}>
                <View style={[styles.badge, coords ? styles.badgeGreen : styles.badgeGray]}>
                    <Text style={styles.badgeText}>
                        {coords ? "📍 GPS ACTIVO" : "🛰️ BUSCANDO..."}
                    </Text>
                </View>
            </View>

            {/* Capa Controles (Se adapta a vertical/horizontal gracias a los estilos) */}
            <View style={styles.controlsOverlay}>
                
                {/* Carrusel (Se oculta en Landscape para ahorrar espacio en este diseño simple) */}
                {!isLandscape && fotos.length > 0 && (
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

                <View style={styles.buttonsRow}>
                    <TouchableOpacity 
                        style={styles.smallBtn} 
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.smallBtnText}>✕</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.shutterBtn, tomandoFoto && styles.shutterActive]} 
                        onPress={tomarFoto}
                        disabled={tomandoFoto}
                    >
                        <View style={styles.shutterInner} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.smallBtn, 
                            fotos.length > 0 ? styles.btnFinish : styles.btnDisabled
                        ]} 
                        onPress={finalizarCaptura}
                        disabled={fotos.length === 0}
                    >
                        <Text style={styles.smallBtnText}>✓</Text>
                    </TouchableOpacity>
                </View>

                {/* Contador simple para modo Landscape */}
                {isLandscape && fotos.length > 0 && (
                     <Text style={[styles.countLabel, { marginTop: 10 }]}>{fotos.length} fotos</Text>
                )}
            </View>

            <CustomAlert 
                visible={alertConfig.visible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                onClose={hideAlert}
            />
        </View>
    );
};

export default CapturaScreen;