/*
  Formatação de telefone brasileiro.

  Uma função só, usada nos dois lados:
  - na tela, a cada tecla digitada (você vê o número se formatando);
  - no servidor, antes de gravar (o banco nunca recebe formato torto,
    mesmo que alguém chame a API por fora da tela).

  Entra 11981407667  ->  sai (11) 98140-7667
  Entra 1130114455   ->  sai (11) 3011-4455
*/
export function formatarTelefone(valor) {
  const texto = (valor ?? "").trim();
  const digitos = texto.replace(/\D/g, "");

  // Mais de 11 números não é telefone brasileiro comum (pode ter código do
  // país ou ramal). Nesse caso devolve como foi digitado, sem inventar
  // formatação e sem perder nenhum número.
  if (digitos.length > 11) return texto;

  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return `(${digitos}`;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;

  // Fixo: 10 números -> (11) 3011-4455
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }

  // Celular: 11 números -> (11) 98140-7667
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}
