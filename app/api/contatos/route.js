import pool from "../../../lib/mysql.js";
import { CAMPOS, prepararContato, respostaDeErro } from "../../../lib/contatos.js";
import { exigirSessao } from "../../../lib/sessao.js";
import { erroInterno } from "../../../lib/erro-interno.js";

/*
  Endereço: /api/contatos

  GET  -> devolve a lista de contatos, do mais recente para o mais antigo.
  POST -> cadastra um contato novo e devolve ele já com o id do banco.

  As regras do contato ficam em lib/contatos.js, compartilhadas com a
  alteração (o PUT, em /api/contatos/[id]).
*/

export async function GET(requisicao) {
  const barrado = await exigirSessao(requisicao);
  if (barrado) return barrado;

  try {
    const [contatos] = await pool.query(
      `SELECT ${CAMPOS}
         FROM contatocrm
        ORDER BY data_cadastro DESC, id DESC`
    );
    return Response.json(contatos);
  } catch (erro) {
    return erroInterno(erro);
  }
}

export async function POST(requisicao) {
  const barrado = await exigirSessao(requisicao);
  if (barrado) return barrado;

  try {
    // Corpo que não é JSON vira null, e prepararContato responde "Dados inválidos".
    const dados = await requisicao.json().catch(() => null);

    const { erro, valores } = prepararContato(dados);
    if (erro) {
      return Response.json({ erro }, { status: 400 });
    }

    /*
      Os `?` são o jeito seguro de montar a consulta: o texto digitado
      pelo usuário nunca é colado dentro do SQL, vai separado como valor.
      `data_cadastro` não aparece: quem preenche é o banco.
    */
    const [resultado] = await pool.execute(
      `INSERT INTO contatocrm (nome, email, telefone, etapa, anotacoes)
       VALUES (?, ?, ?, ?, ?)`,
      valores
    );

    // Relê o contato recém-criado para devolver o id e a data do banco.
    const [linhas] = await pool.execute(
      `SELECT ${CAMPOS} FROM contatocrm WHERE id = ?`,
      [resultado.insertId]
    );

    return Response.json(linhas[0], { status: 201 });
  } catch (erro) {
    return respostaDeErro(erro);
  }
}
