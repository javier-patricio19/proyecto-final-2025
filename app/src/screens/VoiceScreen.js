import React from 'react';
// 1. IMPORTAR ScrollView y useWindowDimensions
import { View, Text, TouchableOpacity, ActivityIndicator, Image, ScrollView, useColorScheme, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getStyles } from '../styles/VoiceScreen.styles';
import { useVoiceScreen } from '../hooks/useVoiceScreen';
import CustomAlert from "../components/CustomAlert";

const VoiceScreen = ({ route, navigation }) => {
    // 2. DETECTAR DIMENSIONES
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const theme = useColorScheme();
    const isDark = theme === 'dark';
    
    // 3. PASAR isLandscape A LOS ESTILOS
    const styles = getStyles(isDark, isLandscape);

    const { 
        grabando, 
        textoParcial, 
        procesando, 
        alertConfig, 
        hideAlert, 
        toggleGrabacion, 
        fotos 
    } = useVoiceScreen(navigation, route.params);

    return (
        <View style={styles.container}>
            {/* Cabecera de Fotos (Fija arriba) */}
            <View style={styles.headerContainer}>
                <ScrollView horizontal contentContainerStyle={styles.thumbScrollView}>
                    {fotos && fotos.map((uri, i) => (
                        <Image key={i} source={{uri}} style={styles.thumbHeader} />
                    ))}
                </ScrollView>
            </View>

            {/* Contenido Principal (Ahora con Scroll) */}
            {/* Usamos ScrollView para que si giras la pantalla, puedas bajar a ver el botón */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>
                    {procesando ? "Analizando..." : (grabando ? "Escuchando..." : "Presiona para dictar")}
                </Text>

                <View style={styles.realTimeContainer}>
                    <Text style={styles.realTimeText}>
                        {textoParcial || (grabando ? "..." : "El texto aparecerá aquí...")}
                    </Text>
                </View>
                
                <TouchableOpacity 
                    style={[styles.micButton, grabando && styles.micActive]} 
                    onPress={toggleGrabacion}
                    disabled={procesando}
                >
                     {procesando ? (
                        <ActivityIndicator color="#fff" size="large"/>
                      ) : (
                        <Ionicons name={grabando ? "stop" : "mic"} size={isLandscape ? 30 : 50} color="white" />
                      )}
                </TouchableOpacity>

                <View style={styles.hintContainer}>
                    <Text style={styles.hintTitle}>Ejemplo:</Text>
                    <Text style={styles.hint}>
                        Elemento: "cuneta",kilometro: "45" carril: "1", cuerpo: "A", Observacion:"LLena de basura que corta el flujo", Recomendacion: "ir a quitar la basura antes de que se desborde" 
                    </Text>
                </View>
            </ScrollView>

            <CustomAlert 
                visible={alertConfig.visible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={hideAlert}
            />
        </View>
    );
};

export default VoiceScreen;