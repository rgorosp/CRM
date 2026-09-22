/*
  Resposta para erro inesperado: banco fora do ar, falha no programa...

  O detalhe técnico (nome de coluna, endereço do banco, trecho de código)
  vai só para o terminal onde o servidor roda, para quem cuida do sistema.
  Quem está na tela recebe uma frase curta, sem nada que ajude um invasor
  a entender como o sistema é feito por dentro.
*/
export function erroInterno(erro) {
  console.error("[CRM] Erro interno:", erro);
  return Response.json(
    { erro: "Não foi possível concluir agora. Tente de novo em instantes." },
    { status: 500 }
  );
}
