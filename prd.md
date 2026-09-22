---
name: prd-crm
description: Documento de produto do CRM — o que é, para quem, o que entra na primeira versão e o que fica de fora. Fonte da verdade sobre o QUE construir.
---

# PRD — CRM

*PRD = documento que descreve o produto. Responde **o que** vamos construir e **por quê**.
Não descreve **como** (isso é o `design.md`).*

**Última atualização:** 2026-09-21 (Passo 13)

---

## O que é e pra quem

O CRM é um sistema web para organizar contatos e oportunidades de negócio em um só
lugar, substituindo a planilha e a memória. É para uso próprio do Emerson — um único
administrador que precisa saber, a qualquer momento, quem são seus contatos e em que
pé está cada negociação. O objetivo não é ter muitos recursos, e sim responder rápido
a três perguntas: quem eu tenho, o que está em andamento e o que precisa de atenção
hoje.

---

## Funcionalidades da primeira versão

Lista de entrega. Cada item vira uma etapa de trabalho e só é marcado quando estiver
funcionando e testado.

- [x] **Cadastro e listagem de contatos** — tela `/contatos` que cadastra (Passo 6),
      lista do mais recente para o mais antigo, busca por nome, e-mail ou telefone
      (Passo 7), altera (Passo 9) e exclui pelo id.
- [ ] **Funil com etapas** — cada contato fica em uma etapa: `novo`, `em contato`,
      `proposta`, `cliente`. Dá para mover o contato de uma etapa para outra.
- [ ] **Anotações por contato** — histórico de observações, cada uma com data, ligada
      a um contato específico.
- [x] **Login de administrador** — feito no Passo 10: usuário e senha únicos, senha
      guardada embaralhada (nunca em texto), sessão por cookie assinado e botão Sair.
- [ ] **Follow-up gerado por IA** — a partir dos dados e das anotações do contato, o
      sistema sugere o texto da próxima mensagem de acompanhamento.
- [x] **Painel com os números do funil** — feito no Passo 12: a tela inicial (para
      onde o login leva) mostra o total de contatos e quantos há em cada etapa, e os
      números se atualizam sozinhos a cada cadastro, alteração ou exclusão.
- [ ] **Publicação na internet** — o sistema no ar, acessível por um endereço, e não
      apenas rodando na máquina local.

---

## O que NÃO entra na primeira versão

Esta lista existe para proteger o projeto. Toda ideia boa que aparecer no meio do
caminho vem para cá em vez de virar trabalho agora.

| Fica de fora | Motivo |
|---|---|
| Vários usuários e equipes | A v1 tem um único dono. Multiusuário muda o banco inteiro. |
| Perfis e permissões | Sem vários usuários, não há o que permitir ou negar. |
| Integração com WhatsApp, e-mail ou telefone | Cada integração é um projeto por si só. |
| Envio automático de mensagens | A IA **sugere** o texto; quem envia é você, manualmente. |
| Importação em massa (planilha, CSV) | Cadastro manual resolve no começo. |
| Etapas de funil personalizáveis | As quatro etapas são fixas na v1. |
| Campos customizáveis no contato | Campos fixos e poucos. Flexibilidade vem depois. |
| Agenda, calendário e lembretes com hora marcada | Aumenta muito o escopo. |
| Propostas, orçamentos e faturamento | É outro produto. |
| Relatórios avançados e exportação | O painel do funil já responde o essencial. |
| Aplicativo mobile | O site funcionando bem no celular basta. |
| Histórico de auditoria (quem mudou o quê) | Só faz sentido com vários usuários. |

**Regra:** nada desta tabela é construído sem antes sair dela — e sair dela é decisão
sua, registrada como um passo no `skill.md`.

---

## Ainda a definir

- ~~Quais campos o contato terá~~ — resolvido no Passo 5: `nome` (obrigatório),
  `email`, `telefone`, `etapa`, `anotacoes` e `data_cadastro`.
- ~~Regras de cadastro~~ — resolvidas no Passo 8: o e-mail não pode se repetir e
  todo contato precisa de pelo menos um meio de contato (e-mail **ou** telefone).
  Quem recusa é o próprio banco, não só a tela. Completadas no Passo 13: nome até
  120 caracteres; e-mail no formato `nome@dominio.algo`, até 160; telefone com pelo
  menos 10 números (DDD + número), até 20 caracteres; etapa fora das quatro é
  recusada; anotações no limite da coluna.
- ~~Como será o `design.md`~~ — criado no Passo 3.
- **Anotações:** hoje são um campo único de texto dentro do contato (Passo 5). O
  histórico com uma data por anotação, como descrito na lista de funcionalidades,
  vai exigir uma tabela separada quando essa funcionalidade for construída.
