---
name: crm
description: Registro vivo do projeto CRM — decisões, passos executados e como testar cada um. Consultar antes de mexer no projeto para saber onde paramos.
---

# Projeto CRM — Registro de Passos

Este arquivo é a **memória escrita do projeto**. Tudo que fizermos entra aqui, em ordem.
Se alguém (ou o Claude, numa sessão futura) abrir só este arquivo, tem que conseguir
entender o que o projeto é, onde paramos e o que vem a seguir.

---

## Como usar este arquivo

**Regra 1 — Toda ação vira um passo.** Criou arquivo, instalou dependência, tomou uma
decisão de arquitetura? Vira um passo numerado abaixo.

**Regra 2 — Todo passo tem 4 partes:**
| Parte | O que responde |
|---|---|
| **O quê** | O que foi feito, em uma frase |
| **Por quê** | A razão da escolha |
| **Arquivos** | O que foi criado ou alterado |
| **Como testar** | Um comando ou passo concreto pra verificar |

**Regra 3 — Nada de reescrever o passado.** Se uma decisão mudar, não apaga o passo
antigo: cria um passo novo explicando a mudança e o motivo. O histórico de erros
ensina mais que o resultado limpo.

**Regra 4 — O passo entra depois de funcionar**, não antes. Ideia ainda não executada
vai para a seção "Próximos passos", lá no fim.

---

## O que é este projeto

> **A preencher.** Descrever aqui, em 3 ou 4 linhas: para quem é o CRM, que problema
> resolve e o que ele precisa fazer no mínimo para ser útil.

---

## Decisões técnicas

Tabela de referência rápida. Preenchemos conforme decidimos — não antes.

| Área | Decisão | Quando | Passo |
|---|---|---|---|
| Linguagem / stack | Next.js (React + servidor no mesmo projeto) | 2026-09-07 | Passo 2 |
| Banco de dados | MySQL 8.0.28 local, database `projeto` | 2026-09-07 | Passo 4 |
| Interface (frontend) | Next.js (mesmas telas do projeto) | 2026-09-07 | Passo 2 |
| Versionamento (Git) | Git, branch `main`, no GitHub em `rgorosp/CRM` | 2026-09-21 | Passo 14 |
| Acesso (login) | Usuário único no `.env`, senha em hash `scrypt`, sessão por cookie assinado | 2026-09-13 | Passo 10 |
| Onde vai rodar | Local na porta 3100 (3000 está ocupada) | 2026-09-07 | Passo 3 |

---

## Passos executados

### Passo 0 — Ponto de partida e combinado de trabalho
**Data:** 2026-09-07

**O quê**
Inspeção da pasta do projeto e definição de como vamos trabalhar juntos.

**Por quê**
Antes de escrever qualquer linha de código, era preciso saber o terreno: o que já
existe, o que está instalado na máquina e quais são as regras do jogo. Começar a
codar sem isso é o jeito mais rápido de precisar refazer tudo depois.

**O que foi encontrado**
- Pasta `CRM` completamente vazia — nenhum arquivo, nem oculto.
- **Não** é um repositório Git ainda.
- Fica dentro do OneDrive (sincronização automática ligada).
- Instalado na máquina: Node.js 22, npm 10, Python 3.13 (só responde por `py`,
  não por `python`), Docker 29, Git 2.54.

**Combinado de trabalho**
Toda entrega do Claude explica: o que foi feito, por que foi feito assim, e termina
com **como testar**. Em português direto, sem jargão desnecessário.

**Pontos de atenção levantados (ainda não resolvidos)**
1. A pasta está no OneDrive. Quando surgir `node_modules` (milhares de arquivos),
   a sincronização tende a ficar lenta ou travar. Tem solução simples, mas precisa
   ser feita na hora certa.
2. Sem Git, não há como desfazer erros com segurança. Recomendado iniciar cedo.

**Arquivos**
Nenhum.

**Como testar**
```bash
ls -la "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM"
```
Na época deste passo, a saída mostrava só `.` e `..` (pasta vazia).

---

### Passo 1 — Criação do registro de passos
**Data:** 2026-09-07

**O quê**
Criado este arquivo, `skill.md`, na raiz do projeto.

**Por quê**
Conversa se perde; arquivo fica. Registrar cada passo com o motivo da decisão serve
para três coisas: (1) você revisar depois sem depender da memória, (2) retomar o
projeto dias depois sem se perder, e (3) qualquer sessão futura do Claude ler este
arquivo e entender o contexto na hora, em vez de recomeçar do zero.

O arquivo começa com um cabeçalho entre `---` (nome e descrição). É um detalhe de
formato: caso mais adiante a gente queira transformar este registro em uma habilidade
reutilizável do Claude Code, ele já está no padrão certo — sem atrapalhar em nada
enquanto for só documentação.

**Arquivos**
- `skill.md` — criado.

**Como testar**
```bash
cat "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM/skill.md"
```
Deve exibir este documento, com as seções "Como usar este arquivo", "Decisões
técnicas" e "Passos executados".

---

### Passo 2 — Documentação do produto e regras de trabalho
**Data:** 2026-09-07

**O quê**
Criados dois arquivos: `prd.md` (o que o produto é e o que entra na v1) e `CLAUDE.md`
(as regras que o Claude segue em toda sessão).

**Por quê**
Documentar antes de codar. O `prd.md` fixa o escopo por escrito, para que a v1 termine
em vez de crescer para sempre — por isso ele tem uma lista explícita do que **não**
entra. O `CLAUDE.md` tem esse nome porque é o arquivo que o Claude Code carrega
sozinho no início de cada sessão: as regras passam a valer sem ninguém precisar
lembrar de colá-las.

**Decisões tomadas**
- Stack: **Next.js** — telas e servidor no mesmo projeto.
- Escopo da v1: 7 funcionalidades listadas no `prd.md`.
- 12 itens colocados explicitamente fora da v1.
- Segredos nunca no código: ficam em arquivo de variáveis de ambiente.

**Arquivos**
- `prd.md` — criado.
- `CLAUDE.md` — criado.
- `skill.md` — atualizado (tabela de decisões + este passo).

**Pendência aberta**
O `CLAUDE.md` cita o `design.md` como fonte da verdade, mas ele ainda não existe.
É o próximo documento: a parte do **como** (telas, banco de dados, estrutura).

**Como testar**
```bash
cd "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM" && ls -la *.md
```
Devem aparecer quatro arquivos: `CLAUDE.md`, `prd.md`, `skill.md` e — mais adiante —
`design.md`.

---

### Passo 3 — Identidade visual e base do projeto no ar
**Data:** 2026-09-07

**O quê**
Criado o `design.md` (identidade visual) e montada a base do Next.js: a página inicial
"Meu CRM" já abre no navegador com a cara definida no design.

**Por quê**
Definir a identidade **antes** da primeira tela evita a dívida mais cara de todas:
padronizar depois, tela por tela. Com as cores e medidas em variáveis num arquivo só,
mudar a identidade inteira é mudar um arquivo.

