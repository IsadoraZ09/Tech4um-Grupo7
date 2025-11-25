import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleCreateForum = () => {
    navigate("/create-forum");
  };

  return (
    <section className="hero">
      <div className="content-inner">
        <h1>Opa!</h1>
        <p className="subtitle">Sobre o que gostaria de falar hoje?</p>

        <form className="searchbar" onSubmit={handleSearch}>
          <div className="search-input-wrap">
            <input
              className="search-input"
              type="text"
              placeholder="Em busca de uma sala? Encontre-a aqui"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="btn-outline search-input-btn"
              aria-label="botão de limpar"
              onClick={handleClear}
            >
              -
            </button>
          </div>
          <button 
            type="button"
            className="btn-primary create-btn" 
            aria-label="criar 4um"
            onClick={handleCreateForum}
          >
            Ou crie seu próprio 4um
          </button>
        </form>
      </div>
    </section>
  );
}
