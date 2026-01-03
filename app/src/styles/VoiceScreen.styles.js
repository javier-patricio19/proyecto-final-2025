import { StyleSheet } from 'react-native';
import { Colors } from '../theme/Colors'; 

export const getStyles = (isDark) => {
    const theme = isDark ? Colors.dark : Colors.light;

    return StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: theme.background // Usando el global
        },
        headerContainer: {
            backgroundColor: isDark ? '#000' : theme.headerBackground, 
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
            borderColor: theme.border 
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
            color: theme.textPrimary 
        },
        
        realTimeContainer: {
            width: '100%',
            minHeight: 120,
            backgroundColor: theme.card,
            borderRadius: 15,
            padding: 20,
            marginBottom: 40,
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
            width: 100, 
            height: 100, 
            borderRadius: 50, 
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
            marginTop: 40, 
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