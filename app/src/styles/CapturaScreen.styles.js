import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Colors } from '../theme/Colors';

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
        
        // --- GPS (Sin cambios) ---
        topOverlay: {
            position: 'absolute',
            top: isLandscape ? 20 : (Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60),
            left: isLandscape ? 20 : 0,
            right: isLandscape ? null : 0,
            alignItems: isLandscape ? 'flex-start' : 'center',
            zIndex: 10,
        },
        badge: { 
            paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20,
            flexDirection: 'row', alignItems: 'center'
        },
        badgeGreen: { backgroundColor: 'rgba(76, 175, 80, 0.9)' },
        badgeGray: { backgroundColor: 'rgba(0,0,0,0.6)' },
        badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

        // --- CARRUSEL FLOTANTE (CAMBIOS AQUÍ) ---
        previewContainer: {
            position: 'absolute',
            zIndex: 20, // Más arriba que los controles
            
            // En Vertical: Lo ponemos justo encima de la barra de botones (aprox 150px desde abajo)
            // En Horizontal: Lo ponemos abajo a la izquierda
            bottom: isLandscape ? 20 : 160, 
            left: isLandscape ? 20 : 0,
            right: isLandscape ? null : 0, // En vertical ocupa todo el ancho
            
            height: 70,
        },
        miniThumb: {
            width: 60, height: 60, 
            borderRadius: 10, // Bordes redondeados más suaves
            marginRight: 10,
            // QUITAMOS EL BORDE BLANCO AQUÍ
            backgroundColor: '#333', // Fondo por si la imagen tarda en cargar
            overflow: 'hidden' // Para que la imagen respete el borde redondeado
        },
        countLabel: {
            color: 'white', textAlign: 'center', fontSize: 12, marginTop: 4,
            textShadowColor: 'black', textShadowRadius: 2,
            // Sombra para que se lea bien sobre cualquier fondo
            textShadowOffset: {width: 1, height: 1}
        },

        // --- CONTROLES (SIN CAMBIOS MAYORES) ---
        controlsOverlay: {
            position: 'absolute',
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.0)', // Totalmente transparente ahora (o leve degradado)
            
            ...(isLandscape ? {
                right: 0, top: 0, bottom: 0, width: 120, // Un poco más ancho para comodidad
                flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)', // Fondo oscuro solo en la barra lateral
            } : {
                bottom: 0, left: 0, right: 0, height: 150,
                flexDirection: 'column', justifyContent: 'center', paddingBottom: 20,
                // Degradado negro abajo para que resalten los botones
                backgroundColor: 'rgba(0,0,0,0.4)' 
            })
        },

        buttonsRow: { 
            flexDirection: isLandscape ? 'column-reverse' : 'row',
            justifyContent: 'space-around', 
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: isLandscape ? 0 : 30,
            gap: 30
        },
        
        shutterBtn: {
            width: 70, height: 70, borderRadius: 35,
            backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
            borderWidth: 4, borderColor: 'rgba(200,200,200,0.5)' // Aro gris suave semitransparente
        },
        shutterInner: {
            width: 54, height: 54, borderRadius: 27,
            backgroundColor: 'white', borderWidth: 2, borderColor: '#333'
        },
        shutterActive: { backgroundColor: '#ccc' },
        
        smallBtn: {
            width: 50, height: 50, borderRadius: 25,
            backgroundColor: 'rgba(0,0,0,0.5)', // Fondo negro semitransparente para mejor contraste
            justifyContent: 'center', alignItems: 'center'
        },
        btnFinish: { backgroundColor: '#43a047' },
        btnDisabled: { backgroundColor: '#333', opacity: 0.5 },
        smallBtnText: { color: 'white', fontSize: 24, fontWeight: 'bold' },

        // Permisos
        permissionContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
        textPermission: { color: 'white', textAlign:'center', marginBottom: 20, fontSize: 16 },
        btnPermiso: { backgroundColor: Colors.light.primary, padding: 12, borderRadius: 8 },
        txtBtn: { color: 'white', fontWeight: 'bold' }
    });
};