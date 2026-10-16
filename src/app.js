import express from "express";
import connectDB from "./config/dbConnect.js";
import routes from "./routes/index.js";

const app = express();
const conn = await connectDB();

// Middleware para permitir o envio de dados no formato JSON
app.use(express.json()); 

routes(app);

export default app;