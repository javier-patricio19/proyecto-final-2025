import { StyleSheet } from 'react-native';
import { Colors } from '../theme/Colors';

export const getStyles = (isDark) => {
    const theme = isDark ? Colors.dark : Colors.light;

    return StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: theme.background, 
            padding: 10 
        },
        center: { 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center' 
        },
        emptyText: {
            fontSize: 16, 
            color: theme.textSecondary
        },
        
        // --- TARJETA ---
        card: { 
            flexDirection: 'row', 
            backgroundColor: theme.card, // Blanco o Gris Oscuro
            borderRadius: 10, 
            padding: 10, 
            marginBottom: 10,
            
            // Sombra
            shadowColor: theme.textPrimary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2 
        },
        
        // Imagen
        thumb: { 
            width: 70, 
            height: 70, 
            borderRadius: 8, 
            marginRight: 10,
            backgroundColor: isDark ? '#333' : '#ccc'
        },
        
        // Textos
        info: { 
            flex: 1, 
            justifyContent: 'center' 
        },
        titulo: { 
            fontWeight: 'bold', 
            fontSize: 16, 
            color: theme.textPrimary // Negro o Blanco
        },
        subtitulo: { 
            fontSize: 14, 
            color: theme.primary, // Azul corporativo
            fontWeight: '600', 
            marginBottom: 2 
        },
        texto: { 
            fontSize: 12, 
            color: theme.textSecondary // Gris suave
        },
        
        // Estado (Badge)
        status: { 
            justifyContent: 'center', 
            alignItems: 'flex-end', 
            minWidth: 60 
        },
        badge: { 
            paddingHorizontal: 8, 
            paddingVertical: 4, 
            borderRadius: 12 
        },
        bgGreen: { backgroundColor: theme.success },
        bgOrange: { backgroundColor: theme.warning },
        badgeText: { 
            color: 'white', 
            fontSize: 10, 
            fontWeight: 'bold' 
        },

        // Botón Flotante (FAB)
        fab: {
            position: 'absolute', 
            bottom: 20, 
            right: 20,
            backgroundColor: theme.primary, 
            width: 60, 
            height: 60,
            borderRadius: 30, 
            justifyContent: 'center', 
            alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
        },
        fabText: {
            fontSize: 30, 
            color: 'white',
            marginTop: -2 // Pequeño ajuste visual para centrar el +
        }
    });
};