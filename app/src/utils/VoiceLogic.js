import db from '../database/db';

/**
 * Función que toma el texto dictado y busca patrones clave
 * para llenar el formulario automáticamente.
 */
export const procesarTextoDictado = async (texto, formActual) => {
    const textoLower = texto.toLowerCase();
    let nuevoForm = { ...formActual };

    // 1. Buscar Elemento en BD (Necesitamos consultar la BD aquí o pasarle la lista)
    // Para eficiencia, haremos una consulta rápida al catálogo local.
    const elementos = await db.getAllAsync('SELECT * FROM elementos');
    
    const elementoEncontrado = elementos.find(e => textoLower.includes(e.nombre.toLowerCase()));
    
    if (elementoEncontrado) {
        nuevoForm.elementoId = elementoEncontrado.id;
        nuevoForm.elementoNombre = elementoEncontrado.nombre;
    }

    // 2. Función auxiliar para extraer texto después de palabra clave
    const extraer = (clave) => {
        const index = textoLower.indexOf(clave);
        if (index !== -1) {
            // Cortamos el texto desde la clave
            let resto = textoLower.substring(index + clave.length).trim();
            // Palabras que cortan la búsqueda
            const keywords = ['kilómetro', 'kilometro', 'cuerpo', 'carril', 'observación', 'observacion', 'daño', 'recomendación', 'recomendacion', 'estado'];
            
            let minIndex = resto.length;
            keywords.forEach(k => {
                const kIndex = resto.indexOf(k);
                if (kIndex !== -1 && kIndex < minIndex) minIndex = kIndex;
            });
            
            return resto.substring(0, minIndex).trim();
        }
        return null;
    };

    // 3. Mapeo de campos
    const km = extraer('kilómetro') || extraer('kilometro');
    const cuerpo = extraer('cuerpo');
    const carril = extraer('carril');
    const obs = extraer('observación') || extraer('observacion') || extraer('daño');
    const rec = extraer('recomendación') || extraer('recomendacion');

    // 4. Asignación (Solo si encontró algo, si no mantiene lo anterior)
    if (km) nuevoForm.kilometro = km;
    if (cuerpo) nuevoForm.cuerpo = cuerpo.toUpperCase().charAt(0);
    if (carril) nuevoForm.carril = carril.charAt(0).toUpperCase() + carril.slice(1); // Capitalizar
    if (obs) nuevoForm.observacion = obs.charAt(0).toUpperCase() + obs.slice(1);
    if (rec) nuevoForm.recomendacion = rec.charAt(0).toUpperCase() + rec.slice(1);

    return nuevoForm;
};

/**
 * Función para guardar en la BD
 */
export const guardarObservacionService = async (form, fotos, coords, tramoId) => {
    if (!form.elementoId || !form.observacion) {
        throw new Error("Faltan datos obligatorios (Elemento u Observación).");
    }

    const codigoTemporal = `TEMP-${Date.now()}`;
    const fecha = new Date().toISOString();
    // Primeras 2 palabras para obs corta
    const obsCorta = form.observacion.split(' ').slice(0, 2).join(' ');

    await db.withTransactionAsync(async () => {
        // 1. Insertar Observación
        const res = await db.runAsync(
            `INSERT INTO observaciones (
                codigo, kilometro, lat, lng, cuerpo, carril, fecha, 
                observacion, observacion_corta, recomendacion, estado, 
                tramoId, elementoId, sincronizado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
            [
                codigoTemporal, form.kilometro, 
                coords.latitude, coords.longitude,
                form.cuerpo, form.carril, fecha, 
                form.observacion, obsCorta, form.recomendacion, form.estado,
                tramoId, form.elementoId
            ]
        );

        const observacionId = res.lastInsertRowId;

        // 2. Insertar Imágenes
        for (const uri of fotos) {
            await db.runAsync('INSERT INTO imagenes (uri, observacionId) VALUES (?, ?)', [uri, observacionId]);
        }
    });
    
    return true;
};