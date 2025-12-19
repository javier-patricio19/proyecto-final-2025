import express from "express";
import * as tramosController from "../controllers/tramos.controller.js";

const router = express.Router();

router.get("/tramos", tramosController.getTramos);
router.post("/tramos", tramosController.createTramo);
router.put("/tramos/:id", tramosController.updateTramo);
router.delete("/tramos/:id", tramosController.deleteTramo);

export default router;