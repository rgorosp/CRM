import pool from "../../../lib/mysql.js";
import { ETAPAS } from "../../../lib/contatos.js";
import { exigirSessao } from "../../../lib/sessao.js";
import { erroInterno } from "../../../lib/erro-interno.js";

/*
  Endereço: /api/painel

  GET -> quantos contatos há no total e em cada etapa do funil.

  Quem conta é o banco (GROUP BY), usando o índice da coluna `etapa`
  criado no Passo 5. A tela recebe só cinco números, e não a lista
  inteira de contatos para contar sozinha.
*/
export async function GET(requisicao) {
  const barrado = await exigirSessao(requisicao);
  if (barrado) return barrado;

  try {
    const [linhas] = await pool.query(
      `SELECT etapa, COUNT(*) AS quantidade
         FROM contatocrm
        GROUP BY etapa`
    );

    // Etapa sem nenhum contato não aparece no GROUP BY: começa em zero.
    const etapas = Object.fromEntries(ETAPAS.map((etapa) => [etapa, 0]));
    for (const linha of linhas) {
      etapas[linha.etapa] = Number(linha.quantidade);
    }

    const total = ETAPAS.reduce((soma, etapa) => soma + etapas[etapa], 0);

    return Response.json({ total, etapas });
  } catch (erro) {
    return erroInterno(erro);
  }
}
