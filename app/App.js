import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initDatabase } from './src/database/db';
import { syncCatalogos } from './src/services/syncService';
import TramosScreen from './src/screens/TramoScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase(); // Crea las tablas
        await syncCatalogos(); // Intenta bajar datos del server
      } catch (e) {
        console.warn("Error en carga:", e);
      } finally {
        // Simulamos un pequeño retraso para que el logo se vea 2 segundos
        setTimeout(() => setIsReady(true), 2000);
      }
    }
    prepare();
  }, []);

  // Pantalla de Carga (Splash)
  if (!isReady) {
    return (
      <View style={styles.splash}>
        <Image 
          source={require('./assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Navegación Real
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#007AFF' }, headerTintColor: '#fff' }}>
        <Stack.Screen 
          name="Tramos" 
          component={TramosScreen} 
          options={{ title: 'Seleccionar Tramo' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  logo: { width: 250, height: 250, marginBottom: 20 }
});