A base foi montada à mão (4 arquivos) em vez de usar o gerador `create-next-app`,
seguindo a Regra 2 (simplicidade): o gerador traz configurações que não foram pedidas.

**Decisões tomadas**
- **Porta 3100**, não a 3000: a 3000 já está ocupada por um processo Java
  (Semeru/IBM) que roda nesta máquina. A porta ficou fixa no script `dev`.
- Fonte Manrope carregada pelo próprio Next.js (`next/font/google`), que baixa e
  serve a fonte junto com o site.
- Sem TypeScript, sem Tailwind, sem ESLint por enquanto — nada disso foi pedido.
- Versões: Next.js 16.3.4, React 19.2.8.

**Arquivos**
- `design.md` — criado (identidade visual).
- `package.json` — criado (scripts e dependências).
- `app/globals.css` — criado (variáveis da identidade + estilo da página).
- `app/layout.js` — criado (moldura do site e fonte).
- `app/page.js` — criado (página inicial).
- `.claude/launch.json` — criado (atalho para o Claude subir o servidor).
- `node_modules/` — instalada pelo npm (não versionar).
- `skill.md` — atualizado.

**Verificação feita**
Página conferida no navegador com os valores reais aplicados, não só no olho:
fundo `#FAFAF7`, cartão `#FFFFFF` com borda de 1px `#E6E4DE`, canto `10px`, sombra
`none`, texto `#17181C`, apoio `#6B6E76`, destaque `#1D4ED8`, fonte Manrope peso 800
no título. Todos batem com o `design.md`.

**Pendências abertas**
1. `node_modules` está dentro do OneDrive — sincronização pode ficar lenta.
2. Ainda não há Git nem `.gitignore`.

**Como testar**
```bash
cd "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM" && npm run dev
```
Abrir `http://localhost:3100`. Deve aparecer o título "Meu CRM" em fundo claro
levemente quente, dentro de um cartão branco com borda fina.

---

### Passo 4 — Conexão com o MySQL
**Data:** 2026-09-07

**O quê**
O projeto agora conversa com o MySQL local. Nenhuma tabela foi criada.

**Por quê**
Conectar antes de modelar dados: assim, quando a primeira tabela for criada, o
caminho até o banco já está testado e um eventual erro é de modelagem, não de
conexão.

Os dados de acesso ficam no `.env` e o código só lê de lá (Regra 5 do `CLAUDE.md`).
Nenhuma senha aparece em arquivo de código.

**Decisões tomadas**
- Biblioteca `mysql2` — a mais usada para MySQL em Node.js.
- Uso de **pool** de conexões em vez de abrir/fechar a cada consulta.
- Pool guardado em `globalThis` para não vazar conexões a cada recarga do Next.js
  durante o desenvolvimento.
- Rota de teste em `/api/testar-conexao`, que só consulta e não altera nada.

**Arquivos**
- `.env` — criado no passo anterior, preenchido pelo Emerson.
- `.gitignore` — criado no passo anterior.
- `lib/mysql.js` — criado (abre a conexão lendo o `.env`).
- `app/api/testar-conexao/route.js` — criada (rota de verificação).
- `package.json` — atualizado (dependência `mysql2`).

**Verificação feita**
`GET /api/testar-conexao` devolveu:
`{"conectado":true,"banco":"projeto","versao_do_mysql":"8.0.28"}`

**Descoberta importante**
O database `projeto` **não está vazio**: já continha 7 tabelas anteriores do Emerson
(`cliente`, `cursos`, `jogador`, `pessoa`, `tbvendedores`, `time`, `times`). Nenhuma
delas foi criada por este projeto e nenhuma foi tocada. A tabela do CRM se chamará
`CRM` e conviverá com elas — sem conflito de nome, mas vale saber que o banco é
compartilhado com material de estudo antigo.

**Como testar**
```bash
cd "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM" && npm run dev
```
Abrir `http://localhost:3100/api/testar-conexao`. Deve responder `"conectado":true`.

---

### Passo 5 — Tabela `contatocrm` criada e populada
**Data:** 2026-09-07

**O quê**
Criada a tabela `contatocrm` no database `projeto`, com 10 contatos de exemplo.

**Por quê**
Dados de exemplo desde o início evitam construir tela contra banco vazio — dá para
ver na hora se a listagem, o funil e o painel estão certos. Os 10 contatos foram
distribuídos pelas quatro etapas de propósito, e dois deles têm campos em branco
(um sem e-mail, outro sem telefone) para provar que esses campos são mesmo opcionais.

**Estrutura da tabela**
| Campo | Tipo | Regra |
|---|---|---|
| `id` | int | Numeração automática |
| `nome` | varchar(120) | **Obrigatório** |
| `email` | varchar(160) | Opcional |
| `telefone` | varchar(20) | Opcional |
| `etapa` | enum | Só aceita `novo`, `em contato`, `proposta`, `cliente`. Padrão: `novo` |
| `anotacoes` | text | Opcional |
| `data_cadastro` | datetime | Preenchida sozinha pelo banco |

**Decisões tomadas**
- `etapa` como **ENUM** em vez de texto livre: o banco recusa qualquer valor fora
  das quatro etapas. Combina com o `prd.md`, que fixou as etapas na v1.
- Índice em `etapa` para o painel do funil contar rápido.
- Telefone como texto, não número: guarda a formatação `(11) 98812-4470` e nunca
  perde um zero à esquerda.
- SQL guardado em arquivo (`banco/01-criar-tabela-contatocrm.sql`) em vez de
  digitado direto no banco, para o passo poder ser refeito e revisado.

**Ressalva registrada**
O `prd.md` descreve anotações como um **histórico** com data por anotação. O que foi
feito aqui é um campo único de texto no contato, conforme pedido. O histórico exigirá
uma tabela própria mais adiante — anotado no `prd.md`.

**Arquivos**
- `banco/01-criar-tabela-contatocrm.sql` — criado.
- `prd.md` — atualizado (campos definidos, ressalva das anotações).

**Verificação feita**
Consulta ao banco devolveu os 10 contatos. Distribuição: `novo` 3, `em contato` 3,
`proposta` 2, `cliente` 2. Acentuação conferida (Patrícia, Marcos Antônio) — sem
caracteres quebrados.

**Como testar**
```bash
cd "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM" && node --env-file=.env -e "const m=await import('mysql2/promise');const c=await m.default.createConnection({host:process.env.MYSQL_HOST,port:+process.env.MYSQL_PORTA,user:process.env.MYSQL_USUARIO,password:process.env.MYSQL_SENHA,database:process.env.MYSQL_BANCO});const[r]=await c.query('SELECT id,nome,etapa FROM contatocrm ORDER BY id');console.table(r);await c.end()" --input-type=module
```

---

### Passo 6 — Cadastro e listagem de contatos
**Data:** 2026-09-13

**O quê**
A primeira funcionalidade do CRM está no ar: a tela `/contatos` cadastra, lista e
exclui contatos gravados na tabela `contatocrm`.

