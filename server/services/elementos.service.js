import { prisma } from "../db.js";

export const getAllElementos = async () => {
    return await prisma.elemento.findMany();
};

export const createElemento = async (data) => {
    return await prisma.elemento.create({
        data: data,
    });
};

export const updateElemento = async (id, data) => {
    return await prisma.elemento.update({
        where: {id: parseInt(id)},
        data: data,
    });
};

export const deleteElemento = async (id) => {
    return await prisma.elemento.delete({
        where: { id: parseInt(id) },
    });
};