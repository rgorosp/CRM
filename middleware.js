import { NextResponse } from "next/server";
import { NOME_DO_COOKIE, lerSessao } from "./lib/sessao.js";

/*
  A portaria do CRM.

  Este arquivo roda ANTES de qualquer tela e de qualquer rota de dados.
  Sem sessão válida, nada passa: nem a lista de contatos, nem a página
  inicial, nem a API.

  O que fica de fora: os arquivos internos do Next.js (veja `config`, no
  fim) e as três portas abertas abaixo — a tela de login, a rota que faz o
  login e a rota que faz o logout. Se a tela de login também fosse barrada,
  ninguém conseguiria entrar nunca.
*/

/*
  As portas abertas são comparadas pelo endereço EXATO. Se a comparação
  fosse pelo começo do nome, uma tela futura chamada, por exemplo,
  "/login-historico" nasceria aberta sem ninguém perceber.
*/
const PORTAS_ABERTAS = ["/login", "/api/entrar", "/api/sair"];

export async function middleware(requisicao) {
  if (PORTAS_ABERTAS.includes(requisicao.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const cookie = requisicao.cookies.get(NOME_DO_COOKIE)?.value;
  const usuario = await lerSessao(cookie);

  if (usuario) return NextResponse.next();

  /*
    Sem sessão. A resposta muda conforme quem perguntou:

    - a API responde 401 em JSON, porque quem chama é a tela, por
      trás dos panos, e ela precisa de uma resposta que saiba ler;
    - uma tela é mandada para o login.
  */
  if (requisicao.nextUrl.pathname.startsWith("/api")) {
    return Response.json(
      { erro: "Faça login para continuar." },
      { status: 401 }
    );
  }

  return NextResponse.redirect(new URL("/login", requisicao.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
