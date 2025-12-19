import * as observacionService from "../services/observaciones.service.js";
import fs from "fs";

export const getObservaciones = async (req, res) => {
    try {
        const observaciones = await observacionService.getAll();
        res.json(observaciones);
    } catch (error) {
        console.error("ERROR REAL:", error);
        res.status(500).json({ error: "Error al obtener las observaciones" });
    }
};

export const getObservacionById = async (req, res) => {
    try {
        const observacion = await observacionService.getById(req.params.id);
        if (!observacion) return res.status(404).json({ error: "No encontrada" });
        res.json(observacion);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la observación" });
    }
};

export const createObservacion = async (req, res) => {
    try {
        const archivos = req.files;
        const rawData = req.body;

        if (!archivos || archivos.length === 0) {
            return res.status(400).json({ error: "Se requiere al menos una imagen." });
        }

        const data = {
            tramoId: parseInt(rawData.tramoId),
            elementoId: parseInt(rawData.elementoId),
            kilometro: rawData.kilometro,
            cuerpo: rawData.cuerpo,
            carril: rawData.carril,
            fecha: new Date(rawData.fecha),
            observacion: rawData.observacion,
            observacion_corta: rawData.observacion_corta,
            recomendacion: rawData.recomendacion,
            estado: rawData.estado || 'Reportado',
            lat: rawData.lat ? parseFloat(rawData.lat) : null,
            lng: rawData.lng ? parseFloat(rawData.lng) : null
        };

        const newObservacion = await observacionService.create(data, archivos);
        res.status(201).json(newObservacion);

    } catch (error) {
        console.error(error);
        
        if (req.files) req.files.forEach(f => fs.unlinkSync(f.path));
        res.status(500).json({ error: "Error al crear la observación" });
    }
};

export const updateObservacion = async (req, res) => {
    try {
        console.log("REQ.BODY RECIBIDO:", req.body);
        const archivos = req.files;
        const rawData = req.body;
        
        const data = {};
        if(rawData.tramoId) data.tramoId = parseInt(rawData.tramoId);
        if(rawData.elementoId) data.elementoId = parseInt(rawData.elementoId);
        if(rawData.fecha) data.fecha = new Date(rawData.fecha);
        if(rawData.lat) data.lat = parseFloat(rawData.lat);
        if(rawData.lng) data.lng = parseFloat(rawData.lng);
        if(rawData.observacion) data.observacion = rawData.observacion;
        if(rawData.observacion_corta) data.observacion_corta = rawData.observacion_corta;
        if(rawData.recomendacion) data.recomendacion = rawData.recomendacion;
        if(rawData.estado) data.estado = rawData.estado;
        if(rawData.kilometro) data.kilometro = rawData.kilometro;
        if(rawData.carril) data.carril = rawData.carril;
        if(rawData.cuerpo) data.cuerpo = rawData.cuerpo;


        const updated = await observacionService.update(req.params.id, data, archivos);
        res.json(updated);

    } catch (error) {
        console.error(error);
        if (req.files) req.files.forEach(f => fs.unlinkSync(f.path));
        res.status(500).json({ error: "Error al actualizar" });
    }
};

export const deleteObservacion = async (req, res) => {
    try {
        await observacionService.deleteObservacion(req.params.id);
        res.json({ message: "Observación eliminada", id: parseInt(req.params.id) });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
};

export const deleteImagen = async (req, res) => {
    try {
        const result = await observacionService.deleteImagen(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar imagen" });
    }
};

export const deleteMultiple = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: "IDs inválidos" });
        
        const result = await observacionService.deleteMultiple(ids);
        res.json({ message: "Eliminadas correctamente", count: result.count });
    } catch (error) {
        res.status(500).json({ error: "Error masivo" });
    }
};