export const crearObservacion = async (data) => {
    try {
        const response = await fetch('/api/agregarObservacion', {
            method: 'POST',
            body: data,
        });
        if (!response.ok) {
            const errorDatos = await response.json();
            throw new Error(errorDatos.error || 'Error al crear la observación');
        }
        return response.json();
    } catch (error) {
        console.error('Error en crearObservacion:', error);
        throw error;
    }
};

export const fetchObservaciones = async () => {
    try {
        const response = await fetch("/api/verObservaciones");
        if (!response.ok) throw new Error(`Error, Estado: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error en fetchObservaciones:', error);
        throw error;
    }
};

export const updateObservacion = async (id, data) => {
    try {
        const response = await fetch(`/api/editarObservacion/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) { throw new Error('Error al actualizar la observación'); }
        return response.json();
    } catch (error) {
        console.error('Error en updateObservacion:', error);
        throw error;
    }
};

export const deleteObservacion = async (id) => {
    try {
        const response = await fetch(`/api/borrarObservacion/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar la observación');
        return {id, message: 'Observación eliminada correctamente'};
    } catch (error) {
        console.error('Error en deleteObservacion:', error);
        throw error;
    }
};