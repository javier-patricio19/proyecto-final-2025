import { api } from "../utils/api";

export const fetchObservaciones = async () => {
    return await api.get('/observaciones');
};

export const fetchObservacionById =async (id) => {
    return await api.get(`/observaciones/${id}`);
};

export const crearObservacion = async (data) => {
    return await api.post('/observaciones', data);
};

export const updateObservacion = async (id, data) => {
    return await api.put(`/observaciones/${id}`, data);
};

export const updateEstadoObservacion = async (id, nuevoEstado) => {
    const formData = new FormData();
    formData.append('estado', nuevoEstado);
    return await api.put(`/observaciones/${id}`, formData);
};

export const deleteObservacion = async (id) => {
    return await api.delete(`/observaciones/${id}`);
};

export const deleteImagen = async (id) => {
    return await api.delete(`/imagenes/${id}`);
};

export const deleteMultipleObservaciones = async (ids) => {
    return await api.delete('/observaciones/multiple', {ids});
}

