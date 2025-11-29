import React from "react";
import styles from "./ChatMessage.module.css";
import "../../../styles/global.css"; // Importar global para classes compartilhadas

export default function ChatMessage({ message }) {
  // Função para gerar iniciais do usuário
  const getInitials = (username) => {
    if (!username) return "?";
    return username
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Função para gerar cor do avatar baseada no username
  const getAvatarColor = (username) => {
    if (!username) return "blue";
    const colors = ["blue", "green", "purple", "red", "yellow", "orange"];
    const hash = username.split("").reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={`${styles.salaForumMessage} ${
        (message.isPrivate || message.private) ? styles.salaForumMessagePrivate : ""
      }`}
    >
      <div className={styles.salaForumMessageBody}>
        <span className={styles.salaForumMessageAuthor}>
          {message.sender?.username || message.sender?.email || "Usuário"}
          {(message.isPrivate || message.private) && (
            <span className={styles.salaForumPrivateIndicator} title="Mensagem privada">
              🔒
            </span>
          )}
        </span>
        <span className={styles.salaForumMessageText}>
          {(message.isPrivate || message.private) ? (
            <span className={styles.salaForumPrivateMessage}>
              {message.text || message.content}
            </span>
          ) : (
            message.text || message.content
          )}
        </span>
        {(message.timestamp || message.createdAt) && (
          <span className={styles.salaForumMessageTime}>
            {new Date(message.timestamp || message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        )}
        {message.attachments && message.attachments.length > 0 && (
          <div className={styles.salaForumMessageAttachments}>
            {message.attachments.map((attachment, index) => (
              <div key={index} className={styles.salaForumMessageAttachment}>
                {attachment.type === "image" ? (
                  <img 
                    src={attachment.url} 
                    alt={attachment.name || "Attachment"}
                    loading="lazy"
                  />
                ) : attachment.type === "video" ? (
                  <video 
                    src={attachment.url} 
                    controls
                    preload="metadata"
                  />
                ) : null}
              </div>
            ))}
          </div>
        )}
        {message.reactions && message.reactions.length > 0 && (
          <div className={styles.salaForumMessageReactions}>
            {message.reactions.map((reaction, index) => (
              <span 
                key={index}
                className={`${styles.salaForumMessageReaction} ${
                  reaction.isUserReaction ? styles.active : ""
                }`}
                onClick={() => reaction.onToggle?.(reaction.emoji)}
              >
                {reaction.emoji} {reaction.count}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <span
        className={`${styles.salaForumAvatar} ${styles.salaForumAvatarMsg}`}
        style={{
          background: message.sender?.avatar
            ? "none"
            : undefined,
          border: `2px solid #fff`,
        }}
        data-color={getAvatarColor(message.sender?.username || message.sender?.email)}
      >
        {message.sender?.avatar ? (
          <img 
            src={message.sender.avatar} 
            alt={message.sender.username || message.sender.email || "Avatar"}
          />
        ) : (
          getInitials(message.sender?.username || message.sender?.email)
        )}
      </span>
    </div>
  );
}