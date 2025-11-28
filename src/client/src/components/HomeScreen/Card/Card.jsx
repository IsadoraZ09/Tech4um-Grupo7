import React from "react";
import { Link } from "react-router-dom";
import styles from "./Card.module.css";

export default function Card({ forum, type }) {
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
  
  return (
    <Link
      to={`/sala/${forum._id}`}
      className={cardClass}
      style={{ textDecoration: "none", color: "inherit" }}
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
        <span className={styles.creatorName}> {forum.creator?.username || forum.criador}</span>
      </div>
      
      {forum.unreadCount > 0 && (
        <div className={styles.unreadBadge} aria-hidden>
          {forum.unreadCount}
        </div>
      )}
    </Link>
  );
}