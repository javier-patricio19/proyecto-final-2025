import React, { useCallback } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, useColorScheme, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from "./src/theme/Colors";
import { useAppInit } from "./src/hooks/useAppInit";
import TramosScreen from './src/screens/TramoScreen';
import DetalleTramoScreen from "./src/screens/DetalleTramoScreen";
import VoiceScreen from './src/screens/VoiceScreen';
import FormularioObservacionScreen from "./src/screens/FormularioObservacionScreen";
import CapturaScreen from './src/screens/CapturaScreen';  
import ListaObservacionesScreen from "./src/screens/ListaObservacionesScreen";


SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function App() {
  // 1. Llamamos al hook de carga
  const appIsReady = useAppInit();
  
  // 2. Detectamos tema para la UI
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;

  // 3. FUNCIÓN MÁGICA: Se ejecuta cuando la vista raíz ya se dibujó
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Solo ocultamos el splash cuando la app está lista Y pintada
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // 4. Si no está lista, retornamos null. 
  // Esto mantiene el Splash Nativo visible (no se ve pantalla blanca)
  if (!appIsReady) {
    return null;
  }

  return (
    // Envolvemos todo en una View con onLayout
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <StatusBar 
            barStyle={isDark ? "light-content" : "dark-content"} 
            backgroundColor={themeColors.headerBackground} 
        />
        
        <Stack.Navigator 
          screenOptions={{ 
            headerStyle: { 
              backgroundColor: isDark ? '#1E1E1E' : themeColors.primary,
              shadowColor: 'transparent',
              elevation: 0
            }, 
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            cardStyle: { backgroundColor: themeColors.background }
          }}
        >
          <Stack.Screen name="Tramos" component={TramosScreen} options={{ title: 'Seleccionar Tramo' }} />
          <Stack.Screen name="DetalleTramo" component={DetalleTramoScreen} options={{ title: 'Opciones' }} />
          <Stack.Screen name="CapturaCamara" component={CapturaScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VoiceRecord" component={VoiceScreen} options={{ title: 'Dictar Evidencia' }} />
          <Stack.Screen name="FormularioObservacion" component={FormularioObservacionScreen} options={{ title: 'Nueva Observación' }} />
          <Stack.Screen name="ListaObservaciones" component={ListaObservacionesScreen} options={{ title: 'Lista' }} />

        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}