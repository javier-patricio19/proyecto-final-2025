import { api } from "../utils/api";

export const fetchTramos = async () => {
    return await api.get('/tramos');
};

export const crearTramos = async (data) => {
    const update = new Date().toISOString();
    const dataToSend = {...data, updated_at: update};
    return await api.post('/tramos', dataToSend);
};

export const updateTramo = async (id, data) => {
    const update = new Date().toISOString();
    const dataToSend = {...data, updated_at: update};
    return await api.put(`/tramos/${id}`, dataToSend);   
};

export const deleteTramo = async (id) => {
    return await api.delete(`/tramos/${id}`)
};