import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (serverUrl = 'http://localhost:3000') => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]); // Usuários que estão digitando

  useEffect(() => {
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

    // Listener para usuários digitando
    socketRef.current.on('user_typing', (typingData) => {
      console.log('⌨️ Usuário digitando:', typingData);
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.userId !== typingData.userId);
        return [...filtered, typingData];
      });
    });

    // Listener para quando usuário para de digitar
    socketRef.current.on('user_stopped_typing', (userData) => {
      console.log('⌨️ Usuário parou de digitar:', userData);
      setTypingUsers(prev => prev.filter(user => user.userId !== userData.userId));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [serverUrl]);

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

  // Eventos de digitação
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

  return {
    socket: socketRef.current,
    isConnected,
    onlineUsers,
    typingUsers,
    joinForum,
    leaveForum,
    sendMessage,
    startTyping,
    stopTyping,
    onPublicMessage,
    onPrivateMessage,
    onMessageError,
    offMessageListeners,
  };
};