import React, { useRef, useEffect } from "react";
import ChatMessage from "../ChatMessage/ChatMessage";
import ChatInput from "../ChatInput/ChatInput";

export default function ChatMain({ sala, onSendMessage }) {
  const messagesEndRef = useRef(null);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sala.messages]);

  return (
    <main className="sala-forum-chat-main" aria-label="Mensagens da sala">
      <div className="sala-forum-chat-header">
        <h2 className="sala-forum-chat-title">{sala.name}</h2>
        <span className="sala-forum-chat-criador">
          Criado por: <b>{sala.creator?.username}</b>
        </span>
      </div>
      
      <div className="sala-forum-chat-messages">
        {!sala.messages || sala.messages.length === 0 ? (
          <div className="sala-forum-empty-state">
            <p>Nada por aqui, que tal começar o papo?</p>
          </div>
        ) : (
          <>
            {sala.messages.map((m, i) => (
              <ChatMessage key={m._id || i} message={m} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="sala-forum-chat-typing">
      </div>
      
      <ChatInput onSendMessage={onSendMessage} />
    </main>
  );
}