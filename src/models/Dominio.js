import mongoose from "mongoose";

const dominioSchema = new mongoose.Schema({
    nome: { type: String, required: true, unique: true, trim: true, lowercase: true },
    dono: { type: String, required: true, trim: true },
    seletorDKIM: { type: String, default: "default" },
    ativo: { type: Boolean, default: true}
},
{
    versionKey: false,
    timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" }
}
);

const Dominio = mongoose.model("Dominio", dominioSchema);

export default Dominio;