import * as tramoService from "../services/tramos.service.js"

export const getTramos = async (req, res) => {
    try {
        const tramos = await tramoService.getAllTramos();
        res.json(tramos);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los tramos" });
    }
};

export const createTramo = async (req, res) => {
    try {
        const newTramo = await tramoService.createTramo(req.body);
        res.status(201).json(newTramo);
    } catch (error) {
        res.status(400).json({ error: "Error al crear el tramo" });
    }
};

export const updateTramo = async (req, res) => {
    try {
        const updatedTramo = await tramoService.updateTramo(req.params.id, req.body);
        res.json(updatedTramo);
    } catch (error) {
        res.status(404).json({ error: "Tramo no encontrado o error al actualizar" });
    }
}

export const deleteTramo = async (req, res) => {
    try {
        await tramoService.deleteTramo(req.params.id);
        res.json({ message: "Tramo eliminado correctamente", id: parseInt(req.params.id) });
    } catch (error) {
        res.status(404).json({ error: "no se pudo Eliminar el tramo" });        
    }
};