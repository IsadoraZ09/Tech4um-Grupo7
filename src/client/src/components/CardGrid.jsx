import React, { useEffect, useState } from "react";
import Card from "./Card";
import { forumAPI } from "../services/api";

export default function CardGrid({ searchQuery }) {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForums();
  }, [searchQuery]);

  const fetchForums = async () => {
    try {
      setLoading(true);
      const response = await forumAPI.getAllForums(searchQuery);
      setForums(response.data.data.forums);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar fóruns');
      console.error('Erro ao buscar fóruns:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="card-layout" aria-label="Container da grade de cards">
        <div className="card-layout-inner">
          <p>Carregando fóruns...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card-layout" aria-label="Container da grade de cards">
        <div className="card-layout-inner">
          <p className="error-message">{error}</p>
        </div>
      </section>
    );
  }

  if (forums.length === 0) {
    return (
      <section className="card-layout" aria-label="Container da grade de cards">
        <div className="card-layout-inner">
          <p>Nenhum fórum encontrado. Que tal criar o primeiro?</p>
        </div>
      </section>
    );
  }

  // Dividir fóruns entre as duas colunas
  const leftColumnForums = [];
  const rightColumnForums = [];

  forums.forEach((forum, index) => {
    if (index % 2 === 0) {
      leftColumnForums.push(forum);
    } else {
      rightColumnForums.push(forum);
    }
  });

  return (
    <section className="card-layout" aria-label="Container da grade de cards">
      <div className="card-layout-inner">
        {/* Left column */}
        <div className="column left-column">
          {leftColumnForums.map((forum, index) => (
            <Card 
              key={forum._id} 
              forum={forum} 
              type={index === 0 ? 1 : (index % 3 === 0 ? 3 : 2)}
            />
          ))}
        </div>

        {/* Right column */}
        <div className="column right-column">
          {rightColumnForums.map((forum, index) => (
            <Card 
              key={forum._id} 
              forum={forum} 
              type={index === 0 ? 2 : (index % 3 === 0 ? 1 : 3)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
