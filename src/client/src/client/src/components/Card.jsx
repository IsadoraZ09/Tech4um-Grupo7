import React from 'react';

export default function Card({ title, author, content, type = 1 }) { // type: 1, 2 ou 3
  let cardClass = 'card';
  if (type === 1) cardClass += ' card-type1';
  if (type === 2) cardClass += ' card-type2';
  if (type === 3) cardClass += ' card-type3';

  return (
    <div className={cardClass}>
      <div className="card-header">
        <span className="tag">+115</span>
      </div>
      <h3 className="card-title">{title}</h3>
      {author && <div className="card-sub">{author}</div>}
      {content && <p className="card-content">{content}</p>}
    </div>
  );
}