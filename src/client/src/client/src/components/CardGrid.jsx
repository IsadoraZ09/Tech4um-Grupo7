import React from "react";

export default function CardGrid() {
  return (
    <section className="card-layout" aria-label="Container da grade de cards">
      {/* grid / two column layout (left / right) */}
      <div className="card-layout-inner">
        {/* Left column */}
        <div className="column left-column">
          <article className="card card-type1">
            <span className="tag">Tópico em destaque!</span>
            <h3 className="title">product-development-stuff</h3>
            <div className="people">Lara Alves • 48 pessoas</div>
            <p className="desc">
              O que temos de bom nessa sala, pessoal? Bora falar de programação,
              criação de coisas legais e projetos pessoais e desafios que
              queiram compartilhar
            </p>
            <p className="desc small">
              <span className="creator-label">Criado por:</span>{" "}
              <span className="creator-name">nome do criador</span>
            </p>
            <div className="unread-badge" aria-hidden>
              5
            </div>
          </article>

          <article className="card card-type2">
            <h4 className="title">Manda um nome para esse 4um</h4>
            <div className="people">Um nome • 70 pessoas</div>
            <div className="creator bottom">
              <span className="creator-label">Criado por:</span>
              <span className="creator-name"> nome do Criador</span>
            </div>
            <div className="unread-badge" aria-hidden>
              3
            </div>
          </article>

          <div className="row-small">
            <article className="card card-type3">
              <h4 className="title">Thinking out.</h4>
              <div className="people">Um nome • 70 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name"> nome do Criador</span>
              </div>
              <div className="unread-badge" aria-hidden>
                7
              </div>
            </article>
            <article className="card card-type3">
              <h4 className="title">Resurgance</h4>
              <div className="people">Um nome • 70 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name"> nome do Criador</span>
              </div>
              <div className="unread-badge" aria-hidden>
                1
              </div>
            </article>
          </div>

          <article className="card card-type2">
            <h4 className="title">Manda um nome para esse 4um</h4>
            <div className="people">Um nome • 70 pessoas</div>
            <div className="creator bottom">
              <span className="creator-label">Criado por:</span>
              <span className="creator-name"> nome do Criador</span>
            </div>
            <div className="unread-badge" aria-hidden>
              2
            </div>
          </article>
        </div>

        {/* Right column */}
        <div className="column right-column">
          <article className="card card-type2">
            <h4 className="title">Manda uma nota para esse fórum</h4>
            <div className="people">Um nome • 70 pessoas</div>
            <div className="creator bottom">
              <span className="creator-label">Criado por:</span>
              <span className="creator-name"> nome do Criador</span>
            </div>
            <div className="unread-badge" aria-hidden>
              9
            </div>
          </article>

          <div className="row-small">
            <article className="card card-type3">
              <h4 className="title">Sistemas</h4>
              <div className="people">Um nome • 70 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name"> nome do Criador</span>
              </div>
              <div className="unread-badge" aria-hidden>
                4
              </div>
            </article>
            <article className="card card-type3">
              <h4 className="title">Team-multi</h4>
              <div className="people">Um nome • 70 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name"> Ana Beatriz</span>
              </div>
              <div className="unread-badge" aria-hidden>
                0
              </div>
            </article>
          </div>

          <article className="card card-type1">
            <span className="tag">Tópico em destaque!</span>
            <h3 className="title">Designers_na_firma</h3>
            <div className="people">Lucas Gomes • 55 pessoas</div>
            <p className="desc">
              O que temos de bom nessa sala, pessoal? Bora falar de programação,
              criação de coisas legais e projetos pessoais e desafios que
              queiram compartilhar{" "}
            </p>
            <p className="desc small">
              <span className="creator-label">Criado por:</span>{" "}
              <span className="creator-name">nome do criador</span>
            </p>
            <div className="unread-badge" aria-hidden>
              12
            </div>
          </article>

          <div className="row-small">
            <article className="card card-type3">
              <h4 className="title">Referências Boas</h4>
              <div className="people">Um nome • 70 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name"> Carlos M.</span>
              </div>
              <div className="unread-badge" aria-hidden>
                6
              </div>
            </article>
            <article className="card card-type3">
              <h4 className="title">DevOps & Deploy</h4>
              <div className="people">Um nome • 70 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name"> Equipe Ops</span>
              </div>
              <div className="unread-badge" aria-hidden>
                18
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
