import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/*
  Guardar e conferir a senha do administrador.

  A senha NUNCA é guardada como você a digita. O que fica no .env é o
  resultado de uma conta que só anda para frente: dá para transformar a
  senha no resumo, mas não dá para voltar do resumo até a senha.

  Usamos `scrypt`, que já vem no Node — nenhuma biblioteca nova. Ele é
  lento de propósito: quem roubar o arquivo não consegue testar milhões
  de senhas por segundo.

  Cada senha recebe um "sal" — um punhado de bytes aleatórios misturado
  antes da conta. É por isso que duas pessoas com a mesma senha teriam
  resumos diferentes, e por isso listas prontas de senhas quebradas não
  servem de nada aqui.

  O que fica guardado tem este formato:  sal:resumo  (os dois em hexadecimal)
*/

const TAMANHO_DO_RESUMO = 64;

export function embaralharSenha(senha) {
  const sal = randomBytes(16).toString("hex");
  const resumo = scryptSync(senha.normalize(), sal, TAMANHO_DO_RESUMO);
  return `${sal}:${resumo.toString("hex")}`;
}

export function senhaConfere(senha, guardado) {
  const [sal, resumo] = String(guardado ?? "").split(":");
  if (!sal || !resumo) return false;

  const tentativa = scryptSync(String(senha).normalize(), sal, TAMANHO_DO_RESUMO);
  const esperado = Buffer.from(resumo, "hex");
  if (esperado.length !== tentativa.length) return false;

  /*
    `timingSafeEqual` compara os dois resumos sempre no mesmo tempo. Uma
    comparação comum para no primeiro byte diferente, e essa diferença de
    tempo, medida muitas vezes, entrega o conteúdo aos poucos.
  */
  return timingSafeEqual(tentativa, esperado);
}
