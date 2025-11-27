// src/components/chat/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import './ChatInterface.css';

function ChatInterface({ chatId, otherUser }) {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, onlineUsers, markAsRead } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (chatId) {
      markAsRead(chatId);
    }
  }, [messages, chatId, markAsRead]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && chatId) {
      sendMessage(chatId, message.trim());
      setMessage('');
    }
  };

  const isOnline = onlineUsers.includes(otherUser?.id);

  if (!chatId) {
    return (
      <div className="chat-interface empty">
        <div className="empty-chat">
          <div className="empty-icon">💬</div>
          <h3>Select a conversation</h3>
          <p>Choose a therapist or patient to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="user-avatar">
            {otherUser?.name?.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="user-details">
            <h3>{otherUser?.name}</h3>
            <div className="user-status">
              <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.senderId === otherUser?.id ? 'received' : 'sent'}`}
          >
            <div className="message-content">
              {msg.content}
            </div>
            <div className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            {msg.pending && <div className="message-pending">⏳</div>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="message-input-form">
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button 
            type="submit" 
            disabled={!message.trim()}
            className="send-button"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInterface;
