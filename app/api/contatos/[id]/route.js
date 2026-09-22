import pool from "../../../../lib/mysql.js";
import {
  CAMPOS,
  prepararContato,
  respostaDeErro,
} from "../../../../lib/contatos.js";
import { exigirSessao } from "../../../../lib/sessao.js";
import { erroInterno } from "../../../../lib/erro-interno.js";

/*
  Endereço: /api/contatos/5  (o número é o id do contato)

  PUT    -> altera os dados daquele contato.
  DELETE -> apaga o contato daquele id.
*/

// O id vem do endereço, como texto. Aqui vira número e é conferido.
function lerId(id) {
  const numero = Number(id);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

export async function PUT(requisicao, { params }) {
  const barrado = await exigirSessao(requisicao);
  if (barrado) return barrado;

  try {
    const { id } = await params;
    const numero = lerId(id);
    if (numero === null) {
      return Response.json({ erro: "Id inválido." }, { status: 400 });
    }

    // Corpo que não é JSON vira null, e prepararContato responde "Dados inválidos".
    const dados = await requisicao.json().catch(() => null);

    // As mesmas regras do cadastro — vêm do mesmo arquivo.
    const { erro, valores } = prepararContato(dados);
    if (erro) {
      return Response.json({ erro }, { status: 400 });
    }

    /*
      `data_cadastro` fica de fora de propósito: a data em que o contato
      entrou não muda quando ele é corrigido.
    */
    const [resultado] = await pool.execute(
      `UPDATE contatocrm
          SET nome = ?, email = ?, telefone = ?, etapa = ?, anotacoes = ?
        WHERE id = ?`,
      [...valores, numero]
    );

    if (resultado.affectedRows === 0) {
      return Response.json(
        { erro: `Nenhum contato com o id ${numero}.` },
        { status: 404 }
      );
    }

    // Devolve o contato como ficou no banco, para a tela mostrar o resultado real.
    const [linhas] = await pool.execute(
      `SELECT ${CAMPOS} FROM contatocrm WHERE id = ?`,
      [numero]
    );

    return Response.json(linhas[0]);
  } catch (erro) {
    return respostaDeErro(erro);
  }
}

export async function DELETE(requisicao, { params }) {
  const barrado = await exigirSessao(requisicao);
  if (barrado) return barrado;

  try {
    const { id } = await params;
    const numero = lerId(id);
    if (numero === null) {
      return Response.json({ erro: "Id inválido." }, { status: 400 });
    }

    const [resultado] = await pool.execute(
      "DELETE FROM contatocrm WHERE id = ?",
      [numero]
    );

    // Nenhuma linha apagada = esse id não existe (ou já foi apagado).
    if (resultado.affectedRows === 0) {
      return Response.json(
        { erro: `Nenhum contato com o id ${numero}.` },
        { status: 404 }
      );
    }

    return Response.json({ excluido: numero });
  } catch (erro) {
    return erroInterno(erro);
  }
}
