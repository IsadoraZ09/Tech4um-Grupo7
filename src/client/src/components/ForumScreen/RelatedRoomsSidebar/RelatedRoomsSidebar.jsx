import React from "react";
import { Link } from "react-router-dom";
import styles from "./RelatedRoomsSidebar.module.css";
import "../../../styles/global.css"; // Importar global para classes compartilhadas

export default function RelatedRoomsSidebar({ 
  relatedRooms = [], 
  loading = false,
  title = "Tópicos Relacionados" 
}) {

  // Função para truncar texto de forma inteligente
  const truncateText = (text, maxLength = 18) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
  };

  if (loading) {
    return (
      <aside className={styles.salaForumSidebarRight} aria-label={title}>
        <h3 className={styles.salaForumSidebarTitle}>{title}</h3>
        <div className={styles.salaForumLoadingRelated}>
          <div className="spinner"></div>
          Carregando tópicos...
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.salaForumSidebarRight} aria-label={title}>
      {relatedRooms.length > 0 && (
        <h3 className={styles.salaForumSidebarTitle}>{title}</h3>
      )}
      
      {relatedRooms.length === 0 ? (
        <div className={styles.salaForumEmptyRelated}>
          <p>Nenhum tópico relacionado ainda</p>
        </div>
      ) : (
        <div className={styles.salaForumRelatedRoomsContainer}>
          {relatedRooms.map((room) => (
            <Link
              key={room._id}
              to={`/sala/${room._id}`}
              className={styles.salaForumSideRoom}
              aria-label={`Ir para sala ${room.name}`}
              title={room.name}
            >
              {room.isNew && (
                <span 
                  className={styles.salaForumNewBadge}
                  aria-label="Sala nova"
                >
                  Novo
                </span>
              )}
              <div className={styles.salaForumSideRoomTitle}>
                {truncateText(room.name)}
              </div>
              <div className={styles.salaForumSideRoomPessoas}>
                {room.participants || room.membersCount || 0} participantes
              </div>
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}