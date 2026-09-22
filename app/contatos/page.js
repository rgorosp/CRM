"use client";

/*
  Tela de contatos: formulário de cadastro à esquerda, lista à direita.

  "use client" na primeira linha significa que este arquivo roda no
  navegador. É preciso porque a tela reage ao que o usuário digita e
  clica — coisas que só existem no navegador.
*/

import { useEffect, useRef, useState } from "react";
import { formatarTelefone } from "../../lib/telefone.js";
import { avisarMudanca } from "../../lib/aviso-de-mudanca.js";
import { BotaoSair } from "../botao-sair.js";

const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

/*
  Tira acentos e deixa tudo minúsculo, só para comparar na busca.
  Assim "patricia" encontra "Patrícia" e "ANA" encontra "Ana".
*/
function semAcento(texto) {
  return (texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Só os números de um texto: "(11) 98140-7667" vira "11981407667".
function soNumeros(texto) {
  return (texto ?? "").replace(/\D/g, "");
}

const FORMULARIO_VAZIO = {
  nome: "",
  email: "",
  telefone: "",
  etapa: "novo",
  anotacoes: "",
};

export default function PaginaContatos() {
  const [contatos, setContatos] = useState([]);
  const [busca, setBusca] = useState("");
  const [formulario, setFormulario] = useState(FORMULARIO_VAZIO);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  /*
    O mesmo formulário serve para cadastrar e para alterar. `editando`
    guarda o id do contato que está sendo alterado — ou null, quando o
    formulário está no modo cadastro.
  */
  const [editando, setEditando] = useState(null);

  // Para levar o cursor até o campo Nome quando a edição começa.
  const campoNome = useRef(null);

  // Busca a lista uma vez, quando a tela abre.
  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await fetch("/api/contatos");
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro);
        setContatos(dados);
      } catch (falha) {
        setErro(`Não foi possível carregar os contatos: ${falha.message}`);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function alterarCampo(campo, valor) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
    if (erro) setErro("");
  }

  async function salvar(evento) {
    // Sem isto o navegador recarregaria a página ao enviar o formulário.
    evento.preventDefault();

    if (formulario.nome.trim() === "") {
      setErro("Informe o nome do contato.");
      return;
    }

    // Mesma regra que o banco aplica: ninguém entra sem forma de contato.
    if (formulario.email.trim() === "" && formulario.telefone.trim() === "") {
      setErro("Informe pelo menos um meio de contato: e-mail ou telefone.");
      return;
    }

    setSalvando(true);
    try {
      /*
        Cadastrar e alterar usam o mesmo formulário. A diferença está no
        endereço e no método: POST em /api/contatos cria um contato novo;
        PUT em /api/contatos/5 altera o contato de id 5.
      */
      const alterando = editando !== null;

      const resposta = await fetch(
        alterando ? `/api/contatos/${editando}` : "/api/contatos",
        {
          method: alterando ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formulario),
        }
      );
      const salvo = await resposta.json();

      // A API já devolve a mensagem pronta para ler — mostramos como veio.
      if (!resposta.ok) {
        setErro(salvo.erro ?? "Não foi possível salvar o contato.");
        return;
      }

      if (alterando) {
        // O contato alterado troca de conteúdo, mas fica no mesmo lugar da lista.
        setContatos((atual) =>
          atual.map((item) => (item.id === salvo.id ? salvo : item))
        );
        setEditando(null);
      } else {
        // O contato novo entra no topo da lista, sem recarregar a página.
        setContatos((atual) => [salvo, ...atual]);
      }

      // Se o painel estiver aberto em outra aba, ele atualiza os números na hora.
      avisarMudanca();

      setFormulario(FORMULARIO_VAZIO);
      setErro("");
    } catch (falha) {
      // Aqui só chega falha de comunicação — servidor fora do ar, por exemplo.
      setErro(`Não foi possível falar com o servidor: ${falha.message}`);
    } finally {
      setSalvando(false);
    }
  }

  // Leva os dados do contato para o formulário, que passa ao modo alteração.
  function editar(contato) {
    setEditando(contato.id);
    setFormulario({
      nome: contato.nome,
      email: contato.email ?? "",
      telefone: contato.telefone ?? "",
      etapa: contato.etapa,
      anotacoes: contato.anotacoes ?? "",
    });
    setErro("");
    campoNome.current?.focus();
  }

  // Desiste da alteração: o formulário volta a ser o de cadastro, em branco.
  function cancelarEdicao() {
    setEditando(null);
    setFormulario(FORMULARIO_VAZIO);
    setErro("");
  }

  async function excluir(contato) {
    const confirmado = window.confirm(
      `Excluir o contato ${contato.nome} (id ${contato.id})? Não dá para desfazer.`
    );
    if (!confirmado) return;

    try {
      const resposta = await fetch(`/api/contatos/${contato.id}`, {
        method: "DELETE",
      });
      const resultado = await resposta.json();
      if (!resposta.ok) throw new Error(resultado.erro);

      setContatos((atual) => atual.filter((item) => item.id !== contato.id));
      avisarMudanca();

      // Se o contato apagado era justamente o que estava em edição, o
      // formulário não pode continuar apontando para ele.
      if (editando === contato.id) cancelarEdicao();
    } catch (falha) {
      setErro(`Não foi possível excluir: ${falha.message}`);
    }
  }

  /*
    Filtro da lista.

    A busca acontece aqui no navegador, sobre os contatos já carregados:
    é instantânea e não faz uma consulta nova ao banco a cada tecla. Vale
    enquanto a lista couber na tela sem pesar — se um dia forem dezenas de
    milhares de contatos, a busca precisa passar a ser feita pelo banco.

    Encontra o trecho em qualquer posição: "rgo" acha "Jorge" e "borges".
  */
  const termo = semAcento(busca.trim());
  const termoNumeros = soNumeros(busca);

  const visiveis = contatos.filter((contato) => {
    if (termo === "") return true;

    const alvo = semAcento(
      `${contato.nome} ${contato.email ?? ""} ${contato.telefone ?? ""}`
    );
    if (alvo.includes(termo)) return true;

    // Telefone digitado sem formatação: 981407667 acha (11) 98140-7667.
    return (
      termoNumeros !== "" && soNumeros(contato.telefone).includes(termoNumeros)
    );
  });

  return (
    <main className="pagina">
      <header className="cabecalho">
        <div className="linha-cabecalho">
          <h1 className="titulo">Contatos</h1>
          <BotaoSair />
        </div>
        <p className="apoio">
          Cadastre um contato e acompanhe em que etapa do funil ele está.
        </p>
      </header>

      <div className="colunas">
        {/* ---------- Formulário ---------- */}
        <section className="cartao">
          <h2 className="titulo-secao">
            {editando === null ? "Novo contato" : "Alterando contato"}
          </h2>

          {editando !== null && (
            <p className="nota-campo aviso-edicao">
              Você está alterando o contato de id {editando}. Para cadastrar um
              contato novo, use Cancelar.
            </p>
          )}

          <form onSubmit={salvar} noValidate>
            <div className="campo">
              <label className="rotulo" htmlFor="nome">
                Nome <span className="obrigatorio">obrigatório</span>
              </label>
              <input
                id="nome"
                ref={campoNome}
                className="entrada"
                type="text"
                maxLength={120}
                value={formulario.nome}
                onChange={(e) => alterarCampo("nome", e.target.value)}
              />
            </div>

            <div className="campo">
              <label className="rotulo" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                className="entrada"
                type="email"
                maxLength={160}
                value={formulario.email}
                onChange={(e) => alterarCampo("email", e.target.value)}
              />
            </div>

            <div className="campo">
              <label className="rotulo" htmlFor="telefone">
                Telefone
              </label>
              <input
                id="telefone"
                className="entrada"
                type="text"
                maxLength={20}
                placeholder="(11) 98812-4470"
                value={formulario.telefone}
                onChange={(e) =>
                  // Digite só os números: o formato aparece sozinho.
                  alterarCampo("telefone", formatarTelefone(e.target.value))
                }
              />
              <p className="nota-campo">
                E-mail e telefone são opcionais, mas pelo menos um dos dois
                precisa ser preenchido.
              </p>
            </div>

            <div className="campo">
              <label className="rotulo" htmlFor="etapa">
                Etapa
              </label>
              <select
                id="etapa"
                className="entrada"
                value={formulario.etapa}
                onChange={(e) => alterarCampo("etapa", e.target.value)}
              >
                {ETAPAS.map((etapa) => (
                  <option key={etapa} value={etapa}>
                    {etapa}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label className="rotulo" htmlFor="anotacoes">
                Anotações
              </label>
              <textarea
                id="anotacoes"
                className="entrada area"
                rows={4}
                value={formulario.anotacoes}
                onChange={(e) => alterarCampo("anotacoes", e.target.value)}
              />
            </div>

            {erro && <p className="aviso">{erro}</p>}

            <button className="botao" type="submit" disabled={salvando}>
              {salvando
                ? "Salvando..."
                : editando === null
                  ? "Salvar contato"
                  : "Salvar alterações"}
            </button>

            {editando !== null && (
              <button
                className="botao botao-secundario"
                type="button"
                onClick={cancelarEdicao}
                disabled={salvando}
              >
                Cancelar
              </button>
            )}
          </form>
        </section>

        {/* ---------- Lista ---------- */}
        <section>
          <div className="topo-lista">
            <h2 className="titulo-secao">Lista de contatos</h2>
            <span className="contagem">
              {termo === ""
                ? `${contatos.length} ${contatos.length === 1 ? "contato" : "contatos"}`
                : `${visiveis.length} de ${contatos.length}`}
            </span>
          </div>

          <input
            className="entrada busca"
            type="search"
            placeholder="Buscar por nome, e-mail ou telefone"
            aria-label="Buscar contatos"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          {carregando && <p className="apoio">Carregando...</p>}

          {!carregando && contatos.length === 0 && (
            <div className="cartao vazio">
              <p className="apoio">
                Nenhum contato cadastrado ainda. Use o formulário ao lado.
              </p>
            </div>
          )}

          {!carregando && contatos.length > 0 && visiveis.length === 0 && (
            <div className="cartao vazio">
              <p className="apoio">
                Nenhum contato encontrado para <strong>{busca.trim()}</strong>.
              </p>
            </div>
          )}

          <ul className="lista">
            {visiveis.map((contato) => (
              <li
                key={contato.id}
                className={
                  contato.id === editando
                    ? "cartao contato contato-em-edicao"
                    : "cartao contato"
                }
              >
                <div className="linha-topo">
                  <h3 className="nome">{contato.nome}</h3>
                  <span
                    className={`etiqueta etiqueta-${contato.etapa.replace(" ", "-")}`}
                  >
                    {contato.etapa}
                  </span>
                </div>

                <p className="dados">
                  {contato.email || "sem e-mail"}
                  {" · "}
                  {contato.telefone || "sem telefone"}
                </p>

                {contato.anotacoes && <p className="anotacoes">{contato.anotacoes}</p>}

                <div className="linha-rodape">
                  <span className="meta">
                    id {contato.id} · cadastrado em {contato.cadastrado_em}
                  </span>
                  <div className="acoes">
                    <button
                      className="botao-linha"
                      type="button"
                      onClick={() => editar(contato)}
                    >
                      Editar
                    </button>
                    <button
                      className="botao-linha"
                      type="button"
                      onClick={() => excluir(contato)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
