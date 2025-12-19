import express from "express";
import * as observacionController from "../controllers/observaciones.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// GET
router.get("/observaciones", observacionController.getObservaciones);
router.get("/observaciones/:id", observacionController.getObservacionById);

// POST (Create)
router.post("/observaciones", upload.array('imagenes', 10), observacionController.createObservacion);

// PUT (Update)
router.put("/observaciones/:id", upload.array('imagenes', 10), observacionController.updateObservacion);

// DELETE
router.delete("/observaciones/multiple", observacionController.deleteMultiple); // Ojo: esta debe ir ANTES de /:id para que no confunda "multiple" con un ID
router.delete("/observaciones/:id", observacionController.deleteObservacion);

// IMAGENES
router.delete("/imagenes/:id", observacionController.deleteImagen);

export default router;