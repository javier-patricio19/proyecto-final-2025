import { StyleSheet } from 'react-native';
import { Colors } from '../theme/Colors';

export const getStyles = (isDark) => {
    const theme = isDark ? Colors.dark : Colors.light;

    return StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: theme.background, 
            padding: 20 
        },
        headerContainer: { 
            marginBottom: 40, 
            marginTop: 20 
        },
        label: { 
            fontSize: 16, 
            color: theme.textSecondary // Gris suave adaptable
        },
        tramoTitle: { 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: theme.textPrimary, // Negro o Blanco
            marginTop: 5
        },
        
        actionsContainer: { 
            flex: 1, 
            justifyContent: 'center', 
            gap: 20 // Espacio entre botones
        },
        
        button: {
            padding: 30,
            borderRadius: 15,
            alignItems: 'center',
            // Sombra adaptativa
            elevation: 4, 
            shadowColor: theme.textPrimary, // La sombra cambia de color según el tema
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
        },
        createButton: { 
            backgroundColor: theme.primary // Azul corporativo
        }, 
        listButton: { 
            backgroundColor: theme.success // Verde éxito
        }, 
        
        buttonText: { 
            color: '#FFFFFF', // Siempre blanco sobre botones de color fuerte
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