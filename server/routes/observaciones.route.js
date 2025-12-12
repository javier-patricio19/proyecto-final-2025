import express from "express";
import { prisma } from "../db.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get("/verObservaciones", async (req, res) => {
    try {
        const observaciones = await prisma.observacion.findMany({
            include: {
                imagenes: true,
            },
            orderBy:{
                fecha: 'desc',
            },
        });
        res.json(observaciones);
    } catch (error) {
        console.error("Error al obtener las observaciones:", error);
        res.status(500).json({ error: "Error al obtener las observaciones" });
    }
});

router.post("/agregarObservacion",upload.array('imagenes', 10), async (req, res) => {
    try {
        const archivos = req.files;
        const datosObservacion = req.body;

        if(!archivos || archivos.length === 0){
            return res.status(400).json({ error: "Se requiere al menos una imagen." });
        }

        datosObservacion.tramoId = parseInt(datosObservacion.tramoId);
        datosObservacion.elementoId = parseInt(datosObservacion.elementoId);
        
        console.log("Datos recibidos para la observación:", datosObservacion);
        console.log("Archivos recibidos:", archivos.length);

        const newObservacion = await prisma.observacion.create({
            data: datosObservacion,
        });
        console.log("Observación principal creada:", newObservacion.id);

        if (archivos && archivos.length > 0) {
            const imagenesData = archivos.map(file => ({
                nombre: file.filename,
                ruta: `/images/${file.filename}`,
                observacionId: newObservacion.id,
            }));

            await prisma.imagen.createMany({
                data: imagenesData,
            });
            console.log(`Se crearon ${imagenesData.length} registros de imágenes.`);
        }            
        res.status(201).json(newObservacion);
        
    } catch (error) {
        console.error("Error al crear la observación:", error);
        res.status(500).json({ error: "Error al crear la observación" });
    }
});

router.delete("/borrarObservacion/:id", async (req, res) => {
    const observacionId = parseInt(req.params.id);
    try {
        const imagenes = await prisma.imagen.findMany({
            where: { observacionId: observacionId },
        });

        for (const imagen of imagenes) {
            const rutaArchivo = path.join(process.cwd(), 'images', path.basename(imagen.ruta));
            if (fs.existsSync(rutaArchivo)) {
                fs.unlinkSync(rutaArchivo);
                console.log(`Archivo eliminado: ${rutaArchivo}`);
            } else {
                console.log(`Archivo no encontrado, pero registado en BD: ${rutaArchivo}`);
            }
        }
        const observacionDeleted = await prisma.observacion.delete({
            where: {
                id: parseInt(req.params.id),
            },
        });
        if (!observacionDeleted) {
            return res.status(404).json({ error: "Observación no encontrada" });
        }

        return res.json(observacionDeleted);
    } catch (error) {
        console.error("Error al borrar la observación y sus archivos:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar la observación." });
    }
});



export default router;