**Por quê**
Era a primeira funcionalidade da lista do `prd.md` e a que prova que as duas pontas
do projeto se falam: o que é digitado na tela chega ao banco e volta de lá. Enquanto
isso não acontece, todo o resto (funil, painel, IA) é suposição.

**O caminho do dado, em 3 frases**
1. Você preenche o formulário e clica em salvar; a tela junta os campos e envia para
   o endereço `/api/contatos` pelo método POST.
2. Essa rota roda no servidor, confere se o nome veio preenchido e manda um `INSERT`
   ao MySQL usando o pool de conexões do `lib/mysql.js` — os valores vão separados do
   texto do SQL, então nada que você digitar é interpretado como comando.
3. O banco grava, gera o `id` e a `data_cadastro` sozinho, a rota relê a linha
   recém-criada e devolve para a tela, que a coloca no topo da lista sem recarregar
   a página.

**Decisões tomadas**
- A tela ficou em `/contatos`, e não na página inicial: o `prd.md` reserva a inicial
  para o painel do funil. A home ganhou um link "Ir para contatos".
- A data sai **já formatada do banco** (`DATE_FORMAT`). Se viesse crua, passaria por
  três conversões de fuso horário até a tela e poderia aparecer com hora errada.
- O nome é conferido em dois lugares: na tela, para avisar rápido e com mensagem
  clara; e no servidor, porque a tela pode ser contornada e o banco não pode.
- Campo deixado em branco é gravado como `NULL`, não como texto vazio: "não tem
  e-mail" e "tem um e-mail vazio" são coisas diferentes.
- Lista ordenada por `data_cadastro DESC, id DESC` — o mais recente sempre no topo,
  e o `id` desempata quando dois contatos caem no mesmo minuto.
- Exclusão pede confirmação antes, por ser ação sem volta.
- Nenhuma cor escrita direto no código: todo o estilo novo usa as variáveis do
  `design.md`, e as quatro cores do funil aparecem só nas etiquetas de etapa.

**Arquivos**
- `app/api/contatos/route.js` — criado (GET lista, POST cadastra).
- `app/api/contatos/[id]/route.js` — criado (DELETE por id).
- `app/contatos/page.js` — criada (formulário + lista).
- `app/globals.css` — atualizado (estilos da tela de contatos).
- `app/page.js` — atualizado (link para a tela de contatos).
- `prd.md` — atualizado (funcionalidade marcada como feita).

**Verificação feita**
Testado pela tela, no navegador, com o servidor rodando:
- Cadastrado "Teste pela Tela — João Gonçalves": entrou no topo da lista na hora,
  sem recarregar, e o formulário limpou sozinho.
- Página recarregada: o contato continuava lá (veio do banco, não da memória).
- Clique em salvar com o nome vazio: bloqueou e mostrou "Informe o nome do contato.
  É o único campo obrigatório." Nada foi gravado.
- Botão Excluir: contato sumiu da tela e do banco (`DELETE` respondeu 200).
- Pela API, direto: nome em branco devolveu `400` com `{"erro":"O nome é
  obrigatório."}`; excluir um id que não existe devolveu `404`.
- Banco conferido no fim: de volta aos 10 contatos originais, nada de sobra.
- Nenhum erro no console do navegador.

**Pendência aberta**
O item do `prd.md` falava em "criar, ver, editar e excluir". **Editar** um contato já
existente não foi construído — não estava no pedido desta etapa. Fica registrado.

**Como testar**
```bash
cd "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM" && npm run dev
```
Abrir `http://localhost:3100/contatos` e:
1. Preencher só o nome e salvar → o contato aparece no topo da lista na hora.
2. Apertar F5 → ele continua lá.
3. Tentar salvar com o nome vazio → aparece o aviso e nada é gravado.
4. Clicar em Excluir em um contato → some da lista depois de confirmar.

---

### Passo 7 — Telefone formatado sozinho e busca na lista
**Data:** 2026-09-13

**O quê**
Duas melhorias na tela de contatos: o telefone se formata enquanto você digita
(`11981407667` vira `(11) 98140-7667`) e a lista ganhou um campo de busca que filtra
por nome, e-mail ou telefone.

**Por quê**
Telefone digitado de qualquer jeito vira banco bagunçado: o mesmo número aparece de
três formas e nenhuma busca acha todas. Formatar na hora da digitação resolve o
problema na origem, sem exigir disciplina de quem cadastra.

A busca resolve o problema oposto — o da lista crescendo. Com 10 contatos dá para
achar no olho; com 300, não. O filtro encontra o trecho em **qualquer posição**:
`rgo` acha tanto `Jorge` quanto `borges@...`.

**Decisões tomadas**
- **Uma função de telefone só** (`lib/telefone.js`), usada na tela e no servidor. Na
  tela, para você ver o número se formatando; no servidor, porque a API pode ser
  chamada por fora da tela e o banco precisa ficar uniforme de qualquer jeito.
- Telefone com **mais de 11 números** (código do país, ramal) é gravado como foi
  digitado, sem máscara. Melhor não formatar do que perder um número.
- **A busca acontece no navegador**, sobre a lista já carregada — é instantânea e não
  consulta o banco a cada tecla. Serve até a casa dos milhares de contatos; passando
  disso, a busca precisa ir para o banco (`LIKE` no SQL). Está anotado.
- A busca **ignora acentos e maiúsculas**: `patricia` encontra `Patrícia`.
- A busca **ignora a formatação do telefone**: `4898876 2201` encontra
  `(48) 98876-2201`, porque a comparação também é feita só com os números.
- A contagem muda de `11 contatos` para `1 de 11` quando há busca ativa, para ficar
  claro que a lista está filtrada e não encolheu.

**Arquivos**
- `lib/telefone.js` — criado (a formatação, em um lugar só).
- `app/api/contatos/route.js` — atualizado (formata antes de gravar).
- `app/contatos/page.js` — atualizado (máscara no campo + busca na lista).
- `app/globals.css` — atualizado (espaçamento do campo de busca).
- `prd.md` — atualizado (a busca faz parte do item de cadastro e listagem).

**Verificação feita**
- Digitado `11981407667` tecla a tecla: virou `(11) 98140-7667`. Fixo `1130114455`
  virou `(11) 3011-4455`. O cursor não trava ao apagar.
- Salvo pela tela com o telefone digitado cru: o banco recebeu `(11) 98765-4321`.
- Chamada direta na API (fora da tela) com `1140028922`: gravou `(11) 4002-8922`.
- Busca `rgo` → achou o contato pelo meio do e-mail. `patricia` (sem acento) → achou
  `Patrícia`. `98876` → achou pelo meio do telefone. `4898876 2201` → achou o número
  formatado. `zzz` → `0 de 11` e a mensagem "Nenhum contato encontrado".
- Contatos de teste apagados no fim; o banco ficou só com os dados de verdade.

**Ponto de atenção**
Os contatos cadastrados **antes** deste passo continuam com o telefone do jeito que
foram gravados — a formatação vale da gravação em diante. Há um contato nessa
situação (id 14). Como a tela de edição ainda não existe, corrigir hoje significa
apagar e cadastrar de novo.

