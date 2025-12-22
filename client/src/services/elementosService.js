import { api } from "../utils/api";

export const fetchElementos = async () => {
    return await api.get('/elementos');
};

export const crearElemento = async (data) => {
    const update = new Date().toISOString();
    const dataToSend = {...data, updated_at: update};
    return await api.post('/elementos', dataToSend);
};

export const updateElemento = async (id, data) => {
    const update = new Date().toISOString();
    const dataToSend = {...data, updated_at: update};
    return await api.put(`/elementos/${id}`, dataToSend);
};

export const deleteElemento = async (id) => {
    return await api.delete(`/elementos/${id}`);
};