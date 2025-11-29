import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]); // Novo estado para usuários digitando

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    
    socketRef.current = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 Socket conectado:', socketRef.current.id);
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Socket desconectado');
      setIsConnected(false);
      setOnlineUsers([]);
      setTypingUsers([]);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Erro de conexão:', error);
      setIsConnected(false);
    });

    // Listener para usuários online
    socketRef.current.on('users_online_updated', (users) => {
      console.log('👥 Usuários online atualizados:', users);
      setOnlineUsers(users);
    });

    // Listeners para digitação
    socketRef.current.on('user_typing', (typingData) => {
      console.log('⌨️ Usuário digitando:', typingData);
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.userId !== typingData.userId);
        return [...filtered, typingData];
      });
    });

    socketRef.current.on('user_stopped_typing', (userData) => {
      console.log('⌨️ Usuário parou de digitar:', userData);
      setTypingUsers(prev => prev.filter(user => user.userId !== userData.userId));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinForum = (forumId, userData) => {
    console.log('🚪 Entrando no fórum:', forumId, userData);
    socketRef.current?.emit('join_forum', { forumId, userData });
  };

  const leaveForum = (forumId) => {
    console.log('🚪 Saindo do fórum:', forumId);
    socketRef.current?.emit('leave_forum', forumId);
  };

  const sendMessage = (messageData) => {
    console.log('📤 Enviando mensagem:', messageData);
    socketRef.current?.emit('send_message', messageData);
  };

  // Funções de digitação
  const startTyping = (forumId, userData) => {
    console.log('⌨️ Começou a digitar:', forumId, userData);
    socketRef.current?.emit('start_typing', { forumId, userData });
  };

  const stopTyping = (forumId, userData) => {
    console.log('⌨️ Parou de digitar:', forumId, userData);
    socketRef.current?.emit('stop_typing', { forumId, userData });
  };

  const onPublicMessage = (callback) => {
    console.log('👂 Registrando listener para mensagens públicas');
    socketRef.current?.on('public_message', callback);
  };

  const onPrivateMessage = (callback) => {
    console.log('👂 Registrando listener para mensagens privadas');
    socketRef.current?.on('private_message', callback);
  };

  const onMessageError = (callback) => {
    console.log('👂 Registrando listener para erros de mensagem');
    socketRef.current?.on('message_error', callback);
  };

  const offMessageListeners = () => {
    console.log('👂 Removendo listeners de mensagem');
    socketRef.current?.off('public_message');
    socketRef.current?.off('private_message');
    socketRef.current?.off('message_error');
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        onlineUsers,
        typingUsers, // Expor usuários digitando
        joinForum,
        leaveForum,
        sendMessage,
        startTyping, // Expor funções de digitação
        stopTyping,
        onPublicMessage,
        onPrivateMessage,
        onMessageError,
        offMessageListeners,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
