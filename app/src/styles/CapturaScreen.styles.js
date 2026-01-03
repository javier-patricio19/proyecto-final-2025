import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Colors } from '../theme/Colors';

// AHORA RECIBIMOS isLandscape
export const getStyles = (isDark, isLandscape) => {
    
    return StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: 'black' 
        },
        camera: { 
            flex: 1,
            width: '100%',
            height: '100%'
        },
        
        // --- CAPA SUPERIOR (GPS) ---
        topOverlay: {
            position: 'absolute',
            // Si es landscape, el GPS lo ponemos arriba a la izquierda con margen
            top: isLandscape ? 20 : (Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60),
            left: isLandscape ? 20 : 0,
            right: isLandscape ? null : 0, // En landscape no ocupamos todo el ancho
            alignItems: isLandscape ? 'flex-start' : 'center',
            zIndex: 10,
        },
        badge: { 
            paddingHorizontal: 15, 
            paddingVertical: 8, 
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center'
        },
        badgeGreen: { backgroundColor: 'rgba(76, 175, 80, 0.9)' },
        badgeGray: { backgroundColor: 'rgba(0,0,0,0.6)' },
        badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

        // --- CAPA DE CONTROLES (La magia responsiva) ---
        controlsOverlay: {
            position: 'absolute',
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.2)', // Fondo semitransparente
            
            // LÓGICA CONDICIONAL:
            // Vertical: Abajo, ancho completo, items en fila.
            // Horizontal: A la derecha, alto completo, items en columna.
            ...(isLandscape ? {
                right: 0,
                top: 0,
                bottom: 0,
                width: 100, // Barra lateral
                flexDirection: 'column',
                justifyContent: 'center',
                paddingVertical: 20,
                paddingHorizontal: 0
            } : {
                bottom: 0,
                left: 0,
                right: 0,
                height: 180, // Zona inferior
                flexDirection: 'column',
                justifyContent: 'flex-end',
                paddingBottom: 40
            })
        },

        // --- CARRUSEL DE PREVIEW ---
        previewContainer: {
            // En landscape lo ocultamos o lo hacemos pequeño, 
            // pero para simplificar, aquí lo adaptamos al flujo
            marginBottom: isLandscape ? 20 : 20,
            height: isLandscape ? 0 : 80, // Ocultar preview en landscape para ganar espacio (opcional)
            opacity: isLandscape ? 0 : 1
        },
        miniThumb: {
            width: 60, height: 60, borderRadius: 8, marginRight: 8,
            borderWidth: 2, borderColor: 'white'
        },
        countLabel: {
            color: 'white', textAlign: 'center', fontSize: 12, marginTop: 4,
            textShadowColor: 'black', textShadowRadius: 2
        },

        // --- BOTONES ---
        buttonsRow: { 
            flexDirection: isLandscape ? 'column-reverse' : 'row', // En vertical fila, en horizontal columna invertida
            justifyContent: 'space-around', 
            alignItems: 'center',
            width: isLandscape ? '100%' : '100%',
            height: isLandscape ? '100%' : 'auto',
            paddingHorizontal: isLandscape ? 0 : 30,
            gap: 20
        },
        
        // Estilos de botones (igual que antes)
        shutterBtn: {
            width: 70, height: 70, borderRadius: 35,
            backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
            borderWidth: 4, borderColor: '#ccc'
        },
        shutterInner: {
            width: 50, height: 50, borderRadius: 25,
            backgroundColor: 'white', borderWidth: 2, borderColor: '#333'
        },
        shutterActive: { backgroundColor: '#ccc' },
        
        smallBtn: {
            width: 50, height: 50, borderRadius: 25,
            backgroundColor: 'rgba(255,255,255,0.3)',
            justifyContent: 'center', alignItems: 'center'
        },
        btnFinish: { backgroundColor: '#43a047' },
        btnDisabled: { backgroundColor: '#555', opacity: 0.5 },
        smallBtnText: { color: 'white', fontSize: 24, fontWeight: 'bold' },

        // Permisos
        permissionContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
        textPermission: { color: 'white', textAlign:'center', marginBottom: 20, fontSize: 16 },
        btnPermiso: { backgroundColor: Colors.light.primary, padding: 12, borderRadius: 8 },
        txtBtn: { color: 'white', fontWeight: 'bold' }
    });
};