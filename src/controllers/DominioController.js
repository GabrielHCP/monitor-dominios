import Dominio from "../models/Dominio.js";
import tratarErro from "../helpers/tratarErro.js";

class DominioController {
    static async listarDominios(req, res) {
        try {
            const listaDominios = await Dominio.find({});
            res.status(200).json(listaDominios);
        } catch (err) {
            tratarErro(err, res);
        }
    }
    static async listaDominioPorId(req, res) {
        try {
            const id = req.params.id;
            const dominioEncontrado = await Dominio.findById(id);
            if(!dominioEncontrado) {
               return res.status(404).json({message: "Domínio não encontrado"});
            }
            res.status(200).json(dominioEncontrado);
        } catch (err) {
            tratarErro(err, res);
        }
    }
    static async cadastrarDominio(req, res) {
        try {
            const {nome, dono, seletorDKIM} = req.body;
            const novoDominio = await Dominio.create({nome, dono, seletorDKIM});
            res.status(201).json({message: "Domínio criado com sucesso", dominio: novoDominio});
        } catch (err) {
            tratarErro(err, res);
        }
    }
    static async atualizaDominioPorId(req, res) {
        try {
            const id = req.params.id;
            const {seletorDKIM, ativo} = req.body;
            const dominioAtualizado = await Dominio.findByIdAndUpdate(
                id, 
                {seletorDKIM, ativo},
                {new: true, runValidators: true}
            );
            if(!dominioAtualizado) {
                return res.status(404).json({message: "Domínio não encontrado para realizar a atualização"});
            }
            res.status(200).json({message: "Domínio atualizado com sucesso", dominio: dominioAtualizado});
        } catch (err) {
            tratarErro(err, res);
        }
    }
    static async deletaDominioPorId(req, res) {
        try {
            const id = req.params.id;
            const dominioDeletado = await Dominio.findByIdAndDelete(id);
            if(!dominioDeletado) {
                return res.status(404).json({message: "Domínio não encontrado para deletar"});
            }
            res.status(200).json({message: "Domínio removido com sucesso"});
        } catch (err) {
            tratarErro(err, res);
        }   
    }
}

export default DominioController;