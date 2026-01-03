import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { getStyles } from '../styles/TramoScreen.styles';
import { useTramoScreen } from '../hooks/useTramo';
import CustomAlert from "../components/CustomAlert";

const TramosScreen = ({ navigation }) => {
    // 1. Tema
    const theme = useColorScheme();
    const isDark = theme === 'dark';
    const styles = getStyles(isDark);
    const activityColor = isDark ? '#FFFFFF' : '#007AFF';

    // 2. Lógica
    const { 
        tramos, 
        loading, 
        alertConfig, 
        hideAlert 
    } = useTramoScreen(navigation);

    // Render de cada tarjeta
    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('DetalleTramo', { 
                tramoId: item.id, 
                tramoNombre: `${item.inicio} - ${item.destino}` 
            })}
        >
            <Text style={styles.title}>{item.inicio} - {item.destino}</Text>
            <Text style={styles.subtitle}>Toca para iniciar recorrido ➝</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={activityColor} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={tramos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

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

export default TramosScreen;