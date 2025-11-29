import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./ParticipantsSidebar.module.css";
import "../../../styles/global.css";
import { useAuth } from "../../../contexts/AuthContext"; // Importar para acessar o usuário atual

export default function ParticipantsSidebar({ 
  participants = [], 
  onlineUsers = [], 
  onPrivateMessageClick 
}) {
  const [participantQuery, setParticipantQuery] = useState("");
  const { user } = useAuth(); // Pegar usuário atual

  console.log("📌 PARTICIPANTS:", participants);
  console.log("📌 ONLINE USERS:", onlineUsers);
  console.log("👤 CURRENT USER:", user);

  // ---------------------------
  // Avatar helpers
  // ---------------------------
  const getInitials = (username) => {
    if (!username) return "?";
    return username
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (username) => {
    if (!username) return "blue";
    const colors = ["blue", "green", "purple", "red", "yellow", "orange"];
    const hash = username.split("").reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  // ---------------------------
  // Detectar usuário online
  // ---------------------------
  const isUserOnline = (userId) => {
    return onlineUsers.some((u) => {
      return u.userId === userId;
    });
  };

  // ---------------------------
  // Verificar se é o próprio usuário
  // ---------------------------
  const isCurrentUser = (participant) => {
    const participantId = participant._id || participant.id || participant.userId;
    const currentUserId = user?._id || user?.id;
    return participantId === currentUserId;
  };

  // ---------------------------
  // Preparar e ordenar participantes
  // ---------------------------
  const participantsWithStatus = useMemo(() => {
    return participants
      .map((p) => {
        const id = p._id || p.id || p.userId || p;
        return {
          ...p,
          isOnline: isUserOnline(id),
          isCurrentUser: isCurrentUser(p)
        };
      })
      .sort((a, b) => {
        // Colocar usuário atual por último
        if (a.isCurrentUser && !b.isCurrentUser) return 1;
        if (!a.isCurrentUser && b.isCurrentUser) return -1;
        // Ordenar online primeiro, depois por nome
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return (a.username || "").localeCompare(b.username || "");
      });
  }, [participants, onlineUsers, user]);

  const filteredParticipants = participantsWithStatus.filter((p) =>
    p.username?.toLowerCase().includes(participantQuery.trim().toLowerCase())
  );

  const onlineCount = participantsWithStatus.filter((p) => p.isOnline).length;
  const totalCount = participantsWithStatus.length;

  // Handler para mensagem privada
  const handlePrivateMessage = (participant) => {
    // Verificar se não é o próprio usuário
    if (isCurrentUser(participant)) {
      alert("Você não pode enviar mensagem privada para si mesmo!");
      return;
    }

    if (onPrivateMessageClick) {
      onPrivateMessageClick({
        id: participant._id || participant.id,
        username: participant.username,
        email: participant.email
      });
    }
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <aside className={styles.salaForumSidebar} aria-label="Participantes">
      <Link to="/" className={styles.salaForumBack}>
        <span className={styles.arrowLeft}>&#8592;</span> Voltar para o dashboard
      </Link>

      <div className={styles.salaForumSidebarHeader}>
        <h3 className={styles.salaForumSidebarTitle}>Participantes</h3>
        <div className={styles.salaForumParticipantsCount}>
          <span className={styles.onlineCount}>{onlineCount} online</span>
          <span className={styles.totalCount}>de {totalCount} total</span>
        </div>
      </div>

      <div className={styles.salaForumSearch}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 5a6 6 0 100 12 6 6 0 000-12z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 16l6 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="search"
          placeholder="Buscar participante"
          value={participantQuery}
          aria-label="Buscar participante"
          onChange={(e) => setParticipantQuery(e.target.value)}
        />
      </div>

      {filteredParticipants.length === 0 ? (
        <div className={styles.salaForumEmptyParticipants}>
          {participantQuery
            ? `Nenhum participante encontrado para "${participantQuery}"`
            : "Nenhum participante ainda"}
        </div>
      ) : (
        <ul className={styles.salaForumParticipants}>
          {filteredParticipants.map((p) => (
            <li
              key={p._id}
              className={`${styles.salaForumParticipant} ${
                p.isOnline ? styles.online : styles.offline
              } ${p.isCurrentUser ? styles.currentUser : ""}`}
            >
              <div className={styles.salaForumParticipantInfo}>
                <span
                  className={styles.salaForumAvatar}
                  data-color={getAvatarColor(p.username)}
                  style={{
                    background: p.avatar ? "none" : undefined,
                  }}
                >
                  {p.avatar ? <img src={p.avatar} alt={p.username} /> : getInitials(p.username)}

                  <span
                    className={`${styles.salaForumOnlineIndicator} ${
                      p.isOnline ? styles.online : styles.offline
                    }`}
                    aria-label={p.isOnline ? "Online" : "Offline"}
                  />
                </span>

                <div className={styles.salaForumParticipantDetails}>
                  <span className={styles.salaForumParticipantName}>
                    {p.username} {p.isCurrentUser && <span className={styles.youLabel}>(Você)</span>}
                  </span>
                  <span className={styles.salaForumParticipantStatus}>
                    {p.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.salaForumPrivateAction} ${
                  p.isCurrentUser ? styles.disabled : ""
                }`}
                aria-label={
                  p.isCurrentUser 
                    ? "Você não pode enviar mensagem para si mesmo"
                    : `Enviar mensagem privada para ${p.username}`
                }
                title={
                  p.isCurrentUser
                    ? "Você não pode enviar mensagem para si mesmo"
                    : `Enviar mensagem privada para ${p.username}`
                }
                disabled={!p.isOnline || p.isCurrentUser}
                onClick={() => handlePrivateMessage(p)}
              >
                <span
                  className={styles.salaForumPrivateIcon}
                  aria-hidden="true"
                >
                  {p.isCurrentUser ? "🚫" : "💬"}
                </span>
                <span>{p.isCurrentUser ? "Você" : "Privado"}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
