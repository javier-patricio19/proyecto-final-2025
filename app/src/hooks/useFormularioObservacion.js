import { useState, useEffect } from 'react';
import db from '../database/db';
import { guardarObservacionService } from '../utils/VoiceLogic';

export const useFormularioObservacion = (navigation, routeParams) => {
    const { tramoId, tramoNombre, fotos, coords, datosDetectados } = routeParams;

    const [listaElementos, setListaElementos] = useState([]);
    
    // Configuración de Alertas
    const [alertConfig, setAlertConfig] = useState({ 
        visible: false, 
        type: 'info', 
        title: '', 
        message: '', 
        buttons: [] 
    });

    // Estado del Formulario
    const [form, setForm] = useState({
        elementoId: datosDetectados.elementoId || '', 
        kilometro: datosDetectados.kilometro ? String(datosDetectados.kilometro) : '', // Aseguramos string
        cuerpo: datosDetectados.cuerpo || '',    
        carril: datosDetectados.carril || '',    
        observacion: datosDetectados.observacion || '',
        recomendacion: datosDetectados.recomendacion || '',
        estado: 'Reportado'
    });

    // --- CARGA INICIAL ---
    useEffect(() => {
        const initData = async () => {
            try {
                // Carga elementos de la BD
                const resultados = await db.getAllAsync('SELECT * FROM elementos ORDER BY nombre ASC');
                setListaElementos(resultados);
            } catch (e) {
                console.error("Error cargando elementos", e);
            }

            // Validación inicial: Si el dictado falló en el elemento, avisar.
            if (!datosDetectados.elementoId) {
                setTimeout(() => {
                    showAlert('warning', 'Atención', 'No detecté el nombre del elemento. Por favor selecciónalo manualmente.');
                }, 500);
            }
        };

        initData();
    }, []);

    // --- HELPERS ---

    const showAlert = (type, title, message, buttons = []) => {
        setAlertConfig({ visible: true, type, title, message, buttons });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    // --- GUARDADO ---

    const handleGuardar = async () => {
        // Validaciones básicas
        if (!form.elementoId) {
            showAlert('error', 'Falta Elemento', 'Selecciona qué elemento estás reportando.');
            return;
        }
        if (!form.cuerpo || !form.carril) {
            showAlert('error', 'Datos Incompletos', 'Por favor selecciona Cuerpo y Carril.');
            return;
        }

        try {
            await guardarObservacionService(form, fotos, coords, tramoId);
            
            showAlert(
                'success', 
                '¡Guardado!', 
                'La observación se registró correctamente.\n¿Qué deseas hacer ahora?',
                [
                    { text: "Continuar Capturando", onPress: () => { navigation.reset({ index: 1,
                                routes: [
                                    { name: 'Tramos' }, // Base
                                    { name: 'DetalleTramo', params: { tramoId, tramoNombre } } // Tope
                                ],
                            });
                        } },
                    { text: "Finalizar", style: "destructive", onPress: () => navigation.popToTop() }
                ]
            );
        } catch (error) {
            showAlert('error', 'Error al Guardar', error.message);
        }
    };

    return {
        form,
        listaElementos,
        fotos, 
        alertConfig,
        hideAlert,
        handleChange,
        handleGuardar
    };
};