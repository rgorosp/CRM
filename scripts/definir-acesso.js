import { createInterface } from "node:readline";
import { randomBytes } from "node:crypto";
import { embaralharSenha } from "../lib/senha.js";

/*
  Gera as três linhas de acesso do CRM para você colar no arquivo .env.

  Rode com:  npm run acesso

  A senha que você digitar NÃO fica guardada em lugar nenhum: o script
  calcula o resumo (o embaralhamento) e esquece a senha ao terminar.
  Nada do que aparece na tela é a senha em si.
*/

/*
  Um leitor só para todas as perguntas. Abrir um por pergunta faz o
  segundo encontrar a entrada já consumida pelo primeiro.
*/
const leitor = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

// Quando `ocultando` está ligado, o leitor para de repetir na tela o que
// é digitado — é assim que a senha não aparece.
let ocultando = false;
const escreverNaTela = leitor._writeToOutput.bind(leitor);
leitor._writeToOutput = (texto) => {
  if (!ocultando) escreverNaTela(texto);
};

/*
  As linhas digitadas entram nesta fila. Ficar ouvindo `line` em vez de
  usar `question` uma vez por pergunta faz o script funcionar tanto
  digitando no teclado quanto com a entrada vinda pronta de fora.
*/
const linhasNaFila = [];
const esperando = [];

leitor.on("line", (linha) => {
  const pendente = esperando.shift();
  if (pendente) pendente(linha);
  else linhasNaFila.push(linha);
});

function lerLinha() {
  if (linhasNaFila.length > 0) return Promise.resolve(linhasNaFila.shift());
  return new Promise((responder) => esperando.push(responder));
}

async function perguntar(rotulo) {
  process.stdout.write(rotulo);
  const resposta = await lerLinha();
  return resposta.trim();
}

async function perguntarSenha(rotulo) {
  process.stdout.write(rotulo);
  ocultando = true;
  const resposta = await lerLinha();
  ocultando = false;
  process.stdout.write("\n");
  return resposta;
}

function sair(mensagem) {
  console.error(`\n${mensagem}`);
  leitor.close();
  process.exit(1);
}

const usuario = await perguntar("Usuário (o nome que você vai digitar no login): ");
if (usuario === "") {
  sair("O usuário não pode ficar em branco. Rode de novo.");
}

const senha = await perguntarSenha("Senha (não aparece enquanto você digita): ");
if (senha.length < 8) {
  sair("A senha precisa ter pelo menos 8 caracteres. Rode de novo.");
}

const confirmacao = await perguntarSenha("Repita a senha: ");
if (senha !== confirmacao) {
  sair("As duas senhas não são iguais. Rode de novo.");
}

leitor.close();

console.log("\n================================================================");
console.log(" Cole estas três linhas no fim do arquivo .env:");
console.log("================================================================\n");
console.log(`CRM_USUARIO=${usuario}`);
console.log(`CRM_SENHA_HASH=${embaralharSenha(senha)}`);
console.log(`CRM_SEGREDO=${randomBytes(32).toString("hex")}`);
console.log("\n----------------------------------------------------------------");
console.log(" CRM_SENHA_HASH não é a sua senha: é o resultado de uma conta que");
console.log(" só anda para frente. Não dá para voltar dele até a senha.");
console.log("");
console.log(" CRM_SEGREDO é o que assina o cookie da sessão. Se o .env já tiver");
console.log(" um, mantenha o que está lá — trocar desconecta quem estiver dentro.");
console.log("");
console.log(" Depois de colar, pare o servidor (Ctrl+C) e rode npm run dev de");
console.log(" novo, para ele ler o arquivo atualizado.");
console.log("----------------------------------------------------------------\n");
