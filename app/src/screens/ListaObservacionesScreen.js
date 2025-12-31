import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Para recargar al volver
import db from '../database/db';

const ListaObservacionesScreen = ({ route, navigation }) => {
    const { tramoId } = route.params;
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);

    // useFocusEffect sirve para que la lista se refresque 
    // cada vez que entras a esta pantalla (por si acabas de agregar una nueva)
    useFocusEffect(
        useCallback(() => {
            cargarObservaciones();
        }, [])
    );

    const cargarObservaciones = async () => {
        try {
            setLoading(true);
            // Hacemos un JOIN para traer el nombre del elemento y una subconsulta para la primera foto
            const resultados = await db.getAllAsync(`
                SELECT 
                    o.id, 
                    o.kilometro, 
                    o.observacion, 
                    o.sincronizado,
                    e.nombre as nombreElemento,
                    (SELECT uri FROM imagenes WHERE observacionId = o.id LIMIT 1) as fotoPortada
                FROM observaciones o
                LEFT JOIN elementos e ON o.elementoId = e.id
                WHERE o.tramoId = ?
                ORDER BY o.id DESC
            `, [tramoId]);

            setLista(resultados);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {/* Foto (Izquierda) */}
            <Image 
                source={item.fotoPortada ? { uri: item.fotoPortada } : null} 
                style={styles.thumb} 
                backgroundColor="#ccc"
            />

            {/* Datos (Centro) */}
            <View style={styles.info}>
                <Text style={styles.titulo}>{item.nombreElemento || "Elemento Desconocido"}</Text>
                <Text style={styles.subtitulo}>Km: {item.kilometro}</Text>
                <Text style={styles.texto} numberOfLines={2}>{item.observacion}</Text>
            </View>

            {/* Estado (Derecha) */}
            <View style={styles.status}>
                {/* Si sincronizado es 0 (falso), mostramos un reloj o nube tachada */}
                <View style={[styles.badge, item.sincronizado ? styles.bgGreen : styles.bgOrange]}>
                    <Text style={styles.badgeText}>
                        {item.sincronizado ? "Subido" : "Pendiente"}
                    </Text>
                </View>
            </View>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" style={{marginTop: 50}} />;

    return (
        <View style={styles.container}>
            {lista.length === 0 ? (
                <View style={styles.center}>
                    <Text style={{fontSize: 16, color: '#666'}}>No hay observaciones en este tramo.</Text>
                </View>
            ) : (
                <FlatList
                    data={lista}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
            
            {/* Botón flotante opcional por si quieren agregar directo desde aquí */}
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => navigation.navigate('CapturaCamara', { tramoId })}
            >
                <Text style={{fontSize: 30, color: 'white'}}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f2f2', padding: 10 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    
    card: { 
        flexDirection: 'row', 
        backgroundColor: 'white', 
        borderRadius: 10, 
        padding: 10, 
        marginBottom: 10,
        elevation: 2 
    },
    thumb: { width: 70, height: 70, borderRadius: 8, marginRight: 10 },
    info: { flex: 1, justifyContent: 'center' },
    titulo: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    subtitulo: { fontSize: 14, color: '#007AFF', fontWeight: '600', marginBottom: 2 },
    texto: { fontSize: 12, color: '#666' },
    
    status: { justifyContent: 'center', alignItems: 'flex-end', minWidth: 60 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    bgGreen: { backgroundColor: '#4caf50' },
    bgOrange: { backgroundColor: '#ff9800' },
    badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

    fab: {
        position: 'absolute', bottom: 20, right: 20,
        backgroundColor: '#007AFF', width: 60, height: 60,
        borderRadius: 30, justifyContent: 'center', alignItems: 'center',
        elevation: 5
    }
});

export default ListaObservacionesScreen;