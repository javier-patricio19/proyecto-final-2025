import { StyleSheet } from 'react-native';
import { Colors } from '../theme/Colors';

export const getStyles = (isDark, isLandscape) => {
    const theme = isDark ? Colors.dark : Colors.light;

    return StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: theme.background 
        },
        headerContainer: {
            backgroundColor: theme.headerBackground, 
            paddingVertical: 10, 
            width: '100%',
            // En landscape reducimos altura del header de fotos
            height: isLandscape ? 80 : 'auto', 
            justifyContent: 'center'
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
            borderColor: theme.border 
        },
        
        // CORRECCIÓN PRINCIPAL AQUÍ:
        // Usamos un ScrollView, así que 'content' ya no necesita flex: 1 para centrar
        scrollContent: {
            flexGrow: 1,
            justifyContent: isLandscape ? 'flex-start' : 'center', // En horizontal no centramos para evitar overlap
            alignItems: 'center', 
            padding: 20,
            paddingBottom: 40
        },
        
        title: { 
            fontSize: isLandscape ? 18 : 24, // Título más pequeño en horizontal
            marginBottom: 20, 
            fontWeight: 'bold', 
            color: theme.textPrimary,
            marginTop: isLandscape ? 10 : 0
        },
        
        realTimeContainer: {
            width: '100%',
            minHeight: isLandscape ? 80 : 120, // Caja más compacta en horizontal
            backgroundColor: theme.card, 
            borderRadius: 15,
            padding: 20,
            marginBottom: isLandscape ? 20 : 40,
            borderWidth: 1,
            borderColor: theme.border, 
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.textPrimary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        realTimeText: {
            fontSize: 18,
            color: theme.textPrimary, 
            textAlign: 'center',
            fontStyle: 'italic',
            lineHeight: 26
        },
    
        micButton: { 
            width: isLandscape ? 70 : 100, // Botón más pequeño en horizontal
            height: isLandscape ? 70 : 100, 
            borderRadius: isLandscape ? 35 : 50, 
            backgroundColor: theme.primary, 
            justifyContent: 'center', 
            alignItems: 'center',
            elevation: 10,
            shadowColor: theme.primary,
            shadowOpacity: 0.4,
            shadowRadius: 10
        },
        micActive: { 
            backgroundColor: theme.error, 
            transform: [{scale: 1.1}],
            shadowColor: theme.error,
        },
        
        hintContainer: { 
            marginTop: isLandscape ? 20 : 40, 
            padding: 20,
            opacity: 0.8
        },
        hintTitle: { 
            fontWeight: 'bold', 
            color: theme.textSecondary, 
            marginBottom: 5, 
            textAlign: 'center' 
        },
        hint: { 
            color: theme.textHint, 
            fontStyle: 'italic', 
            textAlign: 'center' 
        }
    });
};