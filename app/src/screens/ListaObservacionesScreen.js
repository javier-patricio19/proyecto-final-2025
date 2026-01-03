import React from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, useColorScheme } from 'react-native';

// Imports SoC
import { getStyles } from '../styles/ListaObservacionesScreen.styles';
import { useListaObservaciones } from '../hooks/useListaObservaciones';

const ListaObservacionesScreen = ({ route, navigation }) => {
    // 1. Tema Global
    const theme = useColorScheme();
    const isDark = theme === 'dark';
    const styles = getStyles(isDark);
    
    // Color del spinner
    const activityColor = isDark ? '#FFFFFF' : '#007AFF';

    // 2. Lógica (Hook)
    const { lista, loading, irACaptura } = useListaObservaciones(navigation, route.params);

    // Render de cada fila
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {/* Foto (Izquierda) */}
            <Image 
                source={item.fotoPortada ? { uri: item.fotoPortada } : null} 
                style={styles.thumb} 
            />

            {/* Datos (Centro) */}
            <View style={styles.info}>
                <Text style={styles.titulo}>
                    {item.nombreElemento || "Elemento Desconocido"}
                </Text>
                <Text style={styles.subtitulo}>Km: {item.kilometro}</Text>
                <Text style={styles.texto} numberOfLines={2}>
                    {item.observacion}
                </Text>
            </View>

            {/* Estado (Derecha) */}
            <View style={styles.status}>
                <View style={[styles.badge, item.sincronizado ? styles.bgGreen : styles.bgOrange]}>
                    <Text style={styles.badgeText}>
                        {item.sincronizado ? "Subido" : "Pendiente"}
                    </Text>
                </View>
            </View>
        </View>
    );

    // Estado de carga
    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={activityColor} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {lista.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>No hay observaciones en este tramo.</Text>
                </View>
            ) : (
                <FlatList
                    data={lista}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 80 }} // Espacio extra para el FAB
                />
            )}
            
            {/* Botón Flotante (FAB) */}
            <TouchableOpacity 
                style={styles.fab}
                onPress={irACaptura}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ListaObservacionesScreen;