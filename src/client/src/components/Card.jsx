import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Card({ forum, type = 1 }) {
  const navigate = useNavigate();
  
  let cardClass = 'card';
  if (type === 1) cardClass += ' card-type1';
  if (type === 2) cardClass += ' card-type2';
  if (type === 3) cardClass += ' card-type3';

  const handleCardClick = () => {
    navigate(`/forum/${forum._id}`);
  };

  return (
    <article className={cardClass} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {type === 1 && forum.featured && (
        <span className="tag">Tópico em destaque!</span>
      )}
      
      <h3 className="title">{forum.title}</h3>
      
      <div className="people">
        {forum.creator?.username || 'Anônimo'} • {forum.members?.length || 0} pessoas
      </div>
      
      {type === 1 && forum.description && (
        <p className="desc">{forum.description}</p>
      )}
      
      <p className="desc small">
        <span className="creator-label">Criado por:</span>{' '}
        <span className="creator-name">{forum.creator?.username || 'Anônimo'}</span>
      </p>
      
      {forum.unreadCount > 0 && (
        <div className="unread-badge" aria-hidden>
          {forum.unreadCount}
        </div>
      )}
    </article>
  );
}