import express from "express";

const router = express.Router();

router.get("/user", (req, res) => {
    res.status(200).send("Users route");
});

export default router;