# Regras do projeto CRM

Manual de trabalho do Claude neste projeto. Leia antes de agir, em toda sessão.

---

## As regras

**1. `prd.md` e `design.md` são a fonte da verdade.**
Consulte os dois antes de qualquer tarefa. Se o que foi pedido conflita com eles,
avise antes de executar — não decida sozinho qual dos dois vence.
*(O `design.md` ainda não existe. Será criado quando definirmos o "como".)*

**2. Simplicidade é a prioridade máxima.**
A solução mais simples que resolve o problema pedido. Sem camada de abstração
"para o futuro", sem biblioteca extra que não seja necessária, sem generalizar
o que ainda não precisou ser generalizado.

**3. A base é Next.js.**
Telas e servidor no mesmo projeto — do jeito que o mercado constrói hoje. Não
propor outra stack sem que isso seja pedido.

**4. Explicações em português direto, sem jargão desnecessário.**
Quando um termo técnico for inevitável, explique em uma linha na primeira vez
que aparecer.

**5. Nenhuma senha ou chave dentro do código.**
Segredos ficam em arquivo próprio de variáveis de ambiente, que nunca vai para o
repositório. Se um segredo for necessário, avise — não invente valor de exemplo
nem deixe placeholder que pareça real.

**6. Somente o que foi pedido em cada etapa.**
Nada de extras por conta própria: sem funcionalidade não solicitada, sem
refatoração oportunista, sem testes ou documentação que não foram pedidos. Ideia
boa fora do escopo vira sugestão no fim da resposta, não código.

**7. Antes de mudanças grandes, explicar em 2 frases o que vai fazer.**
Vale para: criar ou apagar muitos arquivos, mudar a estrutura do projeto, alterar
o banco de dados, instalar dependências novas ou trocar algo que já funciona.

**8. Toda entrega termina com "como testar".**
Um comando ou um passo a passo concreto, que o Emerson consiga executar e ver o
resultado com os próprios olhos.

---

## Arquivos do projeto

| Arquivo | Para que serve |
|---|---|
| `prd.md` | **O quê:** o produto, o escopo da v1 e o que ficou de fora. |
| `design.md` | **Como:** telas, banco de dados e estrutura. *(a criar)* |
| `skill.md` | **Histórico:** cada passo executado, com motivo e como testar. |
| `CLAUDE.md` | Este arquivo: as regras de trabalho. |

---

## Contexto da máquina

- Windows 11. Terminal principal: PowerShell.
- Node.js 22, npm 10, Docker 29, Git 2.54.
- Python responde por `py`, **não** por `python`.
- A pasta do projeto está dentro do OneDrive — atenção com `node_modules` e
  sincronização quando o projeto Next.js for criado.
