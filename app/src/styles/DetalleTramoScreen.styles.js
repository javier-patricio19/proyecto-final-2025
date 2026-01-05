import { StyleSheet } from 'react-native';
import { Colors } from '../theme/Colors';

// AHORA RECIBIMOS isLandscape
export const getStyles = (isDark, isLandscape) => {
    const theme = isDark ? Colors.dark : Colors.light;

    return StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: theme.background
        },
        // Estilo para el ScrollView
        scrollContent: {
            padding: 20,
            flexGrow: 1, // Permite que el contenido se estire si sobra espacio
            justifyContent: 'center' // Centra verticalmente si sobra espacio
        },
        
        headerContainer: { 
            // En horizontal reducimos margen para ganar espacio
            marginBottom: isLandscape ? 10 : 40, 
            marginTop: isLandscape ? 10 : 20 
        },
        label: { 
            fontSize: 16, 
            color: theme.textSecondary 
        },
        tramoTitle: { 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: theme.textPrimary,
            marginTop: 5
        },
        
        actionsContainer: { 
            // Ya no usamos flex:1 aquí porque estamos dentro de un ScrollView
            gap: isLandscape ? 10 : 20, // Menos espacio entre botones en horizontal
            paddingBottom: 20
        },
        
        button: {
            // EN HORIZONTAL: Botones más delgados (padding 15 vs 30)
            padding: isLandscape ? 15 : 30,
            borderRadius: 15,
            alignItems: 'center',
            elevation: 4, 
            shadowColor: theme.textPrimary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
        },
        createButton: { backgroundColor: theme.primary }, 
        listButton: { backgroundColor: theme.success }, 
        
        buttonText: { 
            color: '#FFFFFF', 
            fontSize: 20, 
            fontWeight: 'bold', 
            marginBottom: 5 
        },
        buttonSubtext: { 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: 14 
        }
    });
};