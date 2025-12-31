import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getTramosLocales, subirDatosPendientes } from '../services/syncService';
import CustomAlert from "../components/CustomAlert";

const TramosScreen = ({ navigation }) => {
    const [tramos, setTramos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sincronizando, setSincronizando] = useState(false);
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
    // Configurar botón en el Header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity 
                    onPress={handleSync} 
                    disabled={sincronizando}
                    style={{ marginRight: 15 }}
                >
                    {sincronizando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>SUBIR ☁️</Text>
                    )}
                </TouchableOpacity>
            ),
        });
    }, [navigation, sincronizando]);

    const handleSync = async () => {
        setSincronizando(true);
        
        const resultado = await subirDatosPendientes();
        
        setSincronizando(false);
        
        if (resultado.success) {
            showCustomAlert(
                'success', 
                'Sincronización Completa', 
                resultado.message, // "Se subieron X observaciones..."
                [{ text: 'Excelente' }]
            );
        } else {
           showCustomAlert(
                'error', 
                'Error de Conexión', 
                'Hubo un problema al conectar con el servidor. Verifica tu internet e intenta de nuevo.'
            );
        }
    };

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const data = await getTramosLocales();
            setTramos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // ... (El resto del renderItem y FlatList sigue igual) ...
    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('DetalleTramo', { 
                tramoId: item.id, 
                tramoNombre: `${item.inicio} - ${item.destino}` 
            })}
        >
            <Text style={styles.title}>{item.inicio} - {item.destino}</Text>
             <Text style={styles.subtitle}>Toca para iniciar recorrido</Text>
        </TouchableOpacity>
    );

    if (loading) return <View style={styles.center}><ActivityIndicator/></View>;

    return (
        <View style={styles.container}>
            <FlatList
                data={tramos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
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

// ... Styles siguen igual ...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0', padding: 15 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 12, elevation: 2 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#333' }
});

export default TramosScreen;