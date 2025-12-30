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