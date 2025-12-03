import express from "express";
import { prisma } from "../db.js";

const router = express.Router();

/*obtener un unico producto*/

router.get('/algo/:id'), async (req, res) => {
    const prdouctFound = await prisma.observacion.findFirst({
        where:{
            id:  parseInt(req.params.id),
        },
    });
    return res.json(prdouctFound);       
};