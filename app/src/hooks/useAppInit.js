import { useState, useEffect } from 'react';
import { initDatabase } from '../database/db';
import { syncCatalogos } from '../services/syncService';

export const useAppInit = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                await initDatabase();
                await syncCatalogos();
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (e) {
                console.warn("Error cargando recursos:", e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    return appIsReady;
};