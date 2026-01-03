import { useState, useEffect, useLayoutEffect } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { getTramosLocales, subirDatosPendientes } from '../services/syncService';

// Nota: Recibimos 'navigation' para poder configurar el botón del header
export const useTramoScreen = (navigation) => {
    const [tramos, setTramos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sincronizando, setSincronizando] = useState(false);
    
    // Configuración de Alertas
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '', buttons: [] });

    // --- ALERTAS HELPERS ---
    const showAlert = (type, title, message, buttons = []) => {
        setAlertConfig({ visible: true, type, title, message, buttons });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    // --- CARGA DE DATOS ---
    const cargarDatos = async () => {
        try {
            setLoading(true);
            const data = await getTramosLocales();
            setTramos(data);
        } catch (error) {
            console.error("Error cargando tramos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // --- SINCRONIZACIÓN ---
    const handleSync = async () => {
        setSincronizando(true);
        try {
            const resultado = await subirDatosPendientes();
            
            if (resultado.success) {
                showAlert('success', 'Sincronización Completa', resultado.message, [{ text: 'Excelente' }]);
            } else {
                showAlert('error', 'Error de Conexión', 'Verifica tu internet e intenta de nuevo.');
            }
        } catch (error) {
            showAlert('error', 'Error', 'Ocurrió un error inesperado al subir datos.');
        } finally {
            setSincronizando(false);
        }
    };

    // --- BOTÓN DEL HEADER ---
    // Usamos useLayoutEffect para que el botón aparezca antes de pintar la pantalla
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

    return {
        tramos,
        loading,
        alertConfig,
        hideAlert
    };
};