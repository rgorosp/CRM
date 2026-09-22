import { senhaConfere } from "../../../lib/senha.js";
import { criarSessao, cookieDeEntrada } from "../../../lib/sessao.js";
import { erroInterno } from "../../../lib/erro-interno.js";

/*
  Endereço: /api/entrar

  POST -> confere usuário e senha e, se estiver certo, devolve o cookie
          da sessão. É a única rota de dados que fica fora da portaria.
*/
export async function POST(requisicao) {
  try {
    const usuarioCerto = process.env.CRM_USUARIO;
    const senhaGuardada = process.env.CRM_SENHA_HASH;

    if (!usuarioCerto || !senhaGuardada || !process.env.CRM_SEGREDO) {
      // O passo a passo fica no terminal, para quem cuida do sistema.
      // A tela, aberta a qualquer visitante, só recebe o aviso.
      console.error(
        "[CRM] Acesso não configurado: rode `npm run acesso` e cole as três linhas no arquivo .env."
      );
      return Response.json(
        { erro: "O acesso ainda não foi configurado." },
        { status: 500 }
      );
    }

    // Corpo que não é JSON vira null e cai em "usuário ou senha inválidos".
    const corpo = await requisicao.json().catch(() => null);
    const usuario = corpo?.usuario;
    const senha = corpo?.senha;

    /*
      A senha é conferida SEMPRE, mesmo com o usuário errado. Se a conta
      pesada (scrypt) só rodasse para o usuário certo, a resposta demoraria
      mais nesse caso — e o tempo entregaria qual usuário existe.
    */
    const senhaBate = senhaConfere(senha ?? "", senhaGuardada);
    const usuarioBate = String(usuario ?? "").trim() === usuarioCerto;
    const confere = usuarioBate && senhaBate;

    /*
      Uma mensagem só para os dois casos, de propósito. Dizer "usuário não
      existe" contaria a quem está tentando invadir qual metade ele já
      acertou.
    */
    if (!confere) {
      return Response.json(
        { erro: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    const sessao = await criarSessao(usuarioCerto);

    const resposta = Response.json({ usuario: usuarioCerto });
    resposta.headers.set("Set-Cookie", cookieDeEntrada(sessao));
    return resposta;
  } catch (erro) {
    return erroInterno(erro);
  }
}
