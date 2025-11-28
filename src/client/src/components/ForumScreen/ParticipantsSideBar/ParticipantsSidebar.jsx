import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ParticipantsSidebar({ participants = [] }) {
  const [participantQuery, setParticipantQuery] = useState("");

  const filteredParticipants = participants.filter((p) =>
    p.username?.toLowerCase().includes(participantQuery.trim().toLowerCase())
  );

  return (
    <aside className="sala-forum-sidebar" aria-label="Participantes">
      <Link to="/" className="sala-forum-back">
        <span className="arrow-left">&#8592;</span> Voltar para o dashboard
      </Link>
      
      <h3 className="sala-forum-sidebar-title">Participantes</h3>
      
      <div className="sala-forum-search">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 5a6 6 0 100 12 6 6 0 000-12z"
            stroke="#5A7BFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 16l6 6"
            stroke="#5A7BFF"
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
      
      <ul className="sala-forum-participants">
        {filteredParticipants.map((p) => (
          <li key={p._id} className="sala-forum-participant">
            <span
              className="sala-forum-avatar"
              style={{
                background: p.avatar ? "none" : p.color || "#e0e0e0",
                color: p.color || "#e0e0e0",
              }}
            >
              {p.avatar ? <img src={p.avatar} alt={p.username} /> : null}
            </span>
            <span className="sala-forum-participant-name">
              {p.username}
            </span>
            <button
              type="button"
              className="sala-forum-private-action"
              aria-label={`Enviar mensagem privada para ${p.username}`}
            >
              <span className="sala-forum-private-icon" aria-hidden="true">
                💬
              </span>
              <span>Enviar mensagem para {p.username.split(" ")[0]}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}