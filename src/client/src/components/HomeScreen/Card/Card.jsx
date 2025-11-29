import React, { useState } from "react";
import { Link } from "react-router-dom";
import JoinConfirmationModal from "../../JoinConfirmationModal/JoinConfirmationModal";
import styles from "./Card.module.css";

export default function Card({ forum, type, isMember, onClick }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const getCardTypeClass = () => {
    switch(type) {
      case 1:
        return styles.cardType1;
      case 2:
        return styles.cardType2;
      case 3:
        return styles.cardType3;
      default:
        return styles.cardType1;
    }
  };

  const cardClass = `${styles.card} ${getCardTypeClass()}`;

  const handleClick = (e) => {
    e.preventDefault();
    console.log('Card handleClick chamado com forum:', forum); // Debug
    console.log('É membro?', isMember); // Debug
    
    if (isMember) {
      // Se é membro, redirecionar diretamente para a sala
      window.location.href = `/sala/${forum._id}`;
    } else {
      // Se não é membro, mostrar modal de confirmação
      setShowConfirmModal(true);
    }
  };

  const handleJoinConfirm = () => {
    setShowConfirmModal(false);
    if (onClick) {
      onClick(forum);
    }
  };

  const handleJoinCancel = () => {
    setShowConfirmModal(false);
  };

  // Simular mensagens não lidas (você pode ajustar isso com dados reais da API)
  const unreadMessages = Math.floor(Math.random() * 10) + 1; // Remover depois
  
  return (
    <>
      <div 
        className={`${styles.card} ${styles[`cardType${type}`]}`}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        {type === 1 && <span className={styles.tag}>Tópico em destaque!</span>}
        
        <h3 className={styles.title}>
          {forum.title}
        </h3>
        
        <div className={styles.people}>
          {forum.creator?.username} • {forum.members?.length || 0} pessoas
        </div>
        
        {type === 1 && (
          <p className={styles.desc}>
            {forum.description || "O que temos de bom nessa sala, pessoal?"}
          </p>
        )}
        
        <div className={`${styles.creator} ${styles.bottom}`}>
          <span className={styles.creatorLabel}>Criado por:</span>
          <span className={styles.creatorName}> {forum.creator?.username}</span>
        </div>
        

        {/* Flag no canto direito inferior */}
        <div className={styles.cardFlag}>
          {isMember ? (
            <span className={styles.memberFlag}>
              
            </span>
          ) : (
            <span className={styles.joinFlag}>
              Juntar-se
            </span>
          )}
        </div>
      </div>

      {/* Modal de confirmação */}
      <JoinConfirmationModal
        isOpen={showConfirmModal}
        forum={forum}
        onConfirm={handleJoinConfirm}
        onCancel={handleJoinCancel}
      />
    </>
  );
}