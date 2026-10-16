import express from "express";
import routes from "./routes/index.js";

const app = express();

// Middleware para permitir o envio de dados no formato JSON
app.use(express.json()); 

routes(app);

export default app;