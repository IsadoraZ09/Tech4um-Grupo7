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
          <p>Nenhum fórum encontrado. {searchQuery ? 'Tente outra busca ou' : 'Que tal'} criar o primeiro?</p>
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

  // Padrão original: Type1 → Type2 → 2xType3 (row) → Type2
  const renderLeftColumn = () => {
    return leftColumnForums.map((forum, index) => {
      // Primeiro card: Type1
      if (index === 0) {
        return <Card key={forum._id} forum={forum} type={1} />;
      }
      // Segundo card: Type2
      if (index === 1) {
        return <Card key={forum._id} forum={forum} type={2} />;
      }
      // Terceiro e quarto cards: 2xType3 em row-small
      if (index === 2 && leftColumnForums[3]) {
        return (
          <div key={`row-${index}`} className="row-small">
            <Card forum={forum} type={3} />
            <Card forum={leftColumnForums[3]} type={3} />
          </div>
        );
      }
      // Pular o quarto card (já renderizado no row-small)
      if (index === 3) {
        return null;
      }
      // Demais cards: Type2
      if (index > 3) {
        return <Card key={forum._id} forum={forum} type={2} />;
      }
      return null;
    });
  };

  // Padrão original: Type2 → 2xType3 (row) → Type1 → 2xType3 (row)
  const renderRightColumn = () => {
    return rightColumnForums.map((forum, index) => {
      // Primeiro card: Type2
      if (index === 0) {
        return <Card key={forum._id} forum={forum} type={2} />;
      }
      // Segundo e terceiro cards: 2xType3 em row-small
      if (index === 1 && rightColumnForums[2]) {
        return (
          <div key={`row-${index}`} className="row-small">
            <Card forum={forum} type={3} />
            <Card forum={rightColumnForums[2]} type={3} />
          </div>
        );
      }
      // Pular o terceiro card
      if (index === 2) {
        return null;
      }
      // Quarto card: Type1
      if (index === 3) {
        return <Card key={forum._id} forum={forum} type={1} />;
      }
      // Quinto e sexto cards: 2xType3 em row-small
      if (index === 4 && rightColumnForums[5]) {
        return (
          <div key={`row-${index}`} className="row-small">
            <Card forum={forum} type={3} />
            <Card forum={rightColumnForums[5]} type={3} />
          </div>
        );
      }
      // Pular o sexto card
      if (index === 5) {
        return null;
      }
      // Demais cards: alternar entre Type1 e Type2
      if (index > 5) {
        return <Card key={forum._id} forum={forum} type={index % 2 === 0 ? 1 : 2} />;
      }
      return null;
    });
  };

  return (
    <section className="card-layout" aria-label="Container da grade de cards">
      <div className="card-layout-inner">
        {/* Left column */}
        <div className="column left-column">
          {renderLeftColumn()}
        </div>

        {/* Right column */}
        <div className="column right-column">
          {renderRightColumn()}
        </div>
      </div>
    </section>
  );
}
