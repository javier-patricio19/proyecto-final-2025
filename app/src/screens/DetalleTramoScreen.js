import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';

// Imports SoC
import { getStyles } from '../styles/DetalleTramoScreen.styles';
import { useDetalleTramo } from '../hooks/useDetalleTramo';

const DetalleTramoScreen = ({ route, navigation }) => {
    // 1. Tema Global
    const theme = useColorScheme();
    const isDark = theme === 'dark';
    const styles = getStyles(isDark);

    // 2. Lógica (Hook)
    const { 
        tramoNombre, 
        irACaptura, 
        irALista 
    } = useDetalleTramo(navigation, route.params);

    return (
        <View style={styles.container}>
            
            {/* Encabezado */}
            <View style={styles.headerContainer}>
                <Text style={styles.label}>Estás recorriendo:</Text>
                <Text style={styles.tramoTitle}>{tramoNombre}</Text>
            </View>

            {/* Botones de Acción */}
            <View style={styles.actionsContainer}>
                
                {/* Botón 1: Crear Nueva Observación */}
                <TouchableOpacity 
                    style={[styles.button, styles.createButton]}
                    onPress={irACaptura}
                >
                    <Text style={styles.buttonText}>+ Nueva Observación</Text>
                    <Text style={styles.buttonSubtext}>Reportar hallazgo</Text>
                </TouchableOpacity>

                {/* Botón 2: Ver Lista */}
                <TouchableOpacity 
                    style={[styles.button, styles.listButton]}
                    onPress={irALista}
                >
                    <Text style={styles.buttonText}>Ver Observaciones</Text>
                    <Text style={styles.buttonSubtext}>Revisar lo capturado hoy</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default DetalleTramoScreen;