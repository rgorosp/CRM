"use client";

/*
  Botão Sair. Apaga o cookie da sessão no servidor e volta para o login.
  Fica em um arquivo próprio porque aparece em mais de uma tela.
*/
export function BotaoSair() {
  async function sair() {
    try {
      await fetch("/api/sair", { method: "POST" });
    } finally {
      // Recarga completa: a portaria confere de novo e manda para o login.
      window.location.href = "/login";
    }
  }

  return (
    <button className="botao-linha" type="button" onClick={sair}>
      Sair
    </button>
  );
}