**Como testar**
```bash
cd "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM" && npm run dev
```
Em `http://localhost:3100/contatos`:
1. No campo Telefone, digite só números: `11987654321`. Ele se formata sozinho.
2. Salve e veja o número formatado na lista.
3. No campo de busca, digite um pedaço de um nome, e-mail ou telefone — de qualquer
   parte da palavra. A lista filtra a cada tecla e a contagem vira "X de Y".
4. Apague a busca: a lista inteira volta.

---

### Passo 8 — Duas regras de cadastro dentro do banco
**Data:** 2026-09-13

**O quê**
O banco passou a recusar dois cadastros errados: e-mail repetido e contato sem
nenhuma forma de falar com a pessoa.

**Por quê**
Sem a primeira regra, o mesmo cliente entra cinco vezes e ninguém percebe até a
lista já estar suja. Sem a segunda, dá para salvar um nome solto — um registro que
nasce inútil, porque não há como entrar em contato.

As duas regras ficam **no banco**, e não só na tela. Tela pode ser contornada (a API
pode ser chamada direto, e um dia haverá importação de dados); o banco é a última
porta. A tela confere as mesmas regras antes de enviar, mas só para a mensagem sair
clara — quem realmente recusa é o banco.

**As regras**
| Regra | Como o banco aplica |
|---|---|
| Um e-mail não pode se repetir | Índice `UNIQUE` em `email` |
| Todo contato precisa de e-mail **ou** telefone | Regra `CHECK` com os dois campos |

Contato **sem e-mail** continua permitido à vontade: no MySQL, o `UNIQUE` não compara
campos vazios (`NULL`) entre si. Testado com dois contatos sem e-mail ao mesmo tempo.

A comparação de e-mail ignora maiúsculas, porque é assim que a tabela foi criada
(`utf8mb4_unicode_ci`): `MARCOS.VIEIRA@...` e `marcos.vieira@...` são o mesmo e-mail.

**Decisões tomadas**
- Mensagem em português no lugar do erro técnico: a API traduz os dois códigos que o
  banco devolve (`ER_DUP_ENTRY` e `ER_CHECK_CONSTRAINT_VIOLATED`).
- E-mail repetido responde `409` (conflito) e falta de meio de contato responde `400`
  (pedido malformado) — códigos diferentes para problemas diferentes.
- A tela agora mostra a mensagem da API **como ela veio**, sem colar "Não foi possível
  salvar:" na frente. O texto do servidor já está escrito para ser lido.
- Um recado curto embaixo do campo de telefone avisa a regra **antes** de a pessoa
  tentar salvar.
- O SQL ficou em arquivo (`banco/02-regras-de-cadastro.sql`), como no Passo 5.

**Arquivos**
- `banco/02-regras-de-cadastro.sql` — criado e executado no banco.
- `app/api/contatos/route.js` — atualizado (confere a regra e traduz os erros).
- `app/contatos/page.js` — atualizado (aviso antes de enviar + mensagem limpa).
- `app/globals.css` — atualizado (estilo do recado embaixo do campo).
- `prd.md` — atualizado (regras de cadastro registradas).

**Verificação feita**
- Antes de aplicar: conferido que não havia e-mail repetido nem contato sem meio de
  contato no banco — as regras entraram sem conflito com os dados existentes.
- Pela API: cadastro só com nome → `400` "Informe pelo menos um meio de contato".
  E-mail já existente (digitado em maiúsculas) → `409` "Já existe um contato
  cadastrado com esse e-mail". Cadastro válido → `201`.
- Direto no banco, passando por fora da API: `INSERT` sem e-mail e sem telefone foi
  recusado (`ER_CHECK_CONSTRAINT_VIOLATED`); `INSERT` com e-mail repetido foi
  recusado (`ER_DUP_ENTRY`). As regras funcionam sem depender do código.
- Dois contatos sem e-mail gravados ao mesmo tempo: permitidos, como esperado.
- Pela tela: as duas mensagens aparecem no aviso e nada é gravado; cadastro só com
  telefone funciona normalmente.
- Contatos de teste apagados no fim.

**Como testar**
```bash
cd "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM" && npm run dev
```
Em `http://localhost:3100/contatos`:
1. Preencha só o nome e salve → "Informe pelo menos um meio de contato".
2. Preencha nome + o e-mail de alguém que já está na lista → "Já existe um contato
   cadastrado com esse e-mail".
3. Preencha nome + telefone → salva normalmente.

---

### Passo 9 — Alteração de contato (o update que faltava)
**Data:** 2026-09-13

**O quê**
Cada contato da lista ganhou um botão **Editar**. Ele carrega os dados no formulário
que já existe, que passa a se chamar "Alterando contato" e salva por cima do registro
em vez de criar um novo.

**Por quê**
Faltava a única das quatro operações básicas que não tínhamos: criar, ler, **alterar**
e apagar. Sem ela, corrigir um telefone digitado errado só era possível apagando o
contato e cadastrando de novo — o que troca o id e perde a data de cadastro.

**Decisões tomadas**
- **O mesmo formulário serve para os dois casos**, em vez de uma tela nova de edição.
  É a solução mais simples: um formulário só para manter, um conjunto de campos só
  para conferir. O que muda é o endereço para onde os dados vão — `POST /api/contatos`
  cadastra, `PUT /api/contatos/10` altera o contato de id 10.
- **As regras saíram para `lib/contatos.js`**, usadas pelo cadastro e pela alteração.
  Se cada rota tivesse a sua cópia, uma hora as duas iam divergir e a alteração
  passaria a aceitar o que o cadastro recusa. Junto foram as etapas válidas, a lista
  de campos da consulta e a tradução dos erros do banco.
- **`data_cadastro` fica de fora do UPDATE**: a data em que o contato entrou não muda
  quando ele é corrigido. Conferido no teste — continuou 07/09.
- O contato alterado **fica no mesmo lugar da lista**, não pula para o topo. Quem
  estava olhando a lista não perde o contato de vista.
- Enquanto a alteração está em andamento: o cartão correspondente ganha a borda de
  destaque, o formulário mostra de qual id se trata, o botão vira "Salvar alterações"
  e aparece um "Cancelar". O cursor vai direto para o campo Nome.
- Apagar o contato que está sendo alterado cancela a alteração sozinho — senão o
  formulário ficaria apontando para um id que não existe mais.

**Arquivos**
- `lib/contatos.js` — criado (as regras do contato, em um lugar só).
- `app/api/contatos/[id]/route.js` — atualizado (novo `PUT`, além do `DELETE`).
- `app/api/contatos/route.js` — atualizado (passou a usar o `lib/contatos.js`).
- `app/contatos/page.js` — atualizado (modo alteração).
- `app/globals.css` — atualizado (botões Editar/Excluir lado a lado, botão Cancelar,
  destaque do cartão em edição). A classe `.botao-excluir` virou `.botao-linha`,
  porque agora serve aos dois botões do rodapé do cartão.
- `prd.md` — atualizado (o item de contatos ficou completo).

