import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../theme/Colors';

export const getStyles = (isDark) => {
    const theme = isDark ? Colors.dark : Colors.light;
    const { width } = Dimensions.get('window');

    return StyleSheet.create({
        // El fondo oscuro detrás del modal
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)', 
            justifyContent: 'center',
            alignItems: 'center',
        },
        // La cajita de la alerta
        alertBox: {
            width: width * 0.85,
            backgroundColor: theme.modal, // Blanco o Gris Oscuro
            borderRadius: 20,
            padding: 25,
            alignItems: 'center',
            // Sombras
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 10,
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.textPrimary, // Negro o Blanco
            marginBottom: 10,
            textAlign: 'center',
        },
        message: {
            fontSize: 16,
            color: theme.textSecondary, // Gris medio o Gris claro
            textAlign: 'center',
            marginBottom: 25,
            lineHeight: 22,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            gap: 10, 
            flexWrap: 'wrap'
        },
        btn: {
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
            minWidth: 100,
            alignItems: 'center',
            marginHorizontal: 5,
            marginBottom: 5
        },
        btnText: {
            fontWeight: 'bold',
            fontSize: 16,
        }
    });
};