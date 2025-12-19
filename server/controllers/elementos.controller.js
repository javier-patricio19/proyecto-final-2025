import * as elementoService from "../services/elementos.service.js";

export const getElementos = async (req, res) => {
    try {
        const tramos = await elementoService.getAllElementos();
        res.json(tramos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los elementos"});
    }
};

export const createElemento = async (req, res) => {
    try {
        const newElemento = await elementoService.createElemento(req.body);
        res.status(201).json(newElemento);
    } catch (error) {
        res.status(400).json({ error: "error al crear el elemento"});
    }
};

export const updateElemento = async (req, res) => {
    try {
        const updatedElemento = await elementoService.updateElemento(req.params.id, req.body);
        res.json(updatedElemento);
    } catch (error) {
        res.status(404).json({ error: "Elemeto no encontrado o error al actualizar"});
    }
};

export const deleteElemento = async (req, res) => {
    try {
        await elementoService.deleteElemento(req.params.id);
        res.json({ message: "Elemento eliminado correctamente", id: parseInt(req.params.id) });
    } catch (error) {
        res.status(404).json({ error: "no se pudo eliminar el elemento"});
    }
};