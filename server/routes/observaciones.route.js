import express from "express";
import { prisma } from "../db.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { count } from "console";

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
        if (datosObservacion.lat) datosObservacion.lat = parseFloat(datosObservacion.lat);
        if (datosObservacion.lng) datosObservacion.lng = parseFloat(datosObservacion.lng);
        
        console.log("Datos recibidos para la observación:", datosObservacion);
        console.log("Archivos recibidos:", archivos.length);

        const newObservacion = await prisma.observacion.create({
            data: {
                tramoId: datosObservacion.tramoId,
                elementoId: datosObservacion.elementoId,
                kilometro: datosObservacion.kilometro,
                cuerpo: datosObservacion.cuerpo,
                carril: datosObservacion.carril,
                fecha: new Date(datosObservacion.fecha), 
                observacion: datosObservacion.observacion,
                observacion_corta: datosObservacion.observacion_corta,
                recomendacion: datosObservacion.recomendacion,
                estado: datosObservacion.estado || 'Reportado',
                lat: datosObservacion.lat || null,
                lng: datosObservacion.lng || null
            },
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

router.get("/verObservacion/:id", async (req, res) => {
    try {
        const observacion = await prisma.observacion.findUnique({
            where: {id: parseInt(req.params.id)},
            include: {imagenes: true},
        });
        if (!observacion) return res.status(404).json({error: "Observación no encontrada"});
        res.json(observacion);
    } catch (error) {
        res.status(500).json({error: "Error al obtener la observación."});
    }
});

router.put("/editarObservacion/:id", upload.array('imagenes', 10), async (req, res) => {
    try {
        const observacionId = parseInt(req.params.id);
        const datosActualizar = req.body;
        const archivosNuevos = req.files;

        if(datosActualizar.tramoId) datosActualizar.tramoId = parseInt(datosActualizar.tramoId);
        if(datosActualizar.elementoId) datosActualizar.elementoId = parseInt(datosActualizar.elementoId);
        if(datosActualizar.estado) datosActualizar.estado = String(datosActualizar.estado);
        if(datosActualizar.fecha) datosActualizar.fecha = new Date(datosActualizar.fecha);
        if (datosActualizar.lat) datosActualizar.lat = parseFloat(datosActualizar.lat);
        if (datosActualizar.lng) datosActualizar.lng = parseFloat(datosActualizar.lng);
        
        const observacionUpdated = await prisma.observacion.update({
            where: {id: observacionId},
            data: datosActualizar,
            include: { imagenes: true }
        });

        if (archivosNuevos && archivosNuevos.length > 0) {
            const imagenesData = archivosNuevos.map(file => ({
                nombre: file.filename,
                ruta: `/images/${file.filename}`,
                observacionId: observacionUpdated.id,
            }));

            await prisma.imagen.createMany({
                data: imagenesData,
            });
        }

        return res.json(observacionUpdated);

    } catch (error) {
        console.error("Error al actualizar la observación:", error);
        if (req.files) {
            req.files.forEach(file => {
                fs.unlinkSync(file.path);
            });
        }
        res.status(500).json({error: "Error interno al actualizar la observación"});
    }
});

router.delete("/borrarImagen/:id", async (req, res) => {
    const imagenId = parseInt(req.params.id);
    try {
        const imagen = await prisma.imagen.findUnique({
            where: {id: imagenId},
        });

        if (!imagen) {
            return res.status(404).json({error: "imagen no encontrada"});
        }
        const rutaArchivo = path.join(process.cwd(), 'images', path.basename(imagen.ruta));
        if (fs.existsSync(rutaArchivo)) {
            fs.unlinkSync(rutaArchivo);
            console.log(`archivo físico eliminado: ${rutaArchivo}`);
        } else{
            console.log(`Archivo fisico no encontrado en disco: ${rutaArchivo}`);
        }

        await prisma.imagen.delete({
            where: {id:imagenId},
        });

        return res.json({ message: "Imagen eliminanda con éxito", id: imagenId});

    } catch (error) {
        console.error("Error al borrar la imagen:", error);
        res.status(500).json({error: "error interno del servidor al eliminar la imagen."});
    }
});

router.delete("/borrarMultiple", async (req, res) => {
    try {
        const {ids} =req.body;

        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ error: "Se requiere un array de IDs" });
        }

        const imagenes = await prisma.imagen.findMany({
            where: {observacionId: {in: ids}}
        });

        imagenes.forEach(img => {
            const ruta = path.join(process.cwd(), 'images', path.basename(img.ruta));
            if(fs.existsSync(ruta)) fs.unlinkSync(ruta);
        });

        const deleted = await prisma.observacion.deleteMany({
            where: {
                id: {in: ids}
            }
        });

        res.json({ message: `${deleted.count} observaciones eliminadas`, count: deleted.count });
    } catch (error) {
        console.error("Error en borrarMultiple:", error);
        res.status(500).json({ error: "Error al eliminar múltiples registros"});
    }
});

export default router;