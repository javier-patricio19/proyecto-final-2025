import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

router.get("/verTramos", async (req, res) => {
    const tramos = await prisma.tramo.findMany();
    res.json(tramos);
});

router.post("/agregarTramos", async(req, res) => {
    const newTramo = await prisma.tramo.create({
        data: req.body,
    });
    res.json(newTramo);
});

router.delete("/borrartramo/:id", async (req, res) => {
    const tramoDeleted = await prisma.tramo.delete({
        where: {
            id: parseInt(req.params.id),
        },
    });
    if (!tramoDeleted) {
        return res.status(404).json({ error: "Tramo no encontrado"});
    }

    return res.json(tramoDeleted);
});

router.put('/editarTramo/:id', async (req, res) => {
      const tramoUpdated = await prisma.tramo.update({
        where: {
            id: parseInt(req.params.id)
        },
        data: req.body,
      });
      
      return res.json(tramoUpdated);
});

export default router;