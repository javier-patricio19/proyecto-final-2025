import { useEffect } from 'react';

export const usePageTitle = (titulo) => {
    useEffect(() => {
        document.title = `${titulo} | Gestión Aries`;
    }, [titulo]);
};