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
        message.isPrivate ? styles.salaForumMessagePrivate : ""
      }`}
    >
      <div className={styles.salaForumMessageBody}>
        <span className={styles.salaForumMessageAuthor}>
          {message.sender?.username || "Usuário"}
        </span>
        <span className={styles.salaForumMessageText}>
          {message.isPrivate ? (
            <b className={styles.salaForumPrivateLabel}>{message.content}</b>
          ) : (
            message.content
          )}
        </span>
        {message.timestamp && (
          <span className={styles.salaForumMessageTime}>
            {new Date(message.timestamp).toLocaleTimeString([], {
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
        data-color={getAvatarColor(message.sender?.username)}
      >
        {message.sender?.avatar ? (
          <img 
            src={message.sender.avatar} 
            alt={message.sender.username || "Avatar"}
          />
        ) : (
          getInitials(message.sender?.username)
        )}
      </span>
    </div>
  );
}