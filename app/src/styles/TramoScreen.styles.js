import { StyleSheet } from 'react-native';
import { Colors } from '../theme/Colors';

export const getStyles = (isDark) => {
    const theme = isDark ? Colors.dark : Colors.light;

    return StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: theme.background, // Gris claro o Negro
            padding: 15 
        },
        center: { 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: theme.background
        },
        card: { 
            backgroundColor: theme.card, // Blanco o Gris oscuro
            padding: 20, 
            borderRadius: 12, 
            marginBottom: 12, 
            
            // Sombras suaves
            shadowColor: theme.textPrimary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3 
        },
        title: { 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: theme.textPrimary, // Negro o Blanco
            marginBottom: 5
        },
        subtitle: {
            fontSize: 14,
            color: theme.textSecondary, // Gris medio
            fontStyle: 'italic'
        },
        // Estilo para el botón del Header (Texto)
        headerButtonText: {
            color: '#FFFFFF', // Blanco siempre porque el header suele tener color fuerte
            fontWeight: 'bold',
            fontSize: 16
        },
        headerButtonContainer: {
            marginRight: 15,
            flexDirection: 'row',
            alignItems: 'center'
        }
    });
};