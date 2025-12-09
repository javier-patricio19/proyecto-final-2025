import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

router.get("/verElementos", async (req, res) => {
    const elementos = await prisma.elemento.findMany();
    res.json(elementos);
});

router.post("/agregarElemento", async(req, res) => {
    const newElemento = await prisma.elemento.create({
        data: req.body,
    });
    res.json(newElemento);
});

router.delete("/borrarElemento/:id", async (req, res) => {
    const elementoDeleted = await prisma.elemento.delete({
        where: {
            id: parseInt(req.params.id),
        },
    });
    if (!elementoDeleted) {
        return res.status(404).json({ error: "Elemento no encontrado"});
    }

    return res.json(elementoDeleted);
});

router.put('/editarElemento/:id', async (req, res) => {
      const elementoUpdated = await prisma.elemento.update({
        where: {
            id: parseInt(req.params.id)
        },
        data: req.body,
      });

        return res.json(elementoUpdated);
});

export default router;