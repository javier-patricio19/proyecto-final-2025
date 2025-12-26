import { prisma } from "../db.js";
import { generarCodigoObservacion } from "../utils/CodigoGenerator.js";
import  fs  from "fs";
import path from "path";

export const getAll = async () => {
    return await prisma.observacion.findMany({
        include: { imagenes: true },
        orderBy: { fecha: 'desc' },
    });
};

export const getById = async (id) => {
    return await prisma.observacion.findUnique({
        where: { id: parseInt(id) },
        include: { 
            imagenes: true, 
            tramo: true,
            elemento: true
        },
    });
};

export const create = async (data, files) => {
    const tramoInfo = await prisma.tramo.findUnique({
        where: { id: data.tramoId }
    });

    const fechaDate = new Date(data.fecha);
    const startOfDay = new Date(fechaDate); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(fechaDate); endOfDay.setHours(23, 59, 59, 999);

    const cantidadExistentes = await prisma.observacion.count({
        where: {
            tramoId: data.tramoId,
            fecha: { gte: startOfDay, lte: endOfDay }
        }
    });
    
    data.codigo = generarCodigoObservacion(tramoInfo, data.fecha, cantidadExistentes);

    const newObservacion = await prisma.observacion.create({
        data: data,
    });

    if (files && files.length > 0) {
        const imagenesData = files.map(file =>({
            nombre: file.filename,
            ruta: `/images/${file.filename}`,
            observacionId: newObservacion.id,
        }));

        await prisma.imagen.createMany({
            data: imagenesData,
        });
    }

    return await prisma.observacion.findUnique({
        where: { id: newObservacion.id},
        include: {imagenes: true},
    });
};

export const update = async (id, data, newFiles) => {
    const observacionUpdated = await prisma.observacion.update({
        where: { id: parseInt(id) },
        data: data,
        include: { imagenes: true }
    });

    if(newFiles && newFiles.length > 0) {
        const imagenesData = newFiles.map(file => ({
            nombre: file.filename,
            ruta: `/images/${file.filename}`,
            observacionId: observacionUpdated.id,
        }));

        await prisma.imagen.createMany({
            data: imagenesData,
        });
    }
    return await prisma.observacion.findUnique({
        where: { id: parseInt(id) },
        include: { imagenes: true }
    });
};

export const deleteObservacion = async (id) => {
    const observacionId = parseInt(id);
    
    const imagenes = await prisma.imagen.findMany({
        where: { observacionId: observacionId },
    });

    for (const imagen of imagenes) {
        const rutaArchivo = path.join(process.cwd(), 'images', path.basename(imagen.ruta));
        if (fs.existsSync(rutaArchivo)) {
            fs.unlinkSync(rutaArchivo);
        }
    }

    return await prisma.observacion.delete({
        where: { id: observacionId },
    });
};

export const deleteImagen = async (id) => {
    const imagenId = parseInt(id);
    const imagen = await prisma.imagen.findUnique({ where: { id: imagenId } });

    if (imagen) {
        const rutaArchivo = path.join(process.cwd(), 'images', path.basename(imagen.ruta));
        if (fs.existsSync(rutaArchivo)) {
            fs.unlinkSync(rutaArchivo);
        }
        await prisma.imagen.delete({ where: { id: imagenId } });
    }
    return { id: imagenId, message: "Imagen eliminada" };
};

export const deleteMultiple = async (ids) => {
    const imagenes = await prisma.imagen.findMany({
        where: { observacionId: { in: ids } }
    });

    imagenes.forEach(img => {
        const ruta = path.join(process.cwd(), 'images', path.basename(img.ruta));
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    });

    const deleted = await prisma.observacion.deleteMany({
        where: { id: { in: ids } }
    });

    return deleted;
};