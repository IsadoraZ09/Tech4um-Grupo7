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
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

    socketRef.current = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      setOnlineUsers([]);
      setTypingUsers([]);
    });

    socketRef.current.on('connect_error', () => {
      setIsConnected(false);
    });

    socketRef.current.on('users_online_updated', (users) => {
      setOnlineUsers(users);
    });

    socketRef.current.on('user_typing', (typingData) => {
      setTypingUsers(prev => {
        const formatted = {
          userId: typingData.userId || typingData.id || typingData._id,
          username: typingData.username
        };
        
        const filtered = prev.filter(u => u.userId !== formatted.userId);
        return [...filtered, formatted];
      });
    });

    socketRef.current.on('user_stopped_typing', (typingData) => {
      setTypingUsers(prev =>
        prev.filter(u => u.userId !== typingData.userId)
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinForum = (forumId, userData) => {
    socketRef.current?.emit('join_forum', { forumId, userData });
  };

  const leaveForum = (forumId) => {
    socketRef.current?.emit('leave_forum', forumId);
  };

  const sendMessage = (messageData) => {
    socketRef.current?.emit('send_message', messageData);
  };

  const startTyping = (forumId, userData) => {
    socketRef.current?.emit('start_typing', { forumId, userData });
  };

  const stopTyping = (forumId, userData) => {
    socketRef.current?.emit('stop_typing', { forumId, userData });
  };

  const onPublicMessage = (callback) => {
    socketRef.current?.on('public_message', callback);
  };

  const onPrivateMessage = (callback) => {
    socketRef.current?.on('private_message', callback);
  };

  const onMessageError = (callback) => {
    socketRef.current?.on('message_error', callback);
  };

  const offMessageListeners = () => {
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
