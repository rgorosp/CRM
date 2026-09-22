---
name: design-crm
description: Identidade visual do CRM — cores, tipografia, formas e proibições. Fonte da verdade sobre COMO as telas devem parecer. Seguir em TODAS as telas.
---

# Identidade Visual do CRM

**Regra geral:** este documento vale para **todas** as telas do projeto, sem exceção.
Antes de criar ou alterar qualquer tela, leia esta página.

**Última atualização:** 2026-09-07

---

## Clima

Ferramenta profissional, limpa e confiante. **Um produto, não um template.**

Na prática, isso significa: nada de enfeite. Cada elemento na tela existe porque tem
função. O visual transmite competência pela clareza, não por efeito visual.

---

## Cores

### Base

| Uso | Cor | Onde aparece |
|---|---|---|
| Fundo da página | `#FAFAF7` | Fundo geral — claro, levemente quente |
| Superfície | `#FFFFFF` | Cartões, caixas, painéis, campos de formulário |
| Borda | `#E6E4DE` | Contorno sutil de toda superfície e divisórias |
| Texto principal | `#17181C` | Títulos e texto de leitura — grafite, não preto puro |
| Texto de apoio | `#6B6E76` | Legendas, descrições, rótulos secundários |

### Destaque — uma só

| Uso | Cor |
|---|---|
| Ações e elementos ativos | `#1D4ED8` (azul-cobalto) |
| Estado hover / pressionado | `#1E40AF` (mais escuro) |

**Nenhuma outra cor de marca.** Botão principal, link, item de menu selecionado, campo
em foco, indicador de página atual: tudo usa o cobalto. Se surgir a tentação de uma
segunda cor "só nesse caso", a resposta é não.

### Etapas do funil

| Etapa | Cor |
|---|---|
| novo | `#64748B` |
| em contato | `#D97706` |
| proposta | `#7C3AED` |
| cliente | `#15803D` |

**Restrição importante:** estas quatro cores aparecem **somente nas etiquetas de etapa**
(a pequena marcação que mostra em que ponto do funil o contato está). Nunca em botões,
títulos, fundos de tela, gráficos decorativos ou qualquer outro lugar.

---

## Tipografia

**Fonte única: Manrope** (Google Fonts). Em tudo — títulos, textos, botões, campos,
números. Nenhuma segunda fonte.

| Elemento | Peso | Tamanho de referência |
|---|---|---|
| Título de página | 800 (extra-bold) | 40px |
| Título de seção | 700 (bold) | 24px |
| Texto de leitura | 400 (normal) | 16px |
| Texto de apoio | 400 (normal) | 15px |
| Rótulo pequeno | 600 (semi-bold) | 13px |

**Princípios:** tamanhos generosos — texto de leitura nunca abaixo de 15px. Hierarquia
clara: bateu o olho, já sabe o que é título e o que é apoio. A diferença entre níveis
vem do peso e do tamanho, não da cor.

---

## Formas e espaçamento

- **Cantos:** levemente arredondados, `10px`. O mesmo raio em cartões, botões e campos.
- **Bordas em vez de sombras:** a separação entre elementos é feita com borda de 1px
  em `#E6E4DE`. Sombra, só se for imperceptível — e mesmo assim, prefira a borda.
- **Respiro:** bastante espaço entre os elementos. Espaço vazio é parte do design, não
  desperdício. Escala de espaçamento em múltiplos de 8px: 8, 16, 24, 32, 48, 64.
- **Largura de leitura:** o conteúdo não se espalha pela tela inteira. Limite em torno
  de 1100px, centralizado.

---

## PROIBIDO

Se algum destes aparecer na tela, **está errado** e precisa ser removido:

- ❌ Gradientes (de qualquer tipo, em qualquer elemento)
- ❌ Efeito de vidro / desfoque de fundo
- ❌ Emojis na interface
- ❌ Sombras exageradas
- ❌ Animações chamativas
- ❌ Uma segunda cor de marca
- ❌ Uma segunda fonte

**Teste final:** se a tela parecer "template gerado por IA", está errado. Refaça.

---

## Como isso vira código

As cores e medidas ficam em **um lugar só**: as variáveis no topo de
`app/globals.css`. Nenhuma tela escreve um código de cor direto — sempre usa a
variável. Assim, mudar a identidade é mudar um arquivo.

| Variável | Valor |
|---|---|
| `--fundo` | `#FAFAF7` |
| `--superficie` | `#FFFFFF` |
| `--borda` | `#E6E4DE` |
| `--texto` | `#17181C` |
| `--texto-apoio` | `#6B6E76` |
| `--destaque` | `#1D4ED8` |
| `--destaque-hover` | `#1E40AF` |
| `--etapa-novo` | `#64748B` |
| `--etapa-em-contato` | `#D97706` |
| `--etapa-proposta` | `#7C3AED` |
| `--etapa-cliente` | `#15803D` |
| `--raio` | `10px` |

---

## Checklist antes de entregar qualquer tela

- [ ] Fundo `--fundo`, cartões `--superficie` com borda `--borda`?
- [ ] Toda cor veio de variável, nenhuma escrita direto no código?
- [ ] Só o cobalto como destaque?
- [ ] Cores de etapa apenas nas etiquetas de etapa?
- [ ] Manrope em tudo, hierarquia visível?
- [ ] Cantos de 10px, bordas no lugar de sombras?
- [ ] Espaçamento generoso?
- [ ] Nenhum item da lista PROIBIDO?
