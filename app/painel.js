"use client";

/*
  O painel da página inicial: o total de contatos e quantos há em cada
  etapa do funil.

  Os números se atualizam sozinhos, por três caminhos:
  1. Recado da tela de contatos: quando ela grava algo em outra aba ou
     janela, o painel busca os números na hora (lib/aviso-de-mudanca.js).
  2. Volta para a aba: ao voltar a olhar esta aba, busca de novo.
  3. Relógio: a cada 15 segundos, enquanto a aba está à vista. Cobre o
     que muda fora deste navegador (outro computador, direto no banco).
*/

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ETAPAS } from "../lib/contatos.js";
import { ouvirMudancas } from "../lib/aviso-de-mudanca.js";

const INTERVALO_EM_MS = 15000;

// Por quanto tempo a diferença (+1, −1) fica ao lado do número que mudou.
const DIFERENCA_EM_MS = 4000;

function percentual(parte, total) {
  if (!total) return "—";
  return `${Math.round((parte / total) * 100)}% do total`;
}

function comSinal(numero) {
  return numero > 0 ? `+${numero}` : `−${Math.abs(numero)}`;
}

/*
  Um número do painel. Quando o valor muda, ele entra com um movimento
  curto de baixo para cima e ganha ao lado a diferença, que some sozinha.
  A troca de `key` é o que faz o React recriar o número e o movimento
  acontecer de novo a cada mudança.
*/
function Numero({ valor, diferenca, className }) {
  return (
    <p className={className}>
      <span key={valor ?? "vazio"} className={diferenca ? "valor valor-mudou" : "valor"}>
        {valor ?? "–"}
      </span>
      {diferenca ? <span className="diferenca">{comSinal(diferenca)}</span> : null}
    </p>
  );
}

export function Painel() {
  const [numeros, setNumeros] = useState(null);
  const [diferencas, setDiferencas] = useState({});
  const [atualizadoEm, setAtualizadoEm] = useState(null);
  const [semConexao, setSemConexao] = useState(false);

  // Os números da busca anterior, para saber o que mudou.
  const anteriores = useRef(null);

  useEffect(() => {
    let ultimoPedido = 0;
    let apagarDiferencas;

    async function buscar() {
      /*
        Duas buscas podem se cruzar (o recado e o relógio ao mesmo tempo).
        Só a mais recente vale, para um resultado velho não cobrir um novo.
      */
      const pedido = ++ultimoPedido;

      try {
        const resposta = await fetch("/api/painel", { cache: "no-store" });

        // Sessão vencida: a portaria respondeu 401. Volta para o login.
        if (resposta.status === 401) {
          window.location.href = "/login";
          return;
        }

        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro);
        if (pedido !== ultimoPedido) return;

        const antes = anteriores.current;
        if (antes) {
          const mudou = {};
          if (dados.total !== antes.total) mudou.total = dados.total - antes.total;
          for (const etapa of ETAPAS) {
            const diferenca = dados.etapas[etapa] - antes.etapas[etapa];
            if (diferenca !== 0) mudou[etapa] = diferenca;
          }

          if (Object.keys(mudou).length > 0) {
            setDiferencas(mudou);
            clearTimeout(apagarDiferencas);
            apagarDiferencas = setTimeout(() => setDiferencas({}), DIFERENCA_EM_MS);
          }
        }

        anteriores.current = dados;
        setNumeros(dados);
        setAtualizadoEm(new Date());
        setSemConexao(false);
      } catch {
        // Os últimos números continuam na tela; o relógio tenta de novo.
        if (pedido === ultimoPedido) setSemConexao(true);
      }
    }

    buscar();

    const pararDeOuvir = ouvirMudancas(buscar);

    function aoVoltarParaAba() {
      if (document.visibilityState === "visible") buscar();
    }
    document.addEventListener("visibilitychange", aoVoltarParaAba);

    const relogio = setInterval(() => {
      if (document.visibilityState === "visible") buscar();
    }, INTERVALO_EM_MS);

    // Ao sair da página, desliga tudo que foi ligado acima.
    return () => {
      pararDeOuvir();
      document.removeEventListener("visibilitychange", aoVoltarParaAba);
      clearInterval(relogio);
      clearTimeout(apagarDiferencas);
    };
  }, []);

  const total = numeros?.total;

  let situacao = "Carregando...";
  if (semConexao) situacao = "Sem conexão com o servidor. Tentando de novo...";
  else if (atualizadoEm) {
    situacao = `Ao vivo · atualizado às ${atualizadoEm.toLocaleTimeString("pt-BR")}`;
  }

  return (
    <section aria-labelledby="titulo-painel">
      <div className="painel-topo">
        <div>
          <h1 id="titulo-painel" className="titulo">
            Painel
          </h1>
          <p className="apoio">
            Quantos contatos você tem e em que etapa do funil cada um está.
          </p>
        </div>
        <p className={semConexao ? "situacao situacao-sem-conexao" : "situacao"}>
          <span className="ponto" aria-hidden="true" />
          {situacao}
        </p>
      </div>

      <div className="quadro">
        <div className="quadro-total">
          <p className="rotulo-painel">Total de contatos</p>
          <Numero className="numero-total" valor={total} diferenca={diferencas.total} />
          {total === 0 && (
            <p className="apoio">
              Nenhum contato cadastrado ainda.{" "}
              <Link className="link-seta" href="/contatos">
                Cadastrar o primeiro
              </Link>
            </p>
          )}
        </div>

        {/* Lista numerada: a ordem das etapas é a ordem do funil. */}
        <ol className="quadro-etapas">
          {ETAPAS.map((etapa, indice) => (
            <li key={etapa} className="celula-etapa">
              <div className="celula-topo">
                <span className={`etiqueta etiqueta-${etapa.replace(" ", "-")}`}>
                  {etapa}
                </span>
                <span className="ordem">{String(indice + 1).padStart(2, "0")}</span>
              </div>
              <Numero
                className="numero-etapa"
                valor={numeros?.etapas[etapa]}
                diferenca={diferencas[etapa]}
              />
              <p className="percentual">
                {numeros ? percentual(numeros.etapas[etapa], total) : " "}
              </p>
            </li>
          ))}
        </ol>

        <div className="quadro-rodape">
          <p className="nota-painel">
            Os números se atualizam sozinhos a cada cadastro ou mudança de etapa.
          </p>
          <Link className="link-seta" href="/contatos">
            Ver contatos <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
