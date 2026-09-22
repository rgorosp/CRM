"use client";

import { useState } from "react";

/*
  Tela de entrada. É a única tela que a portaria (middleware.js) deixa
  abrir sem sessão.
*/
export default function PaginaLogin() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function entrar(evento) {
    evento.preventDefault();
    setEntrando(true);

    try {
      const resposta = await fetch("/api/entrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });
      const resultado = await resposta.json();

      if (!resposta.ok) {
        setErro(resultado.erro ?? "Usuário ou senha inválidos.");
        setSenha("");
        return;
      }

      /*
        Recarrega a página inteira em vez de trocar de tela por dentro do
        React: assim a portaria vê o cookie novo e libera a passagem.
        O destino é a página inicial, onde fica o painel.
      */
      window.location.href = "/";
    } catch (falha) {
      setErro(`Não foi possível falar com o servidor: ${falha.message}`);
    } finally {
      setEntrando(false);
    }
  }

  return (
    <main className="pagina pagina-login">
      <div className="cartao cartao-login">
        <span className="marca" aria-hidden="true" />
        <h1 className="titulo titulo-login">Meu CRM</h1>
        <p className="apoio">Entre para continuar.</p>

        <form onSubmit={entrar} noValidate>
          <div className="campo">
            <label className="rotulo" htmlFor="usuario">
              Usuário
            </label>
            <input
              id="usuario"
              className="entrada"
              type="text"
              autoComplete="username"
              autoFocus
              value={usuario}
              onChange={(e) => {
                setUsuario(e.target.value);
                if (erro) setErro("");
              }}
            />
          </div>

          <div className="campo">
            <label className="rotulo" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              className="entrada"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                if (erro) setErro("");
              }}
            />
          </div>

          {erro && <p className="aviso">{erro}</p>}

          <button className="botao" type="submit" disabled={entrando}>
            {entrando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
