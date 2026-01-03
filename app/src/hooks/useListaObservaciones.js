import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import db from '../database/db'; // Ajusta la ruta si es necesario

export const useListaObservaciones = (navigation, routeParams) => {
    const { tramoId } = routeParams;
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función de carga
    const cargarObservaciones = async () => {
        try {
            setLoading(true);
            // Consulta SQL optimizada
            const query = `
                SELECT 
                    o.id, 
                    o.kilometro, 
                    o.observacion, 
                    o.sincronizado,
                    e.nombre as nombreElemento,
                    (SELECT uri FROM imagenes WHERE observacionId = o.id LIMIT 1) as fotoPortada
                FROM observaciones o
                LEFT JOIN elementos e ON o.elementoId = e.id
                WHERE o.tramoId = ?
                ORDER BY o.id DESC
            `;
            
            const resultados = await db.getAllAsync(query, [tramoId]);
            setLista(resultados);
        } catch (error) {
            console.error("Error cargando observaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    // Recargar al enfocar la pantalla
    useFocusEffect(
        useCallback(() => {
            cargarObservaciones();
        }, [])
    );

    // Acción para el botón flotante
    const irACaptura = () => {
        navigation.navigate('CapturaCamara', { tramoId });
    };

    return {
        lista,
        loading,
        irACaptura
    };
};