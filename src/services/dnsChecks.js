import { resolveTxt, resolveMx } from "node:dns/promises";
import { pathToFileURL } from "node:url";

// Códigos que significam "o registro não existe" (não é falha do sistema)
const CODIGOS_AUSENTE = ["ENOTFOUND", "ENODATA"];

// Busca os registros TXT de um host e junta os pedaços de cada registro.
// Se o registro não existir, devolve lista vazia em vez de lançar erro.
async function buscarTxt(host) {
    try {
        const registros = await resolveTxt(host);
        return registros.map((pedacos) => pedacos.join(""));
    } catch (err) {
        if (CODIGOS_AUSENTE.includes(err.code)) {
            return [];
        }
        throw err;
    }
}

export async function verificarSPF(dominio) {
    const textos = await buscarTxt(dominio);
    const spf = textos.filter((texto) => texto.startsWith("v=spf1"));

    if (spf.length === 0) {
        return { status: "ausente", detalhes: "Nenhum registro SPF encontrado" };
    }
    if (spf.length > 1) {
        return { status: "falha", detalhes: `Mais de um registro SPF: ${spf.join(" | ")}` };
    }
    return { status: "ok", detalhes: spf[0] };
}

export async function verificarDMARC(dominio) {
    const textos = await buscarTxt(`_dmarc.${dominio}`);
    const dmarc = textos.filter((texto) => texto.startsWith("v=DMARC1"));

    if (dmarc.length === 0) {
        return { status: "ausente", detalhes: "Nenhum registro DMARC encontrado" };
    }
    if (dmarc.length > 1) {
        return { status: "falha", detalhes: `Mais de um registro DMARC: ${dmarc.join(" | ")}` };
    }

    // p=none só monitora: e-mails falsificados continuam sendo entregues
    const politica = dmarc[0].match(/(?:^|;)\s*p=(\w+)/i)?.[1]?.toLowerCase();
    if (politica === "none") {
        return { status: "alerta", detalhes: `Política p=none (apenas monitora): ${dmarc[0]}` };
    }
    return { status: "ok", detalhes: dmarc[0] };
}

export async function verificarDKIM(dominio, seletor = "default") {
    const host = `${seletor}._domainkey.${dominio}`;
    const textos = await buscarTxt(host);
    const dkim = textos.find((texto) => texto.includes("p="));

    if (!dkim) {
        return { status: "ausente", detalhes: `Nenhum registro DKIM em ${host}` };
    }

    // p= vazio significa chave revogada
    const chave = dkim.match(/p=([^;]*)/)[1].trim();
    if (chave === "") {
        return { status: "falha", detalhes: `Chave DKIM revogada em ${host}` };
    }
    return { status: "ok", detalhes: dkim };
}

export async function verificarMX(dominio) {
    let registros;
    try {
        registros = await resolveMx(dominio);
    } catch (err) {
        if (CODIGOS_AUSENTE.includes(err.code)) {
            return { status: "ausente", detalhes: "Nenhum registro MX encontrado" };
        }
        throw err;
    }

    if (registros.length === 0) {
        return { status: "ausente", detalhes: "Nenhum registro MX encontrado" };
    }

    // "Null MX" (RFC 7505): o domínio declara que não recebe e-mail
    if (registros.length === 1 && registros[0].exchange === "") {
        return { status: "falha", detalhes: "Null MX: o domínio declara que não recebe e-mail" };
    }

    // Menor prioridade = servidor preferido
    const servidores = registros
        .sort((a, b) => a.priority - b.priority)
        .map((mx) => `${mx.priority} ${mx.exchange}`);

    return { status: "ok", detalhes: servidores.join(", ") };
}

// Pior status entre as checagens define o status geral
function calcularGeral(resultados) {
    const status = Object.values(resultados).map((r) => r.status);

    if (status.includes("falha") || status.includes("ausente")) return "falha";
    if (status.includes("alerta") || status.includes("erro")) return "alerta";
    return "ok";
}

export async function verificarDominio(dominio, seletorDKIM = "default") {
    const nomes = ["spf", "dkim", "dmarc", "mx"];

    // As 4 consultas são independentes: rodam em paralelo
    const respostas = await Promise.allSettled([
        verificarSPF(dominio),
        verificarDKIM(dominio, seletorDKIM),
        verificarDMARC(dominio),
        verificarMX(dominio),
    ]);

    const resultados = {};
    respostas.forEach((resposta, i) => {
        resultados[nomes[i]] = resposta.status === "fulfilled"
            ? resposta.value
            : { status: "erro", detalhes: resposta.reason.message };
    });

    return { ...resultados, geral: calcularGeral(resultados) };
}

// Permite testar pelo terminal: node src/services/dnsChecks.js gmail.com [seletor]
// Só roda quando o arquivo é executado direto, não quando é importado
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const [dominio, seletor] = process.argv.slice(2);

    if (!dominio) {
        console.error("Uso: node src/services/dnsChecks.js <dominio> [seletorDKIM]");
        process.exit(1);
    }

    console.log(await verificarDominio(dominio, seletor));
}
