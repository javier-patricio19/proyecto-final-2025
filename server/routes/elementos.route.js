import express from "express";
import * as elementosController from "../controllers/elementos.controller.js";

const router = express.Router();

router.get("/elementos", elementosController.getElementos);
router.post("/elementos", elementosController.createElemento);
router.put("/elementos/:id", elementosController.updateElemento);
router.delete("/elementos/:id", elementosController.deleteElemento);

export default router;