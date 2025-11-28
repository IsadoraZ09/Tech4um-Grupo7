import React from "react";
import { Link } from "react-router-dom";

export default function Card({ forum, type }) {
  const cardClass = `card card-type${type}`;
  
  return (
    <Link
      to={`/sala/${forum._id}`}
      className={cardClass}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {type === 1 && <span className="tag">Tópico em destaque!</span>}
      
      <h3 className={type === 1 ? "title" : "title"}>
        {forum.title}
      </h3>
      
      <div className="people">
        {forum.creator?.username} • {forum.members?.length || 0} pessoas
      </div>
      
      {type === 1 && (
        <p className="desc">
          {forum.description || "O que temos de bom nessa sala, pessoal?"}
        </p>
      )}
      
      <div className="creator bottom">
        <span className="creator-label">Criado por:</span>
        <span className="creator-name"> {forum.creator?.username || forum.criador}</span>
      </div>
      
      {forum.unreadCount > 0 && (
        <div className="unread-badge" aria-hidden>
          {forum.unreadCount}
        </div>
      )}
    </Link>
  );
}