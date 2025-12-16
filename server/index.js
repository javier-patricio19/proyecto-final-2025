import express from "express";
import cors from "cors";
import tramosRoute from "./routes/tramos.route.js"; 
import elementosRoute from "./routes/elementos.route.js";
import observacionesRoute from "./routes/observaciones.route.js";
import path from "path";

// Allow requests from all origins (for development or public APIs)

const app = express();
app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use('/images', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Private-Network");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  res.header("Access-Control-Allow-Private-Network", "true");

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Private-Network');
    return res.sendStatus(204);
  }
  next();
}, express.static(path.join(process.cwd(), 'images')));

app.use("/api", tramosRoute);
app.use("/api", elementosRoute);
app.use("/api", observacionesRoute);

app.listen(5000, () => {
    console.log("Server is running port 5000");
});