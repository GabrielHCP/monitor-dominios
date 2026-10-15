# Monitor de Domínios

API em Node.js que monitora a saúde do e-mail de domínios cadastrados, verificando periodicamente os registros **SPF**, **DKIM**, **DMARC** e **MX**, e alertando quando algo quebra.

> Projeto de estudo para praticar os fundamentos de Node.js e Express.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- node-cron (verificações agendadas)
- `node:dns/promises` (consultas DNS)
- Front-end em HTML/CSS + jQuery

## Como rodar

```bash
npm install
cp .env.example .env   # preencha PORT e MONGO_URI
npm run dev
```

## Estrutura

```
src/
├── app.js          → monta o app Express
├── server.js       → sobe a API
├── config/         → conexão com o MongoDB
├── models/
├── controllers/
├── routes/
└── services/       → checagens DNS e alertas
```

## Rotas

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/dominios` | Cadastra um domínio |
| `GET` | `/dominios` | Lista os domínios |
| `GET` | `/dominios/:id` | Status atual de um domínio |
| `GET` | `/dominios/:id/checagens` | Histórico de verificações |

## Status

🚧 Em desenvolvimento.
