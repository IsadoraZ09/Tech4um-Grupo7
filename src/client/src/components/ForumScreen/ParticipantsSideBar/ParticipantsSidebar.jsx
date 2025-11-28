import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ParticipantsSidebar.module.css";
import "../../../styles/global.css"; // Importar global para classes compartilhadas

export default function ParticipantsSidebar({ participants = [] }) {
  const [participantQuery, setParticipantQuery] = useState("");

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

  const filteredParticipants = participants.filter((p) =>
    p.username?.toLowerCase().includes(participantQuery.trim().toLowerCase())
  );

  return (
    <aside className={styles.salaForumSidebar} aria-label="Participantes">
      <Link to="/" className={styles.salaForumBack}>
        <span className={styles.arrowLeft}>&#8592;</span> Voltar para o dashboard
      </Link>
      
      <h3 className={styles.salaForumSidebarTitle}>Participantes</h3>
      
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
          {participantQuery ? 
            `Nenhum participante encontrado para "${participantQuery}"` : 
            "Nenhum participante ainda"
          }
        </div>
      ) : (
        <ul className={styles.salaForumParticipants}>
          {filteredParticipants.map((p) => (
            <li key={p._id} className={styles.salaForumParticipant}>
              <span
                className={styles.salaForumAvatar}
                data-color={getAvatarColor(p.username)}
                style={{
                  background: p.avatar ? "none" : undefined,
                }}
              >
                {p.avatar ? (
                  <img src={p.avatar} alt={p.username} />
                ) : (
                  getInitials(p.username)
                )}
              </span>
              <span className={styles.salaForumParticipantName}>
                {p.username}
              </span>
              <button
                type="button"
                className={styles.salaForumPrivateAction}
                aria-label={`Enviar mensagem privada para ${p.username}`}
                title={`Enviar mensagem privada para ${p.username}`}
              >
                <span className={styles.salaForumPrivateIcon} aria-hidden="true">
                  💬
                </span>
                <span>Enviar mensagem para {p.username.split(" ")[0]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}