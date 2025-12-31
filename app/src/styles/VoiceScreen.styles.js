import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F5F5F5' // Fondo gris claro fijo
    },
    headerContainer: {
        backgroundColor: '#000', 
        paddingVertical: 10, 
        width: '100%'
    },
    thumbScrollView: {
        paddingHorizontal: 10
    },
    thumbHeader: { 
        width: 60, 
        height: 60, 
        borderRadius: 5, 
        marginRight: 8, 
        borderWidth: 1, 
        borderColor: '#555' 
    },
    content: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20 
    },
    title: { 
        fontSize: 24, 
        marginBottom: 20, 
        fontWeight: 'bold', 
        color: '#333333' // <--- IMPORTANTE: Color gris oscuro forzado
    },
    
    // Caja del texto en tiempo real
    realTimeContainer: {
        width: '100%',
        minHeight: 120,
        backgroundColor: '#FFFFFF', // Fondo blanco fijo
        borderRadius: 15,
        padding: 20,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        // Sombra suave
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    realTimeText: {
        fontSize: 18,
        color: '#222222', // <--- IMPORTANTE: Texto casi negro forzado
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 26
    },

    micButton: { 
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        backgroundColor: '#007AFF', 
        justifyContent: 'center', 
        alignItems: 'center',
        elevation: 10, 
        shadowColor: '#007AFF', 
        shadowOpacity: 0.4, 
        shadowRadius: 10
    },
    micActive: { 
        backgroundColor: '#FF3B30', // Rojo iOS
        transform: [{scale: 1.1}],
        shadowColor: '#FF3B30',
    },
    
    hintContainer: { 
        marginTop: 40, 
        padding: 20,
        opacity: 0.8
    },
    hintTitle: { 
        fontWeight: 'bold', 
        color: '#555555', // Gris medio
        marginBottom: 5, 
        textAlign: 'center' 
    },
    hint: { 
        color: '#777777', // Gris suave
        fontStyle: 'italic', 
        textAlign: 'center' 
    }
});