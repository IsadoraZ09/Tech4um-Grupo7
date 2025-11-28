import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/AuthContext.jsx";
import ModalCreateForum from "../ModalForum/ModalForum.jsx";
import styles from "./SearchBar.module.css";
import "../../../styles/global.css"; // Importar global para classes compartilhadas

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user, openLogin } = useAuth();
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
    if (!user) {
      // Se não estiver logado, abre o modal de login
      openLogin();
    } else {
      // Se estiver logado, abre o modal de criar fórum
      setIsCreateModalOpen(true);
    }
  };

  return (
    <>
      <section className={styles.hero}>
        <div className="content-inner">
          <h1>Opa!</h1>
          <p className={styles.subtitle}>Sobre o que gostaria de falar hoje?</p>

          <form className={styles.searchbar} onSubmit={handleSearch}>
            <div className={styles.searchInputWrap}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Em busca de uma sala? Encontre-a aqui"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              {searchTerm && (
                <button
                  type="button"
                  className={styles.btnClearInput}
                  aria-label="limpar busca"
                  onClick={handleClear}
                  title="Limpar busca"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}

              <button
                type="submit"
                className={styles.searchInputBtn}
                aria-label="botão de buscar"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 5a6 6 0 100 12 6 6 0 000-12z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 16l6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <button 
              type="button"
              className={styles.createBtn} 
              aria-label="criar 4um"
              onClick={handleCreateForum}
            >
              Ou crie seu próprio 4um
            </button>
          </form>

          {/* Opcionalmente, mostrar resultados de busca se necessário */}
          {searchTerm && (
            <div className={styles.searchResults}>
              Buscando por: <span className={styles.searchResultsQuery}>"{searchTerm}"</span>
              <button 
                className={styles.searchResultsClear}
                onClick={handleClear}
              >
                Limpar busca
              </button>
            </div>
          )}
        </div>
      </section>

      {user && (
        <ModalCreateForum 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </>
  );
}
