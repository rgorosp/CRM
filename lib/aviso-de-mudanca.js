/*
  Recado entre abas do navegador.

  Quando a tela de contatos grava alguma coisa, ela avisa por aqui. O
  painel da página inicial, se estiver aberto em outra aba ou janela do
  mesmo navegador, ouve o recado e busca os números de novo na hora.

  BroadcastChannel é um canal de recados que o próprio navegador oferece
  entre abas do mesmo site. Nada passa pelo servidor.
*/

const CANAL = "crm-contatos";

// Usado por quem grava: "os contatos mudaram".
export function avisarMudanca() {
  const canal = new BroadcastChannel(CANAL);
  canal.postMessage("mudou");
  canal.close();
}

// Usado por quem mostra números. Devolve a função que para de ouvir.
export function ouvirMudancas(aoMudar) {
  const canal = new BroadcastChannel(CANAL);
  canal.onmessage = () => aoMudar();
  return () => canal.close();
}
