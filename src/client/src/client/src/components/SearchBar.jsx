import React from "react";

export default function SearchBar() {
  return (
    <section className="hero">
      <div className="content-inner">
        <h1>Opa!</h1>
        <p className="subtitle">Sobre o que gostaria de falar hoje?</p>

        <div className="searchbar">
          <div className="search-input-wrap">
            <input
              className="search-input"
              type="text"
              placeholder="Em busca de uma sala? Encontre-a aqui"
            />
            {/* small outline button will sit visually inside the right corner of the input */}
            <button
              className="btn-outline search-input-btn"
              aria-label="botão de diminuir"
            >
              -
            </button>
          </div>
          {/* keep the primary CTA to the right of the whole control */}
          <button className="btn-primary create-btn" aria-label="criar 4um">
            Ou crie seu próprio 4um
          </button>
        </div>
      </div>
    </section>
  );
}
