import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DetalleTramoScreen = ({ route, navigation }) => {
    // Recibimos los datos del tramo que pasamos desde la pantalla anterior
    const { tramoId, tramoNombre } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.label}>Estás recorriendo:</Text>
                <Text style={styles.tramoTitle}>{tramoNombre}</Text>
            </View>

            <View style={styles.actionsContainer}>
                {/* Botón 1: Crear Nueva Observación */}
                <TouchableOpacity 
                    style={[styles.button, styles.createButton]}
                    onPress={() => navigation.navigate('CapturaCamara', { tramoId })}
                >
                    <Text style={styles.buttonText}>+ Nueva Observación</Text>
                    <Text style={styles.buttonSubtext}>Reportar hallazgo</Text>
                </TouchableOpacity>

                {/* Botón 2: Ver Lista */}
                <TouchableOpacity 
                    style={[styles.button, styles.listButton]}
                    onPress={() => navigation.navigate('ListaObservaciones', { tramoId })}
                >
                    <Text style={styles.buttonText}>Ver Observaciones</Text>
                    <Text style={styles.buttonSubtext}>Revisar lo capturado hoy</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
    headerContainer: { marginBottom: 40, marginTop: 20 },
    label: { fontSize: 16, color: '#666' },
    tramoTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    
    actionsContainer: { flex: 1, justifyContent: 'center', gap: 20 },
    
    button: {
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 4, // Sombra en Android
        shadowColor: '#000', // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    createButton: { backgroundColor: '#007AFF' }, // Azul para acción principal
    listButton: { backgroundColor: '#34C759' },   // Verde para ver lista (o gris oscuro si prefieres)
    
    buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
    buttonSubtext: { color: 'rgba(255,255,255,0.8)', fontSize: 14 }
});

export default DetalleTramoScreen;