import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getTramosLocales } from '../services/syncService';

const TramosScreen = ({ navigation }) => {
    const [tramos, setTramos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarTramos();
    }, []);

    const cargarTramos = async () => {
        const data = await getTramosLocales();
        setTramos(data);
        setLoading(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('DetalleRecorrido', { tramoId: item.id })}
        >
            <Text style={styles.title}>{item.inicio} - {item.destino}</Text>
            <Text style={styles.subtitle}>Toca para iniciar recorrido</Text>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Seleccione un Tramo</Text>
            <FlatList
                data={tramos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 15, elevation: 3 },
    title: { fontSize: 18, fontWeight: '600' },
    subtitle: { color: '#666', marginTop: 5 }
});

export default TramosScreen;