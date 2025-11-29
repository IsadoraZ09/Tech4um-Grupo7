import React, { useRef, useEffect, useState } from "react";
import ChatMessage from "../ChatMessage/ChatMessage";
import ChatInput from "../ChatInput/ChatInput";
import TypingIndicator from "../TypingIndicator/TypingIndicator";
import styles from "./ChatMain.module.css";
import "../../../styles/global.css"; // Importar global para classes compartilhadas

export default function ChatMain({ 
  sala, 
  onSendMessage, 
  loading = false, 
  error = null, 
  isConnected = false,
  privateMode = null,
  onCancelPrivateMode,
  typingUsers,
  currentUserId,
  onStartTyping,
  onStopTyping
}) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto scroll para última mensagem
  useEffect(() => {
    if (sala?.messages?.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sala?.messages]);

  // Renderizar loading state
  if (loading) {
    return (
      <main className={styles.salaForumChatMain} aria-label="Carregando mensagens da sala">
        <div className={styles.salaForumLoadingState}>
          <div className="spinner"></div>
          Carregando mensagens...
        </div>
      </main>
    );
  }

  // Renderizar error state
  if (error) {
    return (
      <main className={styles.salaForumChatMain} aria-label="Erro ao carregar sala">
        <div className={styles.salaForumErrorState}>
          <p>Ops! Algo deu errado</p>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  // Renderizar estado normal
  return (
    <main 
      className={styles.salaForumChatMain} 
      aria-label="Mensagens da sala"
      data-disconnected={!isConnected}
      aria-busy={loading}
    >
      <header className={styles.salaForumChatHeader}>
        <h2 className={styles.salaForumChatTitle} title={sala?.title}>
          {sala?.title || "Carregando..."}
        </h2>
        <div className={styles.salaForumChatStatus}>
          {sala?.creator && (
            <span className={styles.salaForumChatCriador}>
              Criado por: <b>{sala.creator.username}</b>
            </span>
          )}
          <span 
            className={`${styles.salaForumConnectionStatus} ${isConnected ? styles.connected : styles.disconnected}`}
            title={isConnected ? "Conectado" : "Desconectado"}
          >
          </span>
        </div>
      </header>
      
      <div 
        className={styles.salaForumChatMessages} 
        role="log" 
        aria-live="polite"
        ref={messagesContainerRef}
      >
        {!sala?.messages || sala.messages.length === 0 ? (
          <div className={styles.salaForumEmptyState} role="status">
            <p>Nada por aqui, que tal começar o papo?</p>
          </div>
        ) : (
          <>
            {sala.messages.map((message, index) => (
              <ChatMessage 
                key={message._id || `message-${index}`} 
                message={message} 
              />
            ))}
            <div ref={messagesEndRef} aria-hidden="true" />
          </>
        )}
      </div>
      
      <div className={styles.salaForumChatTyping} aria-live="polite">
        <TypingIndicator 
          typingUsers={typingUsers} 
          currentUserId={currentUserId} 
        />
      </div>
      
      <ChatInput 
        onSendMessage={onSendMessage} 
        disabled={!isConnected}
        privateMode={privateMode}
        onCancelPrivateMode={onCancelPrivateMode}
        onStartTyping={onStartTyping}
        onStopTyping={onStopTyping}
      />
    </main>
  );
}