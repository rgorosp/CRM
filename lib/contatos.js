import { formatarTelefone } from "./telefone.js";
import { erroInterno } from "./erro-interno.js";

/*
  As regras do contato, em um lugar só.

  Cadastrar e alterar exigem exatamente as mesmas conferências. Se cada
  rota tivesse a sua cópia, uma hora as duas iam divergir e a alteração
  aceitaria o que o cadastro recusa.
*/

// As quatro etapas aceitas pelo banco (o ENUM da coluna `etapa`).
export const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

/*
  A data já sai formatada do banco (DATE_FORMAT). Assim a tela só exibe,
  sem precisar converter fuso horário no meio do caminho.
  O apelido é `cadastrado_em` e não `data_cadastro` de propósito: o
  ORDER BY precisa usar a coluna de verdade, não o texto formatado.
*/
export const CAMPOS = `
  id, nome, email, telefone, etapa, anotacoes,
  DATE_FORMAT(data_cadastro, '%d/%m/%Y às %H:%i') AS cadastrado_em
`;

/*
  Tamanhos máximos: os mesmos das colunas da tabela
  (banco/01-criar-tabela-contatocrm.sql). Conferir aqui evita que o banco
  recuse a gravação com uma mensagem técnica.
*/
const LIMITES = { nome: 120, email: 160, telefone: 20 };

// A coluna `anotacoes` é TEXT: até 65.535 bytes. Letra acentuada ocupa
// mais de um byte, por isso a conta é em bytes e não em letras.
const LIMITE_ANOTACOES_EM_BYTES = 65535;

// Formato mínimo de e-mail: algo@dominio.algo, sem espaços.
const FORMATO_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Telefone: só números, espaços e os sinais ( ) + - .
const FORMATO_DE_TELEFONE = /^[0-9()+.\-\s]+$/;

// Campo em branco vira NULL no banco, não string vazia.
function nuloSeVazio(valor) {
  const texto = (valor ?? "").trim();
  return texto === "" ? null : texto;
}

/*
  Confere o que veio da tela e devolve os valores prontos para o banco.

  Devolve `{ erro: "..." }` quando alguma regra foi quebrada, ou
  `{ valores: [...] }` na ordem nome, email, telefone, etapa, anotacoes.
*/
export function prepararContato(dados) {
  // O pedido precisa trazer um objeto com os campos — não uma lista,
  // um número ou nada (é o que chega quando o corpo não é JSON).
  if (dados === null || typeof dados !== "object" || Array.isArray(dados)) {
    return { erro: "Dados inválidos." };
  }

  // Todo campo, quando vem, precisa ser texto.
  for (const campo of ["nome", "email", "telefone", "etapa", "anotacoes"]) {
    const valor = dados[campo];
    if (valor !== undefined && valor !== null && typeof valor !== "string") {
      return { erro: `O campo ${campo} está em formato inválido.` };
    }
  }

  // Sem nome não existe contato.
  const nome = (dados.nome ?? "").trim();
  if (nome === "") {
    return { erro: "O nome é obrigatório." };
  }
  if (nome.length > LIMITES.nome) {
    return { erro: `O nome pode ter no máximo ${LIMITES.nome} caracteres.` };
  }

  const email = nuloSeVazio(dados.email);
  if (email !== null) {
    if (email.length > LIMITES.email) {
      return { erro: `O e-mail pode ter no máximo ${LIMITES.email} caracteres.` };
    }
    if (!FORMATO_DE_EMAIL.test(email)) {
      return { erro: "O e-mail não parece válido. Use o formato nome@empresa.com." };
    }
  }

  // O telefone é padronizado aqui, e não só na tela: a API pode ser
  // chamada por fora dela, e o banco deve ficar uniforme.
  const telefone = nuloSeVazio(formatarTelefone(dados.telefone));
  if (telefone !== null) {
    if (!FORMATO_DE_TELEFONE.test(telefone)) {
      return { erro: "O telefone só pode ter números e os sinais ( ) + - ." };
    }
    // Menos que DDD + número não é um meio de contato de verdade.
    if (telefone.replace(/\D/g, "").length < 10) {
      return { erro: "O telefone precisa ter DDD e número: pelo menos 10 números." };
    }
    if (telefone.length > LIMITES.telefone) {
      return { erro: `O telefone pode ter no máximo ${LIMITES.telefone} caracteres.` };
    }
  }

  /*
    Um contato sem e-mail e sem telefone é um nome solto, com quem não dá
    para falar. Quem recusa isso de verdade é o banco (a regra
    `ck_contatocrm_meio_de_contato`); a conferência aqui existe só para a
    mensagem sair em português claro em vez de erro técnico.
  */
  if (email === null && telefone === null) {
    return { erro: "Informe pelo menos um meio de contato: e-mail ou telefone." };
  }

  // Etapa em branco vira "novo". Etapa inventada é recusada, em vez de
  // virar "novo" calada e apagar a etapa que o contato tinha.
  const etapa = dados.etapa ?? "";
  if (etapa !== "" && !ETAPAS.includes(etapa)) {
    return { erro: "Etapa inválida." };
  }

  const anotacoes = nuloSeVazio(dados.anotacoes);
  if (anotacoes !== null && new TextEncoder().encode(anotacoes).length > LIMITE_ANOTACOES_EM_BYTES) {
    return { erro: "As anotações passaram do tamanho máximo. Resuma o texto." };
  }

  return { valores: [nome, email, telefone, etapa || "novo", anotacoes] };
}

/*
  Quando o banco recusa a gravação, ele devolve um código. Traduzimos os
  dois que o usuário pode provocar; o resto vira a frase genérica de erro
  interno, com o detalhe só no terminal do servidor.
*/
export function respostaDeErro(erro) {
  if (erro.code === "ER_DUP_ENTRY") {
    return Response.json(
      { erro: "Já existe um contato cadastrado com esse e-mail." },
      { status: 409 }
    );
  }

  if (erro.code === "ER_CHECK_CONSTRAINT_VIOLATED") {
    return Response.json(
      { erro: "Informe pelo menos um meio de contato: e-mail ou telefone." },
      { status: 400 }
    );
  }

  return erroInterno(erro);
}
