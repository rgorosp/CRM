import pool from "../../../lib/mysql.js";
import { exigirSessao } from "../../../lib/sessao.js";

/*
  Endereço de teste: /api/testar-conexao
  Só pergunta ao banco "você está aí?". Não cria e não altera nada.
*/
export async function GET(requisicao) {
  const barrado = await exigirSessao(requisicao);
  if (barrado) return barrado;

  try {
    const [linhas] = await pool.query(
      "SELECT DATABASE() AS banco, VERSION() AS versao, NOW() AS agora"
    );

    return Response.json({
      conectado: true,
      banco: linhas[0].banco,
      versao_do_mysql: linhas[0].versao,
      hora_do_banco: linhas[0].agora,
    });
  } catch (erro) {
    // O motivo técnico (endereço, porta, usuário do banco) fica só no terminal.
    console.error("[CRM] Teste de conexão falhou:", erro);
    return Response.json(
      {
        conectado: false,
        erro: "Não foi possível conectar ao banco. O motivo está no terminal do servidor.",
      },
      { status: 500 }
    );
  }
}
