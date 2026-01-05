import React from 'react';
// 1. IMPORTAMOS ScrollView y useWindowDimensions
import { View, Text, TouchableOpacity, ScrollView, useColorScheme, useWindowDimensions } from 'react-native';

import { getStyles } from '../styles/DetalleTramoScreen.styles';
import { useDetalleTramo } from '../hooks/useDetalleTramo';

const DetalleTramoScreen = ({ route, navigation }) => {
    // 2. DETECTAMOS ORIENTACIÓN
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const theme = useColorScheme();
    const isDark = theme === 'dark';
    
    // 3. PASAMOS isLandscape
    const styles = getStyles(isDark, isLandscape);

    const { 
        tramoNombre, 
        irACaptura, 
        irALista 
    } = useDetalleTramo(navigation, route.params);

    return (
        // 4. USAMOS ScrollView EN LUGAR DE View
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Encabezado */}
                <View style={styles.headerContainer}>
                    <Text style={styles.label}>Estás recorriendo:</Text>
                    <Text style={styles.tramoTitle}>{tramoNombre}</Text>
                </View>

                {/* Botones de Acción */}
                <View style={styles.actionsContainer}>
                    
                    {/* Botón 1 */}
                    <TouchableOpacity 
                        style={[styles.button, styles.createButton]}
                        onPress={irACaptura}
                    >
                        <Text style={styles.buttonText}>+ Nueva Observación</Text>
                        <Text style={styles.buttonSubtext}>Reportar hallazgo</Text>
                    </TouchableOpacity>

                    {/* Botón 2 */}
                    <TouchableOpacity 
                        style={[styles.button, styles.listButton]}
                        onPress={irALista}
                    >
                        <Text style={styles.buttonText}>Ver Observaciones</Text>
                        <Text style={styles.buttonSubtext}>Revisar lo capturado hoy</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
};

export default DetalleTramoScreen;