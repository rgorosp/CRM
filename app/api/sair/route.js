import { cookieDeSaida } from "../../../lib/sessao.js";

/*
  Endereço: /api/sair

  POST -> apaga o cookie da sessão. Não precisa de sessão válida para
          funcionar: sair de onde você já não está é o mesmo resultado.
*/
export async function POST() {
  const resposta = Response.json({ saiu: true });
  resposta.headers.set("Set-Cookie", cookieDeSaida());
  return resposta;
}
