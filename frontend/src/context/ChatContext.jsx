// src/context/ChatContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      // Connect to Socket.io server
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001', {
        auth: {
          userId: currentUser.id,
          userType: currentUser.userType
        }
      });

      setSocket(newSocket);

      // Listen for incoming messages
      newSocket.on('message', (message) => {
        setMessages(prev => ({
          ...prev,
          [message.chatId]: [...(prev[message.chatId] || []), message]
        }));

        // Update unread count if chat is not active
        if (activeChat !== message.chatId) {
          setUnreadCounts(prev => ({
            ...prev,
            [message.chatId]: (prev[message.chatId] || 0) + 1
          }));
        }
      });

      // Listen for online users
      newSocket.on('onlineUsers', (users) => {
        setOnlineUsers(users);
      });

      // Listen for user typing
      newSocket.on('userTyping', (data) => {
        // Handle typing indicators
        console.log('User typing:', data);
      });

      return () => newSocket.close();
    }
  }, [currentUser]);

  const sendMessage = (chatId, content) => {
    if (socket && currentUser) {
      const message = {
        chatId,
        content,
        senderId: currentUser.id,
        senderName: currentUser.name,
        timestamp: new Date().toISOString()
      };

      socket.emit('sendMessage', message);
      
      // Optimistically add message to UI
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), { ...message, pending: true }]
      }));
    }
  };

  const markAsRead = (chatId) => {
    setUnreadCounts(prev => ({
      ...prev,
      [chatId]: 0
    }));
  };

  const value = {
    socket,
    messages: messages[activeChat] || [],
    onlineUsers,
    activeChat,
    setActiveChat,
    sendMessage,
    markAsRead,
    unreadCounts: unreadCounts[activeChat] || 0,
    allChats: Object.keys(messages).map(chatId => ({
      id: chatId,
      lastMessage: messages[chatId]?.[messages[chatId].length - 1],
      unread: unreadCounts[chatId] || 0
    }))
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
