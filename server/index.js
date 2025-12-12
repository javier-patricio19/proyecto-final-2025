import express from "express";
import cors from "cors";
import tramosRoute from "./routes/tramos.route.js"; 
import elementosRoute from "./routes/elementos.route.js";
import observacionesRoute from "./routes/observaciones.route.js";
// Allow requests from all origins (for development or public APIs)

const app = express();
app.use(cors());

app.use(express.json());

app.use('/images', express.static('images'));

app.use("/api", tramosRoute);
app.use("/api", elementosRoute);
app.use("/api", observacionesRoute);

app.listen(5000, () => {
    console.log("Server is running port 5000");
});