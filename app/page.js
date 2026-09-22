import Link from "next/link";
import { BotaoSair } from "./botao-sair.js";
import { Painel } from "./painel.js";

/*
  Página inicial: é para cá que o login leva. A barra do topo é fixa; o
  que muda sozinho (os números) mora em painel.js.
*/
export default function PaginaInicial() {
  return (
    <main className="pagina">
      <header className="barra">
        <span className="barra-marca">
          <span className="marca" aria-hidden="true" />
          Meu CRM
        </span>
        <nav className="barra-nav">
          {/* Link é o jeito do Next.js de navegar entre telas sem recarregar tudo. */}
          <Link className="link-nav" href="/contatos">
            Contatos
          </Link>
          <BotaoSair />
        </nav>
      </header>

      <Painel />
    </main>
  );
}
