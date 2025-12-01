import express from "express";
import {PrismaClient} from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/verTramos", async (req, res) => {
    const tramos = await prisma.tramo.findMany();
    res.json(tramos);
});

router.post("/agregarTramos", async(req, res) => {
    const newTramo = await prisma.tramo.create({
        data: req.body,
    });
    res.json(newTramo);
})

export default router;