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
    return await prisma.$transaction(async (tx) => {
        
        const tramoInfo = await tx.tramo.findUnique({
            where: { id: data.tramoId }
        });

        const fechaDate = new Date(data.fecha);
        const startOfDay = new Date(fechaDate); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(fechaDate); endOfDay.setHours(23, 59, 59, 999);

        const cantidadExistentes = await tx.observacion.count({
            where: {
                tramoId: data.tramoId,
                fecha: { gte: startOfDay, lte: endOfDay }
            }
        });
        
        data.codigo = generarCodigoObservacion(tramoInfo, data.fecha, cantidadExistentes);

        const newObservacion = await tx.observacion.create({
            data: data,
        });

        if (files && files.length > 0) {
            const imagenesData = files.map(file =>({
                nombre: file.filename,
                ruta: `/images/${file.filename}`,
                observacionId: newObservacion.id,
            }));

            await tx.imagen.createMany({
                data: imagenesData,
            });
        }

        return await tx.observacion.findUnique({
            where: { id: newObservacion.id},
            include: {imagenes: true},
        });
    });
};

export const update = async (id, data, newFiles) => {
    const idInt = parseInt(id);

    if (data.tramoId || data.fecha) {
        const currentObs = await prisma.observacion.findUnique({ where: { id: idInt } });
        
        const targetTramoId = data.tramoId || currentObs.tramoId;
        const targetFecha = data.fecha ? new Date(data.fecha) : currentObs.fecha;

        const tramoInfo = await prisma.tramo.findUnique({ where: { id: targetTramoId } });
        
        const startOfDay = new Date(targetFecha); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetFecha); endOfDay.setHours(23, 59, 59, 999);
        
        const count = await prisma.observacion.count({
            where: {
                tramoId: targetTramoId,
                fecha: { gte: startOfDay, lte: endOfDay },
                id: { not: idInt }
            }
        });

        data.codigo = generarCodigoObservacion(tramoInfo, targetFecha, count);
    }
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
        try {
            if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
        } catch (err) {
            console.warn(`No se pudo borrar archivo físico: ${rutaArchivo}`, err);
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
        try {
            if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
        } catch (err) {
            console.warn(`Error borrando archivo: ${rutaArchivo}`);
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
        try {
            if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
        } catch (err) {
            console.warn(`Error borrando archivo masivo: ${ruta}`);
        }
    });

    const deleted = await prisma.observacion.deleteMany({
        where: { id: { in: ids } }
    });

    return deleted;
};