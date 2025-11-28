import React, { useEffect, useState } from "react";
import Card from "./Card";
import { forumAPI } from "../../services/api";

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

  // Ordenar fóruns por quantidade de membros (decrescente)
  const sortedForums = [...forums].sort((a, b) => {
    const membersA = a.membersCount || a.members?.length || 0;
    const membersB = b.membersCount || b.members?.length || 0;
    return membersB - membersA;
  });

  // Distribuir fóruns entre as colunas de forma equilibrada
  const leftForums = [];
  const rightForums = [];

  let leftSlots = 0; // Contador de "slots" na esquerda (Type1=1, Type2=1, Type3=0.5)
  let rightSlots = 0;

  sortedForums.forEach((forum, index) => {
    // Determinar qual coluna tem menos slots preenchidos
    if (leftSlots <= rightSlots) {
      leftForums.push(forum);
      // Calcular slots baseado no padrão da esquerda
      const posInPattern = leftForums.length % 4;
      if (posInPattern === 1) leftSlots += 1; // Type1
      else if (posInPattern === 2) leftSlots += 1; // Type2
      else leftSlots += 0.5; // Type3
    } else {
      rightForums.push(forum);
      // Calcular slots baseado no padrão da direita
      const posInPattern = rightForums.length % 4;
      if (posInPattern === 1) rightSlots += 1; // Type2
      else if (posInPattern === 0) rightSlots += 1; // Type1
      else rightSlots += 0.5; // Type3
    }
  });

  // Função para verificar se tem Type3 ímpar na última posição e redistribuir
  const redistributeOrphanType3 = () => {
    // Verificar coluna esquerda
    const leftLastPattern = leftForums.length % 4;
    if (leftLastPattern === 3 && leftForums.length > 0) {
      // Tem um Type3 sozinho no final da esquerda
      const orphan = leftForums.pop();
      rightForums.push(orphan);
    }

    // Verificar coluna direita
    const rightLastPattern = rightForums.length % 4;
    if (rightLastPattern === 2 && rightForums.length > 0) {
      // Tem um Type3 sozinho no final da direita
      const orphan = rightForums.pop();
      leftForums.push(orphan);
    }
  };

  redistributeOrphanType3();

  // Renderizar coluna esquerda: Type1 → Type2 → 2xType3 (repetindo)
  const renderLeftColumn = () => {
    const elements = [];
    let i = 0;

    while (i < leftForums.length) {
      const positionInPattern = i % 4;

      if (positionInPattern === 0) {
        // Type1
        elements.push(
          <Card key={leftForums[i]._id} forum={leftForums[i]} type={1} />
        );
        i++;
      } else if (positionInPattern === 1) {
        // Type2
        elements.push(
          <Card key={leftForums[i]._id} forum={leftForums[i]} type={2} />
        );
        i++;
      } else if (positionInPattern === 2) {
        // 2xType3
        if (i + 1 < leftForums.length) {
          elements.push(
            <div key={`row-left-${i}`} className="row-small">
              <Card forum={leftForums[i]} type={3} />
              <Card forum={leftForums[i + 1]} type={3} />
            </div>
          );
          i += 2;
        } else {
          // Se só tem um (não deveria acontecer após redistribuição, mas por segurança)
          elements.push(
            <div key={`row-left-${i}`} className="row-small">
              <Card forum={leftForums[i]} type={3} />
            </div>
          );
          i++;
        }
      }
    }

    return elements;
  };

  // Renderizar coluna direita: Type2 → 2xType3 → Type1 (repetindo)
  const renderRightColumn = () => {
    const elements = [];
    let i = 0;

    while (i < rightForums.length) {
      const positionInPattern = i % 4;

      if (positionInPattern === 0) {
        // Type2
        elements.push(
          <Card key={rightForums[i]._id} forum={rightForums[i]} type={2} />
        );
        i++;
      } else if (positionInPattern === 1) {
        // 2xType3
        if (i + 1 < rightForums.length) {
          elements.push(
            <div key={`row-right-${i}`} className="row-small">
              <Card forum={rightForums[i]} type={3} />
              <Card forum={rightForums[i + 1]} type={3} />
            </div>
          );
          i += 2;
        } else {
          // Se só tem um (não deveria acontecer após redistribuição, mas por segurança)
          elements.push(
            <div key={`row-right-${i}`} className="row-small">
              <Card forum={rightForums[i]} type={3} />
            </div>
          );
          i++;
        }
      } else if (positionInPattern === 3) {
        // Type1
        elements.push(
          <Card key={rightForums[i]._id} forum={rightForums[i]} type={1} />
        );
        i++;
      }
    }

    return elements;
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
