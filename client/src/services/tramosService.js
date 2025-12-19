export const fetchTramos = async () => {
    try {
        const response = await fetch(`/api/tramos`);

        if (!response.ok) {
            throw new Error(`Error, Estado: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("hubo un problema con la operación fetch:", error);
        throw error;
    }
};

export const crearTramos = async (data) => {
    const update = new Date().toISOString();
    const dataToSend = {...data, updated_at: update};

    try {
        const response = await fetch("/api/tramos", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            const errorDatos = await response.json();
            throw new Error(errorDatos.error || 'fallo al agregar el dato');
        }

        const registroNuevo = await response.json();
        return registroNuevo;

    } catch (error) {
        console.error("error en fetch POST", error);
        throw error;
    }
};

export const updateTramo = async (id, data) => {
    const update = new Date().toISOString();
    const dataToSend = {...data, updated_at: update};

    try {
        const response = await fetch(`/api/tramos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        if (!response.ok) {
            const errorDatos = await response.json();
            throw new Error(errorDatos.error || 'fallo al actualizar el dato');
        }

        const updatedRegistro = await response.json();
        return updatedRegistro;

    } catch (error) {
        console.error("error en fetch PUT:", error);
        throw error;
    }
};

export const deleteTramo = async (id) => {
    try {
        const response = await fetch(`/api/tramos/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorDatos = await response.json();
            throw new Error(errorDatos.error || 'fallo al eliminar el dato');
        }
        return {id, message: "eliminado con éxito"};

    } catch (error) {
        console.error("error en fetch DELETE:", error);
        throw error;
    }
};