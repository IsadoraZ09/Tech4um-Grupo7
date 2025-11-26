import React from "react";
import { Link } from "react-router-dom";

export default function CardGrid() {
  return (
    <section className="card-layout" aria-label="Container da grade de cards">
      {/* grid / two column layout (left / right) */}
      <div className="card-layout-inner">
        {/* Left column */}
        <div className="column left-column">
          <Link
            to="/sala/product-development-stuff"
            className="card card-type1"
            style={{ textDecoration: "none", color: "inherit" }}
          >
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
              <span className="creator-name">Lara Alves</span>
            </p>
            <div className="unread-badge" aria-hidden>
              5
            </div>
          </Link>

          <Link
            to="/sala/designers-na-firma"
            className="card card-type2"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h4 className="title">Designers_na_firma</h4>
            <div className="people">Lucas Gomes • 3 pessoas</div>
            <div className="creator bottom">
              <span className="creator-label">Criado por:</span>
              <span className="creator-name">Lucas Gomes</span>
            </div>
            <div className="unread-badge" aria-hidden>
              3
            </div>
          </Link>

          <div className="row-small">
            <Link
              to="/sala/referencias-boas"
              className="card card-type3"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h4 className="title">Referências Boas</h4>
              <div className="people">Carlos M. • 2 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name">Carlos M.</span>
              </div>
              <div className="unread-badge" aria-hidden>
                7
              </div>
            </Link>
            <Link
              to="/sala/assistencia"
              className="card card-type3"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h4 className="title">Assistência Tech</h4>
              <div className="people">Equipe Ops • 12 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name">Equipe Ops</span>
              </div>
              <div className="unread-badge" aria-hidden>
                1
              </div>
            </Link>
          </div>

          <Link
            to="/sala/manda-um-nome-2"
            className="card card-type2"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h4 className="title">Manda um nome para esse 4um</h4>
            <div className="people">Um nome • 70 pessoas</div>
            <div className="creator bottom">
              <span className="creator-label">Criado por:</span>
              <span className="creator-name"> nome do Criador</span>
            </div>
            <div className="unread-badge" aria-hidden>
              2
            </div>
          </Link>
        </div>

        {/* Right column */}
        <div className="column right-column">
          <Link
            to="/sala/manda-uma-nota"
            className="card card-type2"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h4 className="title">Manda uma nota para esse fórum</h4>
            <div className="people">Um nome • 70 pessoas</div>
            <div className="creator bottom">
              <span className="creator-label">Criado por:</span>
              <span className="creator-name"> nome do Criador</span>
            </div>
            <div className="unread-badge" aria-hidden>
              9
            </div>
          </Link>

          <div className="row-small">
            <Link
              to="/sala/sistemas"
              className="card card-type3"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h4 className="title">Sistemas</h4>
              <div className="people">Um nome • 70 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name"> nome do Criador</span>
              </div>
              <div className="unread-badge" aria-hidden>
                4
              </div>
            </Link>
            <Link
              to="/sala/team-multi"
              className="card card-type3"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h4 className="title">Team-multi</h4>
              <div className="people">Um nome • 70 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name"> Ana Beatriz</span>
              </div>
              <div className="unread-badge" aria-hidden>
                0
              </div>
            </Link>
          </div>

          <Link
            to="/sala/designers-na-firma"
            className="card card-type1"
            style={{ textDecoration: "none", color: "inherit" }}
          >
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
          </Link>

          <div className="row-small">
            <Link
              to="/sala/referencias-boas"
              className="card card-type3"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h4 className="title">Referências Boas</h4>
              <div className="people">Um nome • 70 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name"> Carlos M.</span>
              </div>
              <div className="unread-badge" aria-hidden>
                6
              </div>
            </Link>
            <Link
              to="/sala/devops-deploy"
              className="card card-type3"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h4 className="title">DevOps & Deploy</h4>
              <div className="people">Um nome • 70 pessoas</div>
              <div className="creator bottom">
                <span className="creator-label">Criado por:</span>
                <span className="creator-name"> Equipe Ops</span>
              </div>
              <div className="unread-badge" aria-hidden>
                18
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
