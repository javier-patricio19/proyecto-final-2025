import axios from 'axios';
import db from '../database/db';

const API_URL = "https://latoya-stereochromatic-georgette.ngrok-free.dev/api"; 

export const syncCatalogos = async () => {
    try {
        const [resTramos, resElementos] = await Promise.all([
            axios.get(`${API_URL}/tramos`, { timeout: 10000 }),
            axios.get(`${API_URL}/elementos`, { timeout: 10000 })
        ]);

        // Guardar en la BD local con Transacción
        await db.withTransactionAsync(async () => {
            await db.runAsync('DELETE FROM tramos');
            for (const t of resTramos.data) {
                await db.runAsync(
                    'INSERT OR REPLACE INTO tramos (id, inicio, destino) VALUES (?, ?, ?)', 
                    [t.id, t.inicio, t.destino]
                );
            }

            await db.runAsync('DELETE FROM elementos');
            for (const e of resElementos.data) {
                await db.runAsync(
                    'INSERT OR REPLACE INTO elementos (id, tipo, nombre) VALUES (?, ?, ?)', 
                    [e.id, e.tipo, e.nombre]
                );
            }
        });

        return true;
    } catch (error) {
        console.error("❌ Error en syncCatalogos:", error.message);
        return false;
    }
};

export const getTramosLocales = async () => {
    try {
        return await db.getAllAsync('SELECT * FROM tramos ORDER BY inicio ASC'); 
    } catch (error) {
        console.error("Error al leer tramos:", error);
        return [];
    }
};

export const subirDatosPendientes = async () => {
    try {
        const pendientes = await db.getAllAsync('SELECT * FROM observaciones WHERE sincronizado = 0');
        
        if (pendientes.length === 0) {
            return { success: true, message: "No hay datos pendientes por subir." };
        }

        let subidos = 0;
        let errores = 0;

        for (const obs of pendientes) {
            try {
                // 2. Buscar fotos
                const fotos = await db.getAllAsync('SELECT uri FROM imagenes WHERE observacionId = ?', [obs.id]);


                const formData = new FormData();

                formData.append('kilometro', obs.kilometro);
                formData.append('lat', String(obs.lat));
                formData.append('lng', String(obs.lng));
                formData.append('cuerpo', obs.cuerpo);
                formData.append('carril', obs.carril);
                formData.append('fecha', obs.fecha);
                formData.append('observacion', obs.observacion);
                formData.append('observacion_corta', obs.observacion_corta || ''); 
                formData.append('recomendacion', obs.recomendacion || '');
                formData.append('estado', obs.estado);
                formData.append('tramoId', String(obs.tramoId));
                formData.append('elementoId', String(obs.elementoId));

                if (obs.codigo && !obs.codigo.startsWith('TEMP-')) {
                    formData.append('codigo', obs.codigo);
                }

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

                // 4. ENVIAR
                await axios.post(`${API_URL}/observaciones`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 15000 
                });

                // 5. LIMPIEZA POST-SUBIDA
                // Borramos solo si el servidor respondió OK (200/201)
                await db.runAsync('DELETE FROM imagenes WHERE observacionId = ?', [obs.id]);
                await db.runAsync('DELETE FROM observaciones WHERE id = ?', [obs.id]);
                
                subidos++;

            } catch (error) {
                console.error(`❌ Falló obs ID ${obs.id}:`, error.message);
                errores++;
            }
        }

        return { 
            success: true, 
            subidos, 
            errores, 
            message: `Proceso finalizado. Subidos: ${subidos}, Errores: ${errores}` 
        };

    } catch (error) {
        console.error("Error general subiendo datos:", error);
        return { success: false, message: "Error de conexión o base de datos." };
    }
};