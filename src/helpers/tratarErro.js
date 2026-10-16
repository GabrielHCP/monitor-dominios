function tratarErro(err, res) {
  if (err.name === "ValidationError") {
    const mensagens = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({message: "Dados inválidos", erros: mensagens});
  }

  if (err.name === "CastError") {
    return res.status(400).json({message: `Valor inválido para o campo ${err.path}`});
  }

  if (err.code === 11000) {
    return res.status(409).json({message: "Domínio já cadastrado" });
  }

  return res.status(500).json({message: "Erro interno do servidor"});
}

export default tratarErro;