**Verificação feita**
- Pela API: alteração válida → `200` com o contato atualizado e a data de cadastro
  intacta; e-mail de outro contato → `409`; sem meio de contato → `400`; id que não
  existe → `404`. Telefone digitado cru na alteração também sai formatado.
- Pela tela: "Editar" no Marcos carregou os cinco campos, o título virou "Alterando
  contato", o cartão ficou destacado e o cursor foi para o Nome. Mudei a etapa para
  `proposta` e a anotação, salvei: o cartão mudou **no lugar** (posição 1 da lista),
  o total continuou 11 (não duplicou) e o formulário voltou a "Novo contato", vazio.
- Conferido no banco: a alteração estava gravada.
- "Cancelar" devolveu o formulário ao modo cadastro, limpo, e tirou o destaque.
- Tudo que foi mexido nos testes voltou ao valor original.

**Como testar**
```bash
cd "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM" && npm run dev
```
Em `http://localhost:3100/contatos`:
1. Clique em **Editar** em qualquer contato → os dados aparecem no formulário à
   esquerda e o cartão ganha borda azul.
2. Mude a etapa (ou qualquer campo) e clique em **Salvar alterações** → o cartão muda
   na hora, sem sair do lugar, e o formulário se limpa.
3. Aperte F5 → a mudança continua lá.
4. Clique em Editar e depois em **Cancelar** → nada muda, o formulário volta ao normal.
5. Tente trocar o e-mail de um contato pelo e-mail de outro → "Já existe um contato
   cadastrado com esse e-mail".

---

### Passo 10 — Login: o CRM deixou de ser público
**Data:** 2026-09-13

**O quê**
O CRM agora exige usuário e senha. Sem entrar, nenhuma tela abre e nenhum dado sai do
servidor. Dentro do sistema há um botão **Sair**.

**Por quê**
Até aqui, qualquer pessoa com o endereço via a lista inteira de contatos — e podia
apagá-la. Fechar o acesso era pré-requisito para publicar o CRM na internet, que é o
último item da lista do `prd.md`.

**Como funciona, em quatro peças**
| Peça | Arquivo | O que faz |
|---|---|---|
| A portaria | `middleware.js` | Roda antes de toda tela e toda rota. Sem sessão: tela vai para o login, API responde 401. |
| A senha | `lib/senha.js` | Embaralha e confere a senha com `scrypt`. |
| A sessão | `lib/sessao.js` | Cria e confere o cookie assinado. |
| As portas abertas | `/login`, `/api/entrar`, `/api/sair` | O mínimo que precisa ficar fora da portaria — senão ninguém entraria nunca. |

**Decisões tomadas**
- **A senha nunca é guardada como texto.** O que fica no `.env` é o resultado de uma
  conta que só anda para frente (`scrypt`): dá para transformar a senha no resumo, mas
  não dá para voltar do resumo até a senha. Se o arquivo vazar, a senha não vaza junto.
- **Cada senha leva um "sal"** — bytes aleatórios misturados antes da conta. É por isso
  que listas prontas de senhas quebradas não servem contra este arquivo.
- **`scrypt` e não uma biblioteca nova**: já vem no Node, e é lento de propósito — quem
  roubar o arquivo não consegue testar milhões de tentativas por segundo.
- **Nenhuma biblioteca de login foi instalada.** O projeto tem um usuário só; um
  cookie assinado com `HMAC` resolve, e é código que dá para ler inteiro em 5 minutos.
- **O cookie é `HttpOnly`**: nenhum script da página consegue lê-lo, nem um script
  injetado. Conferido no navegador — `document.cookie` volta vazio com a sessão aberta.
- **A sessão dura 8 horas** e o prazo vai assinado dentro do próprio cookie: adiantar o
  relógio do navegador não estende nada.
- **A mensagem de erro é uma só** para usuário errado e senha errada. Dizer qual dos
  dois falhou entrega meio caminho a quem está tentando invadir.
- **`Secure` entra sozinho quando publicar** (`NODE_ENV=production`): em https o cookie
  só viaja criptografado. Em desenvolvimento, no `http://localhost`, ficaria no caminho.

**Onde o Emerson define o acesso**
Rodando `npm run acesso` (o script `scripts/definir-acesso.js`). Ele pergunta usuário e
senha — a senha não aparece na tela enquanto é digitada — e imprime três linhas para
colar no fim do `.env`:

    CRM_USUARIO=...
    CRM_SENHA_HASH=...
    CRM_SEGREDO=...

A senha em si não é escrita em lugar nenhum: o script calcula o resumo e a esquece. O
`.env` já estava no `.gitignore` desde o Passo 4.

**Arquivos**
- `middleware.js` — criado (a portaria).
- `lib/senha.js` — criado (embaralhar e conferir a senha).
- `lib/sessao.js` — criado (cookie assinado).
- `app/login/page.js` — criada (tela de entrada).
- `app/api/entrar/route.js` — criada (confere e entrega a sessão).
- `app/api/sair/route.js` — criada (apaga a sessão).
- `app/botao-sair.js` — criado (o botão, usado em duas telas).
- `app/contatos/page.js` e `app/page.js` — atualizados (botão Sair).
- `app/globals.css` — atualizado (tela de login e cabeçalho com o botão).
- `scripts/definir-acesso.js` — criado (gera as três linhas do `.env`).
- `package.json` — atualizado: novo script `acesso` e `"type": "module"`, que faz o
  Node entender os `import` dos nossos arquivos ao rodar o script fora do Next.
- `prd.md` — atualizado (login marcado como pronto).

**Verificação feita**
Testado com um acesso temporário em `.env.local`, apagado ao fim (o `.env` do Emerson
não foi tocado). Pelo endereço, sem navegador:
- `/contatos` e `/` sem sessão → `307` para `/login`. `/login` abre normalmente.
- `/api/contatos` sem sessão → `401`. O mesmo para `POST` e `DELETE`: a escrita também
  está fechada, não só a leitura.
- Senha errada → `401` "Usuário ou senha inválidos". Usuário errado com a senha certa →
  a mesma mensagem.
- Senha certa → `200` e o cookie da sessão.
- Cookie com **uma letra trocada** → `401`. A assinatura pega a adulteração.
- Sair → o servidor manda o cookie vencido; depois disso, dados e telas barram de novo.

Pela tela, no navegador: abrir `/contatos` caiu no login; senha errada mostrou a
mensagem e limpou o campo; senha certa entrou na lista com os 11 contatos; o botão
Sair voltou para o login e a tentativa de voltar para `/contatos` caiu no login de
novo. Com a sessão aberta, `document.cookie` estava vazio — o cookie é mesmo HttpOnly.

**Estado em que o projeto ficou**
Sem as três linhas no `.env`, **o CRM não abre para ninguém** — nem para o Emerson. A
tela de login responde "O acesso ainda não foi configurado". É de propósito: fechado
por padrão. Basta rodar `npm run acesso`, colar as linhas e reiniciar o servidor.

