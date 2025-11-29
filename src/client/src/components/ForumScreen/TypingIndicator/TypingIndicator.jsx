import React from "react";
import styles from "./TypingIndicator.module.css";

export default function TypingIndicator({ typingUsers = [], currentUserId }) {
  console.log('🔍 TypingIndicator props:', { typingUsers, currentUserId });
  
  // Filtrar usuários digitando excluindo o usuário atual
  const otherUsersTyping = typingUsers.filter(user => {
    const userId = user.userId || user.id;
    return userId && userId !== currentUserId;
  });

  console.log('👥 Outros usuários digitando:', otherUsersTyping);

  const getTypingText = () => {
    if (otherUsersTyping.length === 1) {
      return `${otherUsersTyping[0].username} está digitando...`;
    } else if (otherUsersTyping.length === 2) {
      return `${otherUsersTyping[0].username} e ${otherUsersTyping[1].username} estão digitando...`;
    } else {
      return `${otherUsersTyping[0].username} e mais ${otherUsersTyping.length - 1} pessoas estão digitando...`;
    }
  };

  // SEMPRE retornar a div, mas só mostrar conteúdo quando há usuários digitando
  return (
    <div className={styles.typingContainer}>
      {otherUsersTyping.length > 0 && (
        <div className={styles.typingIndicator}>
          <div className={styles.typingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className={styles.typingText}>{getTypingText()}</span>
        </div>
      )}
    </div>
  );
}