import express from "express";
import DominioController from "../controllers/DominioController.js";

const routes = express.Router();

routes.get("/dominios", DominioController.listarDominios)
routes.get("/dominios/:id", DominioController.listaDominioPorId);
routes.post("/dominios", DominioController.cadastrarDominio);
routes.put("/dominios/:id", DominioController.atualizaDominioPorId);
routes.delete("/dominios/:id", DominioController.deletaDominioPorId);

export default routes;