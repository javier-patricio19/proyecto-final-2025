import axios from 'axios';
import db from '../database/db';

// IMPORTANTE: Usa tu IP real aquí (ejemplo: 192.168.1.65)
const API_URL = "http://192.168.101.64:5000/api"; 

export const syncCatalogos = async () => {
    try {
        console.log("Iniciando descarga desde:", API_URL);
        
        const resTramos = await axios.get(`${API_URL}/tramos`, { timeout: 5000 });
        const resElementos = await axios.get(`${API_URL}/elementos`, { timeout: 5000 });

        // Guardar en la BD local
        await db.withTransactionAsync(async () => {
            await db.runAsync('DELETE FROM tramos');
            for (const t of resTramos.data) {
                await db.runAsync('INSERT INTO tramos (id, inicio, destino) VALUES (?, ?, ?)', [t.id, t.inicio, t.destino]);
            }

            await db.runAsync('DELETE FROM elementos');
            for (const e of resElementos.data) {
                await db.runAsync('INSERT INTO elementos (id, tipo, nombre) VALUES (?, ?, ?)', [e.id, e.tipo, e.nombre]);
            }
        });

        console.log("Sincronización exitosa.");
        return true;
    } catch (error) {
        console.error("Error en syncCatalogos:", error.message);
        return false;
    }
};

export const getTramosLocales = async () => {
    try {
        const resultados = await db.getAllAsync('SELECT * FROM tramos');
        return resultados;
    } catch (error) {
        console.error("Error al leer tramos locales:", error);
        return [];
    }
};

export const subirDatosPendientes = async () => {
    try {
        await db.runAsync('DELETE FROM imagenes WHERE observacionId IN (SELECT id FROM observaciones WHERE sincronizado = 1)');
        await db.runAsync('DELETE FROM observaciones WHERE sincronizado = 1');
        
        // 1. Buscar observaciones pendientes
        const pendientes = await db.getAllAsync('SELECT * FROM observaciones WHERE sincronizado = 0');
        
        if (pendientes.length === 0) {
            return { success: true, message: "No hay datos pendientes." };
        }

        let subidos = 0;
        let errores = 0;

        for (const obs of pendientes) {
            try {
                // 2. Buscar las fotos de esta observación
                const fotos = await db.getAllAsync('SELECT uri FROM imagenes WHERE observacionId = ?', [obs.id]);

                // 3. Armar el FormData
                const formData = new FormData();

                // Datos de texto
                // Si es código temporal, NO lo enviamos.
                if (!obs.codigo.startsWith('TEMP-')) {
                    formData.append('codigo', obs.codigo);
                }
                
                formData.append('kilometro', obs.kilometro);
                formData.append('lat', String(obs.lat));
                formData.append('lng', String(obs.lng));
                formData.append('cuerpo', obs.cuerpo);
                formData.append('carril', obs.carril);
                formData.append('fecha', obs.fecha);
                formData.append('observacion', obs.observacion);
                formData.append('observacion_corta', obs.observacion_corta);
                formData.append('recomendacion', obs.recomendacion);
                formData.append('estado', obs.estado);
                formData.append('tramoId', String(obs.tramoId));
                formData.append('elementoId', String(obs.elementoId));

                // Imágenes
                fotos.forEach((foto) => {
                    const filename = foto.uri.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename);
                    const type = match ? `image/${match[1]}` : `image/jpeg`;

                    formData.append('imagenes', {
                        uri: foto.uri,
                        name: filename,
                        type: type,
                    });
                });

                // 4. ENVIAR AL SERVIDOR
                await axios.post(`${API_URL}/observaciones`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 10000 
                });

                await db.runAsync('DELETE FROM imagenes WHERE observacionId = ?', [obs.id]);
                await db.runAsync('DELETE FROM observaciones WHERE id = ?', [obs.id]);
                
                subidos++;

            } catch (error) {
                console.error(`Error subiendo obs ID ${obs.id}:`, error);
                errores++;
            }
        }

        return { 
            success: true, 
            subidos, 
            errores, 
            message: `Se subieron y limpiaron ${subidos} observaciones.` 
        };

    } catch (error) {
        console.error("Error general en subida:", error);
        return { success: false, message: error.message };
    }
};