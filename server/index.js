import express from "express";
import cors from "cors";
import tramosRoute from "./routes/tramos.route.js"; 
import elementosRoute from "./routes/elementos.route.js";

// Allow requests from all origins (for development or public APIs)

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api", tramosRoute);
app.use("/api", elementosRoute);


app.listen(5000, () => {
    console.log("Server is running port 5000");
});