**Como testar**
```bash
cd "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM" && npm run acesso
```
Colar as três linhas no fim do `.env`, e então:
```bash
cd "C:/Users/Users/OneDrive/Área de Trabalho/LLMs-Projetos/CRM" && npm run dev
```
1. Abrir `http://localhost:3100/contatos` → cai na tela de login.
2. Digitar a senha errada → "Usuário ou senha inválidos".
3. Digitar a senha certa → entra na lista de contatos.
4. Clicar em **Sair** → volta ao login; tentar voltar para `/contatos` cai no login.

---

### Passo 11 — Menu `crm.bat` para ligar e abrir o CRM
**Data:** 2026-09-21

**O quê**
Criado o `crm.bat` na raiz do projeto: um menu que liga o servidor e abre o CRM no
navegador, sem abrir terminal nem digitar comando.

**Por quê**
Até aqui, usar o CRM exigia abrir o PowerShell, entrar na pasta, rodar `npm run dev` e
digitar o endereço no navegador. Com o menu são dois cliques no arquivo e um número. O
formato segue o dos menus dos outros projetos (`Marketing/run_marketing_menu.bat`).

**O menu**
| Opção | O que faz |
|---|---|
| 1) Ligar o CRM e abrir no navegador | Roda `npm run dev` na própria janela e abre `http://localhost:3100` assim que o servidor responde. |
| 2) Abrir o CRM no navegador (servidor já ligado) | Só abre o navegador e fecha o menu. Com o servidor desligado, avisa e volta ao menu. |
| 3) Sair | Fecha o menu. |

**Decisões tomadas**
- **O navegador só abre quando o servidor responde.** Abrir junto com o `npm run dev`
  mostraria "não foi possível acessar esta página": dentro do OneDrive, o Next leva de
  10 a 40 segundos para ficar pronto. Um `curl` em segundo plano tenta a cada segundo
  (por até 60 s) e só então abre a página.
- **A opção 1 não liga o CRM duas vezes.** Se ele já responde, ligar de novo daria erro
  de porta ocupada; o menu avisa e só abre o navegador.
- **Texto sem acentos**, porque o `cmd` do Windows exibe acentos quebrados — mesmo
  padrão dos outros menus.
- **Quebra de linha do Windows (CRLF)** no arquivo: com a do Linux, os saltos do menu
  (`goto`) podem falhar.
- Nada foi instalado: o `curl` já vem no Windows 11.

**Descoberta importante**
O Next.js 16.3 escreve um bloco no `CLAUDE.md` (entre `BEGIN:nextjs-agent-rules` e
`END:nextjs-agent-rules`) quando o `next dev` é ligado **por um assistente de IA** — ele
detecta isso pelo ambiente. Aconteceu no teste deste passo, porque o servidor foi ligado
de dentro do Claude Code. O bloco foi removido e o `CLAUDE.md` voltou ao original
(2.579 bytes). Ligando pelo `crm.bat` com dois cliques, isso não acontece. O Next
permite desligar esse comportamento (`agentRules: false` no `next.config`), mas o
projeto ainda não tem esse arquivo — ficou em "Próximos passos".

**Arquivos**
- `crm.bat` — criado.
- `CLAUDE.md` — alterado pelo Next.js durante o teste e restaurado ao original.

**Verificação feita**
O próprio `crm.bat` foi executado, com as teclas simuladas:
- Opção 3 → fechou.
- Opção inválida (`9`) → "Opcao invalida" e voltou ao menu.
- Opção 2 com o servidor desligado → "O CRM esta desligado. Use a opcao 1 para ligar."
- Opção 1 → o servidor subiu (primeira resposta em 41 s), o `curl` de espera terminou e
  abriu o navegador.
- Opção 1 de novo, com o servidor já ligado → "O CRM ja esta ligado em outra janela" e
  abriu o navegador, sem tentar ligar outra vez.
- Opção 2 com o servidor ligado → abriu o navegador e fechou o menu.
- No fim: servidor de teste desligado e porta 3100 livre.

**Como testar**
1. No Explorador de Arquivos, abrir a pasta `CRM` e dar dois cliques em `crm.bat`.
2. Digitar `1` e Enter → aparece o log do Next e, alguns segundos depois, o navegador
   abre na tela de login do CRM.
3. Dar dois cliques no `crm.bat` de novo (segunda janela) e digitar `2` → abre outra
   aba do CRM e essa segunda janela fecha sozinha.
4. Na primeira janela, apertar Ctrl+C (ou fechar a janela) → o servidor desliga;
   recarregar a aba do navegador não abre mais o CRM.

---

### Passo 12 — Painel do funil na página inicial
**Data:** 2026-09-21

**O quê**
A página inicial virou o painel do CRM: o total de contatos em número grande e, logo
abaixo, quantos há em cada etapa do funil, cada um com a etiqueta colorida da etapa.
Os números se atualizam sozinhos. O login agora leva para cá, e não mais para
`/contatos`.

**Por quê**
É a pergunta que o `prd.md` quer responder de relance: quem eu tenho e o que está em
andamento. Antes, isso exigia rolar a lista de contatos e contar etiquetas no olho.

**Duas decisões tomadas com o Emerson antes de construir**
- **Cor da etapa:** o pedido era "cada contagem com a cor da sua etapa", mas o
  `design.md` restringe as quatro cores às etiquetas. Escolha: cada contagem leva a
  etiqueta colorida da etapa, e o número grande fica em grafite. O `design.md` não
  precisou de exceção.
- **Onde fica o painel:** só na página inicial. A tela `/contatos` continua igual.

**Como os números se atualizam sozinhos — três caminhos**
| Caminho | Quando dispara | Para que serve |
|---|---|---|
| Recado entre abas (`BroadcastChannel`) | Logo depois de a tela de contatos gravar ou excluir | Painel aberto em outra aba ou janela muda **na hora** |
| Volta para a aba | Ao voltar a olhar a aba do painel | Quem estava em outra aba encontra tudo atualizado |
| Relógio de 15 segundos | Enquanto a aba está à vista | Mudanças feitas fora deste navegador (outro computador, direto no banco) |

**Decisões tomadas**
- **Quem conta é o banco** (`GROUP BY etapa`, na rota nova `/api/painel`), usando o
  índice de `etapa` criado no Passo 5. A tela recebe cinco números, não a lista inteira.
- **O número que muda mostra o que mudou**: entra com um movimento curto de baixo para
  cima e ganha ao lado a diferença (`+1`, `−1`), que some em 4 segundos. Quem ativou
  "reduzir movimento" no sistema não vê animação.
- **"Ao vivo · atualizado às 20:24:15"** no canto: prova, a qualquer momento, de que os
  números estão frescos. Sem servidor, vira "Sem conexão com o servidor. Tentando de
  novo..." e os últimos números continuam na tela.
- **Sessão vencida** no meio do caminho (a rota responde 401): o painel leva para o login.
- **Duas buscas cruzadas** (o recado e o relógio ao mesmo tempo): só vale a mais
  recente, para um resultado velho não cobrir um novo.
