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
            body: data,
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

export const fetchObservacionById =async (id) => {
    try {
        const response = await fetch(`/api/verObservacion/${id}`);
        if (!response.ok) throw new Error(`Error, Estado: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error("Error en fetchObservacionById: ", error);
        throw error;
    }
};

export const deleteImagen = async (id) => {
    try {
        const response = await fetch(`/api/borrarImagen/${id}`,{
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar la imagen');
        return {id, message: 'Imagen eliminada correctamente'};
    } catch (error) {
        console.error('Imagen eliminada correctamente');
        throw error;
    }
};

export const deleteMultipleObservaciones = async (ids) => {
    try {
        const response = await fetch("/api/borrarMultiple", {
            method:'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
        });
        if (!response.ok) throw new Error('Error al eliminar múltiples observaciones');
        return await response.json();

    } catch (error) {
        console.error('Error en deleteMultipleObservaciones:', error);
        throw error;
    }
}

export const actualizarEstadoObservacion = async (id, nuevoEstado) => {
    try {
        const response = await fetch(`/api/editarObservacion/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado }),
        });
        if (!response.ok) throw new Error('Error al actualizar el estado');
        return await response.json();
    } catch (error) {
        console.error('Error en actualizarEstadoObservacion:', error);
        throw error;
    }
};

