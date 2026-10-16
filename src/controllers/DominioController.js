import Dominio from "../models/Dominio.js";

class DominioController {
    static async listarDominios(req, res) {
        try {
            const listaDominios = await Dominio.find({});
            res.status(200).json(listaDominios);
        } catch (err) {
            res.status(500).json({ message: `${err.message} - falha na requisição` });
        }
    }
    static async listaDominioPorId(req, res) {
        try {
            const id = req.params.id;
            const dominioEncontrado = await Dominio.findById(id);
            res.status(200).json(dominioEncontrado);
        } catch (err) {
            res.status(500).json({ message: `${err.message} - falha na requisição` });
        }
    }
    static async cadastrarDominio(req, res) {
        try {
            const novoDominio = await Dominio.create(req.body);
            res.status(201).json({ message: "Domínio criado com sucesso", dominio: novoDominio });
        } catch (err) {
            res.status(500).json({ message: `${err.message} - falha ao cadastrar domínio na base de dados` })
        }
    }
    static async atualizaDominioPorId(req, res) {
        try {
            const id = req.params.id;
            await Dominio.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "Domínio atualizado com sucesso" });
        } catch (err) {
            res.status(500).json({ message: `${err.message} - falha ao atualizar domínio na base de dados` })
        }
    }
    static async deletaDominioPorId(req, res) {
        try {
            const id = req.params.id;
            await Dominio.findByIdAndDelete(id);
            res.status(200).json({ message: "Domínio removido com sucesso" });
        } catch (err) {
            res.status(500).json({ message: `${err.message} - falha ao remover domínio na base de dados` })
        }   
    }
}

export default DominioController;