- **Percentual em texto** (`31% do total`), sem gráfico, como pedido.
- **Algarismos proporcionais nos números grandes.** Com os de largura fixa, o "1" do
  "13" ocupava a largura de um "8" e parecia desalinhado do rótulo acima dele.
- **A tela de contatos só ganhou o aviso**: uma chamada a `avisarMudanca()` depois de
  gravar e outra depois de excluir. Nada do que ela faz mudou.
- Saíram do CSS as classes `.link` e `.rodape-cartao`, que só a página inicial antiga
  usava.

**Arquivos**
- `app/api/painel/route.js` — criada (a contagem no banco).
- `app/painel.js` — criado (o painel, que roda no navegador e se atualiza sozinho).
- `lib/aviso-de-mudanca.js` — criado (o recado entre abas, dos dois lados).
- `app/page.js` — reescrita (barra do topo + painel).
- `app/contatos/page.js` — atualizada (só o aviso depois de gravar e de excluir).
- `app/login/page.js` — atualizada (depois de entrar, vai para `/`).
- `app/globals.css` — atualizado (estilos do painel; saíram os da home antiga).
- `prd.md` — atualizado (painel marcado como feito).

**Verificação feita**
Testado com um segredo de sessão temporário em `.env.local`, apagado no fim. O `.env`
do Emerson não foi tocado e ninguém digitou senha.
- `/api/painel` sem sessão → `401`. Com sessão → `{"total":13,"etapas":{"novo":3,
  "em contato":4,"proposta":2,"cliente":4}}`, idêntico a um `GROUP BY` direto no banco.
- **O critério de pronto:** painel numa aba e `/contatos` em outra. Mudei a etapa da
  Michele (id 26) de `cliente` para `proposta` e depois de volta. Na volta, medido: o
  painel buscou os números **80 ms** depois do clique em salvar e mudou na tela em
  **148 ms**, mostrando `proposta −1` e `cliente +1`.
- Cadastro de um contato de teste → total `14 (+1)` e novo `4 (+1)`, percentuais
  recalculados. Exclusão dele pela tela → de volta a 13.
- Rede simulada fora do ar → "Sem conexão..." com o 13 mantido na tela. Sessão apagada
  → o próximo recado levou para `/login`.
- Valores aplicados conferidos contra o `design.md`: fundo `#FAFAF7`, quadro `#FFFFFF`
  com borda de 1px `#E6E4DE`, canto `10px`, números Manrope 800 em `#17181C`, cores de
  etapa só nas etiquetas, cobalto só no ponto "ao vivo" e nos links. Nenhum gradiente,
  sombra ou desfoque na página.
- No celular (375px): as etapas viram 2 × 2, sem rolagem lateral e sem etiqueta cortada.
- Nenhum erro no console das duas abas nem no log do servidor.
- No fim: banco igual ao início (Michele de volta em `cliente`, contato de teste
  apagado), `CLAUDE.md` idêntico ao original, porta 3100 livre.

**Não testado**
- O redirecionamento do login para `/`: testar exigiria digitar uma senha na tela de
  login. A mudança é de uma linha e está no "Como testar" abaixo.
- O painel com o banco vazio ("Nenhum contato cadastrado ainda").

**Como testar**
Ligar o CRM pelo `crm.bat` (opção 1) e entrar com o seu usuário e senha:
1. Depois de entrar, você cai na página inicial, no **Painel**, e não mais na lista.
2. Os números batem com a lista de contatos: total e quantos há em cada etapa.
3. Clique em **Contatos** com o botão do meio do mouse (abre em outra aba) e ponha as
   duas abas lado a lado, em duas janelas.
4. Em Contatos, clique em **Editar** num contato, troque a etapa e salve. Na janela do
   painel, os números mudam na hora e aparecem `+1` e `−1` ao lado deles.
5. Cadastre um contato novo: o total sobe e aparece `+1`. Exclua o contato: volta.

---

### Passo 13 — Revisão de segurança
**Data:** 2026-09-21

**O quê**
Revisão do projeto inteiro em quatro frentes: segredos no código, acesso sem login,
conferência dos formulários e mensagens de erro. Cada falha foi primeiro **provada**
por teste, depois corrigida e testada de novo. Sem mudança de visual nem de
funcionalidade.

**Resultado, item por item**
| Item | Antes | O que foi feito |
|---|---|---|
| 1. Segredo no código | **OK** | Nada a mover. Os valores do `.env` foram procurados em 464 arquivos; só aparecem no cache interno do Next (`.next/dev/cache`), que é gerado sozinho, não é servido e já está no `.gitignore`. |
| 2. Acesso sem login | **OK hoje, com 3 brechas** | Segunda tranca em cada rota de dados; portas abertas da portaria pelo endereço exato; login com o mesmo tempo de resposta para usuário certo e errado. |
| 3. Conferência dos formulários | **Parcial** | Regras completadas conforme a estrutura da tabela: tipo, tamanho, formato e etapa. |
| 4. Erro com detalhe interno | **Não** | Frase genérica na tela; o detalhe técnico vai para o terminal do servidor. |

**Item 2 — as três brechas**
- **A portaria era a única tranca.** Chamadas direto, sem ela na frente, as rotas
  entregavam a lista, os números e até **gravavam** um contato sem cookie. E o Next 16
  já marcou o nome `middleware` como ultrapassado (o aviso aparece no log): se um dia
  ele deixar de ser carregado, tudo ficaria aberto sem ninguém perceber. Correção:
  `exigirSessao()` em `lib/sessao.js`, chamada no começo de toda rota de dados.
- **As portas abertas valiam pelo começo do nome.** `/loginqualquer` escapava da
  portaria; uma tela futura chamada `/login-algo` nasceria pública. Correção: lista
  `PORTAS_ABERTAS` comparada pelo endereço exato.
- **O tempo do login entregava o usuário.** Com usuário errado, a resposta vinha em
  0,3 ms; com o certo, em 85 ms, porque a conta pesada da senha só rodava nesse caso.
  Correção: a senha é conferida sempre. Depois: 86,5 × 88,6 ms (mediana de 30).

**Item 3 — as regras de conferência (em `lib/contatos.js`)**
| Campo | Controle da tabela | Conferência antes de salvar |
|---|---|---|
| (corpo do pedido) | — | Precisa ser um objeto; campos precisam ser texto. |
| `nome` | `VARCHAR(120) NOT NULL` | Obrigatório, até 120 caracteres. |
| `email` | `VARCHAR(160)`, `UNIQUE` | Até 160 caracteres, formato `nome@dominio.algo`. Repetido: o banco recusa (Passo 8). |
| `telefone` | `VARCHAR(20)` | Até 20 caracteres, só números e `( ) + - .`, pelo menos 10 números (DDD + número). |
| `etapa` | `ENUM` das 4 etapas | Em branco vira `novo`; inventada é **recusada**. Antes virava `novo` calada — numa alteração, isso apagava a etapa que o contato tinha. |
| `anotacoes` | `TEXT` (65.535 bytes) | Até 65.535 bytes. |
| e-mail + telefone | `CHECK` do Passo 8 | Pelo menos um dos dois (já existia). |

