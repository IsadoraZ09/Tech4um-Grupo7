import React from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatMain({ sala, onSendMessage }) {
  return (
    <main className="sala-forum-chat-main" aria-label="Mensagens da sala">
      <div className="sala-forum-chat-header">
        <h2 className="sala-forum-chat-title">{sala.name}</h2>
        <span className="sala-forum-chat-criador">
          Criado por: <b>{sala.creator?.username}</b>
        </span>
      </div>
      
      <div className="sala-forum-chat-messages">
        {sala.messages?.map((m, i) => (
          <ChatMessage key={m._id || i} message={m} />
        ))}
      </div>
      
      <div className="sala-forum-chat-typing">
        Amanda Oliveira está digitando...
      </div>
      
      <ChatInput onSendMessage={onSendMessage} />
    </main>
  );
}