import { prisma } from "../db.js";

export const getAllTramos = async () =>{
    return await prisma.tramo.findMany();
};

export const createTramo = async (data) => {
    return await prisma.tramo.create({
        data: data,
    });
};

export const updateTramo = async (id, data) => {
    return await prisma.tramo.update({
        where: {id: parseInt(id)},
        data: data,
    });
};

export const deleteTramo = async (id) => {
    return await prisma.tramo.delete({
        where: { id: parseInt(id)},
    });
};