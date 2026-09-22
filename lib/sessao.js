/*
  A sessão: como o CRM sabe que você já entrou.

  Depois do login, o servidor entrega um cookie com duas partes separadas
  por ponto:

      conteúdo . assinatura

  O conteúdo diz quem é o usuário e até quando vale. A assinatura é feita
  com o segredo do .env (`CRM_SEGREDO`): qualquer letra que mude no
  conteúdo faz a conferência falhar. Ou seja, o cookie pode ser lido, mas
  não pode ser forjado sem o segredo.

  Este arquivo usa só o `crypto` do navegador/plataforma (Web Crypto),
  porque ele também roda no middleware — a portaria que fica antes de
  todas as telas e que não tem o Node inteiro disponível.
*/

export const NOME_DO_COOKIE = "crm_sessao";

// Quanto tempo a sessão dura: 8 horas, um dia de trabalho.
export const DURACAO_EM_SEGUNDOS = 8 * 60 * 60;

function paraBase64Url(bytes) {
  let binario = "";
  for (const byte of bytes) binario += String.fromCharCode(byte);
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function deBase64Url(texto) {
  const base64 = texto.replace(/-/g, "+").replace(/_/g, "/");
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return bytes;
}

async function chaveDeAssinatura() {
  const segredo = process.env.CRM_SEGREDO;
  if (!segredo) return null;

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(segredo),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Monta o valor do cookie para quem acabou de entrar.
export async function criarSessao(usuario) {
  const chave = await chaveDeAssinatura();
  if (!chave) throw new Error("CRM_SEGREDO não está definido no .env");

  const conteudo = JSON.stringify({
    usuario,
    expira: Date.now() + DURACAO_EM_SEGUNDOS * 1000,
  });

  const corpo = paraBase64Url(new TextEncoder().encode(conteudo));
  const assinatura = await crypto.subtle.sign(
    "HMAC",
    chave,
    new TextEncoder().encode(corpo)
  );

  return `${corpo}.${paraBase64Url(new Uint8Array(assinatura))}`;
}

/*
  Confere o cookie que chegou. Devolve o usuário quando está tudo certo,
  ou null quando o cookie não existe, foi adulterado ou já venceu.
*/
export async function lerSessao(valorDoCookie) {
  if (!valorDoCookie) return null;

  const [corpo, assinatura] = valorDoCookie.split(".");
  if (!corpo || !assinatura) return null;

  try {
    const chave = await chaveDeAssinatura();
    if (!chave) return null;

    const confere = await crypto.subtle.verify(
      "HMAC",
      chave,
      deBase64Url(assinatura),
      new TextEncoder().encode(corpo)
    );
    if (!confere) return null;

    const dados = JSON.parse(new TextDecoder().decode(deBase64Url(corpo)));
    if (!dados.expira || Date.now() > dados.expira) return null;

    return dados.usuario ?? null;
  } catch {
    // Cookie estragado ou mexido: trata como quem não entrou.
    return null;
  }
}

// Acha o valor do cookie da sessão no cabeçalho "Cookie" do pedido.
function cookieDaSessao(cabecalho) {
  for (const parte of (cabecalho ?? "").split(";")) {
    const [nome, ...valor] = parte.trim().split("=");
    if (nome === NOME_DO_COOKIE) return valor.join("=");
  }
  return null;
}

/*
  Segunda tranca, dentro de cada rota de dados. A primeira é a portaria
  (middleware.js). Se um dia ela deixar de rodar — o Next 16 já marcou o
  nome "middleware" como ultrapassado —, os dados continuam trancados.

  Devolve a resposta 401 pronta quando não há sessão válida, ou null
  quando o pedido pode seguir.
*/
export async function exigirSessao(requisicao) {
  const usuario = await lerSessao(cookieDaSessao(requisicao.headers.get("cookie")));
  if (usuario) return null;

  return Response.json({ erro: "Faça login para continuar." }, { status: 401 });
}

/*
  `HttpOnly` impede que qualquer script da página leia o cookie.
  `SameSite=Lax` impede que outro site use a sua sessão por tabela.
  `Secure` só entra quando o CRM estiver publicado (em https).
*/
function atributos() {
  const seguro = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `Path=/; HttpOnly; SameSite=Lax${seguro}`;
}

export function cookieDeEntrada(valor) {
  return `${NOME_DO_COOKIE}=${valor}; ${atributos()}; Max-Age=${DURACAO_EM_SEGUNDOS}`;
}

// Cookie vazio e com validade zero: o navegador apaga na hora.
export function cookieDeSaida() {
  return `${NOME_DO_COOKIE}=; ${atributos()}; Max-Age=0`;
}
