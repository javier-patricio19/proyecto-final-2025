import { StyleSheet } from 'react-native';
import { Colors } from '../theme/Colors'; 

export const getStyles = (isDark) => {
    const theme = isDark ? Colors.dark : Colors.light;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background
        },
        // Tira de imágenes superior
        photosHeader: {
            backgroundColor: '#000', // Siempre oscuro para resaltar fotos
            paddingVertical: 10
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

        // Contenido del formulario
        scrollContent: {
            padding: 20
        },
        headerRow: { 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 20 
        },
        headerTitle: { 
            fontSize: 18, 
            fontWeight: 'bold',
            color: theme.textPrimary 
        },
        backLink: {
            color: theme.primary,
            fontWeight: '600'
        },

        // Labels e Inputs
        label: { 
            fontSize: 13, 
            fontWeight: 'bold', 
            color: theme.textSecondary, 
            marginTop: 15, 
            marginBottom: 8 
        },
        inputContainer: { 
            backgroundColor: theme.inputBackground, // Fondo gris claro o gris oscuro
            borderWidth: 1, 
            borderColor: theme.border, 
            borderRadius: 8, 
            justifyContent: 'center' 
        },
        input: { 
            padding: 12, 
            fontSize: 16,
            color: theme.textPrimary // Texto negro o blanco
        },
        
        // Estilos específicos para Picker (Android/iOS)
        picker: {
            color: theme.textPrimary,
        },
        
        // Estructura
        row: { 
            flexDirection: 'row' 
        },
        colLeft: {
            flex: 1, 
            marginRight: 8
        },
        colRight: {
            flex: 1, 
            marginLeft: 8
        },

        // Botón
        btnGuardar: { 
            backgroundColor: theme.primary, 
            paddingVertical: 16, 
            borderRadius: 10, 
            alignItems: 'center', 
            marginTop: 40,
            marginBottom: 50,
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 6
        },
        txtBtn: { 
            color: '#FFFFFF', 
            fontWeight: 'bold', 
            fontSize: 16 
        }
    });
};