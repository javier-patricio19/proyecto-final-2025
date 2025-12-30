import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('inspecciones.db');

export const initDatabase = async () => {
    try {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;

            -- Tabla de Tramos
            CREATE TABLE IF NOT EXISTS tramos (
                id INTEGER PRIMARY KEY NOT NULL,
                inicio TEXT,
                destino TEXT
            );

            -- Tabla de Elementos
            CREATE TABLE IF NOT EXISTS elementos (
                id INTEGER PRIMARY KEY NOT NULL,
                tipo TEXT,
                nombre TEXT
            );

            -- Tabla de Observaciones (Locales)
            CREATE TABLE IF NOT EXISTS observaciones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT UNIQUE,
                kilometro TEXT,
                lat REAL,
                lng REAL,
                cuerpo TEXT,
                carril TEXT,
                fecha TEXT,
                observacion TEXT,
                observacion_corta TEXT,
                recomendacion TEXT,
                estado TEXT,
                tramoId INTEGER,
                elementoId INTEGER,
                sincronizado INTEGER DEFAULT 0 -- 0: Pendiente, 1: Subido al server
            );

            -- Tabla de Imágenes (Locales)
            CREATE TABLE IF NOT EXISTS imagenes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uri TEXT, -- Ruta del archivo en el celular
                observacionId INTEGER,
                FOREIGN KEY (observacionId) REFERENCES observaciones (id) ON DELETE CASCADE
            );
        `);
        console.log("Estructura de BD local completa (Tramos, Elementos, Observaciones e Imágenes).");
    } catch (error) {
        console.error("Error al inicializar la BD:", error);
    }
};

export default db;