Antes de aplicar, conferido que nenhum dos 14 contatos do banco quebra as regras novas.

**Item 4 — o que vazava**
Seis pontos devolviam a mensagem técnica do erro. Exemplos reais do teste "antes":
`Data too long for column 'nome'` (estrutura do banco), `connect ECONNREFUSED
127.0.0.1:1` (endereço do banco), `(dados.nome ?? "").trim is not a function` (código),
e a tela de login, aberta a qualquer visitante, citava o comando e o arquivo de
segredos. Correção: `lib/erro-interno.js` responde "Não foi possível concluir agora.
Tente de novo em instantes." e grava o detalhe no terminal com `[CRM]` na frente. Antes,
esse detalhe não ia para lugar nenhum além da tela. Corpo que não é JSON passou de 500
para 400 "Dados inválidos".

**Arquivos**
- `lib/erro-interno.js` — criado (resposta genérica + detalhe no terminal).
- `lib/sessao.js` — atualizado (`exigirSessao`).
- `lib/contatos.js` — atualizado (conferência completa; erro genérico).
- `middleware.js` — atualizado (portas abertas pelo endereço exato).
- `app/api/contatos/route.js`, `app/api/contatos/[id]/route.js`,
  `app/api/painel/route.js`, `app/api/testar-conexao/route.js` — segunda tranca e erro
  genérico.
- `app/api/entrar/route.js` — tempo constante, corpo inválido, erro genérico, aviso de
  configuração sem citar comando nem arquivo.
- `prd.md` — atualizado (regras de cadastro).

**Verificação feita**
- Script que chama as rotas direto, rodado antes e depois. Antes: 5 rotas sem cookie
  respondiam (uma gravou); 11 dados inválidos passavam ou viravam erro técnico. Depois:
  as 5 respondem `401`; os 11 respondem `400` com mensagem clara; os 2 cadastros
  válidos continuam gravando (`201`).
- Portaria no servidor, sem login, 19 endereços — incluindo `../`, maiúsculas, letra
  codificada e o cabeçalho `x-middleware-subrequest` (falha famosa do Next em 2025):
  tudo barrado. `/login`, `/api/entrar` e `/api/sair` continuam abertos.
- Logado, no servidor real: painel, lista, cadastro, alteração de etapa e exclusão
  funcionando; e-mail `abc` pela tela mostra a mensagem nova no aviso e não grava nada.
  Telas visualmente iguais.
- `npm audit`: 0 vulnerabilidades conhecidas.
- No fim: banco com os mesmos 14 contatos, `.env.local` temporário apagado, `.env` não
  tocado, `CLAUDE.md` idêntico ao original.

**Ocorrido durante o teste**
O `crm.bat` do Emerson estava com o servidor ligado quando o `.env.local` temporário
foi criado; ele foi apagado em segundos, ao perceber. Por isso o resto do teste passou
a chamar as rotas direto, sem servidor, até a porta ficar livre.

**Como testar**
Com o CRM **desligado**:
```bash
curl -s http://localhost:3100/api/contatos
```
Não deve responder nada (servidor desligado). Ligue pelo `crm.bat` e rode de novo:
deve responder `{"erro":"Faça login para continuar."}`. E então, logado, em
`http://localhost:3100/contatos`:
1. Cadastre um contato com e-mail `abc` → "O e-mail não parece válido...".
2. Com telefone `123` → "O telefone precisa ter DDD e número...".
3. Com dados certos → grava normalmente.
4. Pare o MySQL e recarregue a lista → a tela mostra só a frase genérica; o motivo
   técnico aparece na janela do `crm.bat`, começando por `[CRM]`.

---

### Passo 14 — Projeto no GitHub
**Data:** 2026-09-21

**O quê**
Iniciado o Git na pasta do projeto e enviado tudo para o GitHub, em
`https://github.com/rgorosp/CRM`, na branch `main`.

**Por quê**
Pedido do Emerson. O projeto passa a ter cópia fora da máquina e histórico de cada
mudança (o Git registra quem mudou o quê e quando, e permite voltar atrás).

**Como foi feito**
- Rodados os comandos que o GitHub sugere para repositório novo: `README.md` com
  `# CRM`, `git init`, commit `first commit` só com o README, branch renomeada para
  `main`, `origin` apontando para o GitHub e `git push`.
- Num segundo commit entrou o resto do projeto (34 arquivos no total).

**Conferência de segurança antes de enviar**
- O `.gitignore` do Passo 4 deixou de fora `.env`, `node_modules` e `.next` —
  confirmado com `git check-ignore`.
- Nenhum valor secreto do `.env` (senha do MySQL, usuário e hash do login, segredo da
  sessão) aparece em outro arquivo do projeto. Só o host (`127.0.0.1`), o nome do
  database e o usuário do MySQL aparecem no `skill.md`, e nenhum deles é segredo.

**Arquivos**
- `README.md` — criado.
- `.git/` — pasta criada pelo `git init` (não aparece no GitHub).
- `skill.md` — este passo, a linha "Versionamento" em "Decisões técnicas" e o item
  do Git em "Próximos passos".

**Como testar**
1. Abrir `https://github.com/rgorosp/CRM` → aparecem as pastas `app`, `banco`, `lib`,
   `scripts` e os arquivos `.md`, **sem** `.env` e **sem** `node_modules`.
2. No PowerShell, dentro da pasta `CRM`:
   ```bash
   git status
   ```
   Deve responder `Your branch is up to date with 'origin/main'` e
   `nothing to commit, working tree clean`.

---

## Próximos passos

Ideias e pendências. Saem daqui e viram passo numerado **só depois de executadas**.

- [x] ~~Definir o que o CRM precisa fazer~~ — feito no `prd.md`, Passo 2.
- [x] ~~Escolher a stack~~ — Next.js, definido no Passo 2.
- [ ] Levar a busca para o banco (SQL `LIKE`) quando a lista passar de alguns
      milhares de contatos — hoje ela é feita no navegador (Passo 7).
- [x] ~~Iniciar o repositório Git~~ — feito no Passo 14, com o projeto no GitHub.
- [ ] Resolver a questão do OneDrive x `node_modules`.
- [x] ~~Construir a **edição** de um contato já existente~~ — feita no Passo 9.
- [ ] Decidir se o CRM fica no database `projeto` (com as tabelas antigas) ou em um database próprio.
- [ ] Decidir se desliga a escrita automática do Next.js no `CLAUDE.md`
      (`agentRules: false`, exige criar o `next.config.js`) — ver Passo 11.
- [ ] Renomear `middleware.js` para `proxy.js`, como o Next 16 pede — ver Passo 13.
- [ ] Criar um usuário próprio do MySQL para o CRM, com acesso só à tabela
      `contatocrm`. Hoje o app conecta como `root` — ver Passo 13.
- [ ] Limitar tentativas de login seguidas (hoje são ilimitadas) antes de publicar.
- [ ] Antes de publicar: cabeçalhos de segurança e esconder o `X-Powered-By: Next.js`
      (os dois pedem o `next.config.js`).
