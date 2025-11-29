import React, { useEffect, useState } from "react";
import Card from "../Card/Card.jsx";
import { forumAPI } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import styles from "./CardGrid.module.css";

export default function CardGrid({ searchQuery }) {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, openLogin, loading: authLoading } = useAuth(); // Adicionar authLoading

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

  const handleForumClick = async (forum) => {
    console.log('handleForumClick - forum recebido:', forum); // Debug

    // Verificar se o usuário está logado
    if (!user) {
      openLogin();
      return;
    }

    // Verificar se o forum existe e tem ID
    if (!forum?._id) {
      console.error('Forum inválido:', forum);
      alert('Erro: fórum inválido. Tente novamente.');
      return;
    }

    // Esta função só é chamada quando o usuário NÃO é membro
    // Então sempre tentamos juntar o usuário ao fórum
    try {
      console.log('Tentando entrar no fórum:', forum._id); // Debug
      await forumAPI.joinForum(forum._id);
      console.log('Entrou no fórum com sucesso, redirecionando...'); // Debug
      // Após entrar com sucesso, redirecionar para o fórum
      window.location.href = `/sala/${forum._id}`;
    } catch (error) {
      console.error('Erro ao entrar no fórum:', error);
      alert(error.response?.data?.message || 'Erro ao entrar no fórum');
    }
  };

  // Função para verificar se o usuário é membro do fórum
  const isUserMemberOfForum = (forum) => {
    // Se o usuário ainda está carregando ou não existe, retornar false
    if (authLoading || !user) {
      return false;
    }

    // Se o fórum não tem membros, retornar false
    if (!forum?.members) {
      return false;
    }

    const members = Array.isArray(forum.members) ? forum.members : [];
    return members.some(member => {
      const memberId = typeof member === 'object' && member !== null ? member._id : member;
      return String(memberId) === String(user.id);
    });
  };

  // Se ainda está carregando a autenticação ou os fóruns, mostrar loading
  if (authLoading || loading) {
    return (
      <section className={styles.cardLayout} aria-label="Container da grade de cards">
        <div className={styles.cardLayoutInner}>
          <p className={styles.loadingMessage}>Carregando fóruns...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.cardLayout} aria-label="Container da grade de cards">
        <div className={styles.cardLayoutInner}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </section>
    );
  }

  if (forums.length === 0) {
    return (
      <section className={styles.cardLayout} aria-label="Container da grade de cards">
        <div className={styles.cardLayoutInner}>
          <p className={styles.emptyMessage}>
            Nenhum fórum encontrado. {searchQuery ? 'Tente outra busca ou' : 'Que tal'} criar o primeiro?
          </p>
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

  let leftSlots = 0;
  let rightSlots = 0;

  sortedForums.forEach((forum, index) => {
    if (leftSlots <= rightSlots) {
      leftForums.push(forum);
      const posInPattern = leftForums.length % 4;
      if (posInPattern === 1) leftSlots += 1;
      else if (posInPattern === 2) leftSlots += 1;
      else leftSlots += 0.5;
    } else {
      rightForums.push(forum);
      const posInPattern = rightForums.length % 4;
      if (posInPattern === 1) rightSlots += 1;
      else if (posInPattern === 0) rightSlots += 1;
      else rightSlots += 0.5;
    }
  });

  // Função para verificar se tem Type3 ímpar na última posição e redistribuir
  const redistributeOrphanType3 = () => {
    const leftLastPattern = leftForums.length % 4;
    if (leftLastPattern === 3 && leftForums.length > 0) {
      const orphan = leftForums.pop();
      rightForums.push(orphan);
    }

    const rightLastPattern = rightForums.length % 4;
    if (rightLastPattern === 2 && rightForums.length > 0) {
      const orphan = rightForums.pop();
      leftForums.push(orphan);
    }
  };

  redistributeOrphanType3();

  // Renderizar coluna esquerda
  const renderLeftColumn = () => {
    const elements = [];
    let i = 0;

    while (i < leftForums.length) {
      const positionInPattern = i % 4;

      if (positionInPattern === 0) {
        const currentForum = leftForums[i];
        elements.push(
          <Card 
            key={currentForum._id} 
            forum={currentForum} 
            type={1}
            isMember={isUserMemberOfForum(currentForum)}
            onClick={() => handleForumClick(currentForum)}
          />
        );
        i++;
      } else if (positionInPattern === 1) {
        const currentForum = leftForums[i];
        elements.push(
          <Card 
            key={currentForum._id} 
            forum={currentForum} 
            type={2}
            isMember={isUserMemberOfForum(currentForum)}
            onClick={() => handleForumClick(currentForum)}
          />
        );
        i++;
      } else if (positionInPattern === 2) {
        if (i + 1 < leftForums.length) {
          const forum1 = leftForums[i];
          const forum2 = leftForums[i + 1];
          elements.push(
            <div key={`row-left-${i}`} className={styles.rowSmall}>
              <Card 
                forum={forum1} 
                type={3}
                isMember={isUserMemberOfForum(forum1)}
                onClick={() => handleForumClick(forum1)}
              />
              <Card 
                forum={forum2} 
                type={3}
                isMember={isUserMemberOfForum(forum2)}
                onClick={() => handleForumClick(forum2)}
              />
            </div>
          );
          i += 2;
        } else {
          const currentForum = leftForums[i];
          elements.push(
            <div key={`row-left-${i}`} className={styles.rowSmall}>
              <Card 
                forum={currentForum} 
                type={3}
                isMember={isUserMemberOfForum(currentForum)}
                onClick={() => handleForumClick(currentForum)}
              />
            </div>
          );
          i++;
        }
      }
    }

    return elements;
  };

  // Renderizar coluna direita
  const renderRightColumn = () => {
    const elements = [];
    let i = 0;

    while (i < rightForums.length) {
      const positionInPattern = i % 4;

      if (positionInPattern === 0) {
        const currentForum = rightForums[i];
        elements.push(
          <Card 
            key={currentForum._id} 
            forum={currentForum} 
            type={2}
            isMember={isUserMemberOfForum(currentForum)}
            onClick={() => handleForumClick(currentForum)}
          />
        );
        i++;
      } else if (positionInPattern === 1) {
        if (i + 1 < rightForums.length) {
          const forum1 = rightForums[i];
          const forum2 = rightForums[i + 1];
          elements.push(
            <div key={`row-right-${i}`} className={styles.rowSmall}>
              <Card 
                forum={forum1} 
                type={3}
                isMember={isUserMemberOfForum(forum1)}
                onClick={() => handleForumClick(forum1)}
              />
              <Card 
                forum={forum2} 
                type={3}
                isMember={isUserMemberOfForum(forum2)}
                onClick={() => handleForumClick(forum2)}
              />
            </div>
          );
          i += 2;
        } else {
          const currentForum = rightForums[i];
          elements.push(
            <div key={`row-right-${i}`} className={styles.rowSmall}>
              <Card 
                forum={currentForum} 
                type={3}
                isMember={isUserMemberOfForum(currentForum)}
                onClick={() => handleForumClick(currentForum)}
              />
            </div>
          );
          i++;
        }
      } else if (positionInPattern === 3) {
        const currentForum = rightForums[i];
        elements.push(
          <Card 
            key={currentForum._id} 
            forum={currentForum} 
            type={1}
            isMember={isUserMemberOfForum(currentForum)}
            onClick={() => handleForumClick(currentForum)}
          />
        );
        i++;
      }
    }

    return elements;
  };

  return (
    <section className={styles.cardLayout} aria-label="Container da grade de cards">
      <div className={styles.cardLayoutInner}>
        <div className={`${styles.column} ${styles.leftColumn}`}>
          {renderLeftColumn()}
        </div>
        <div className={`${styles.column} ${styles.rightColumn}`}>
          {renderRightColumn()}
        </div>
      </div>
    </section>
  );
}
