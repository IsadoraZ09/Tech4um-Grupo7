import React, { useState } from "react";

export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form className="sala-forum-chat-form" onSubmit={handleSubmit}>
      <div className="sala-forum-chat-form-bar">
        <span className="sala-forum-chat-form-label">
          Enviando para todos do 4um
        </span>
        <div className="sala-forum-chat-bar-actions">
          <button
            type="button"
            className="sala-forum-chat-bar-btn"
            aria-label="Inserir emoji"
          >
            😊
          </button>
          <button
            type="button"
            className="sala-forum-chat-bar-btn"
            aria-label="Enviar imagem"
          >
            📷
          </button>
        </div>
      </div>
      <div className="sala-forum-chat-form-inputs">
        <input
          className="sala-forum-chat-input"
          placeholder="Escreva aqui uma mensagem maneira para mandar para os colegas..."
          aria-label="Mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="sala-forum-chat-send-btn"
          title="Enviar"
          disabled={!message.trim()}
        >
          <span className="sala-forum-send-arrow">&#8594;</span>
        </button>
      </div>
    </form>
  );
}