// src/components/chat/ChatList.jsx
import React from 'react';
import { useChat } from '../../context/ChatContext';
import './ChatList.css';

function ChatList({ chats, onSelectChat, activeChat }) {
  // Mock chat data - replace with real data from backend
  const mockChats = [
    {
      id: 'chat-1',
      otherUser: {
        id: 2,
        name: 'Dr. Sarah Johnson',
        type: 'therapist'
      },
      lastMessage: 'Looking forward to our session tomorrow!',
      timestamp: '2024-01-15T14:30:00Z',
      unread: 2
    },
    {
      id: 'chat-2', 
      otherUser: {
        id: 3,
        name: 'Dr. Michael Chen',
        type: 'therapist'
      },
      lastMessage: 'How have you been feeling this week?',
      timestamp: '2024-01-14T10:15:00Z',
      unread: 0
    }
  ];

  const displayChats = chats.length > 0 ? chats : mockChats;

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>Messages</h2>
      </div>
      
      <div className="chats-container">
        {displayChats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id, chat.otherUser)}
          >
            <div className="chat-avatar">
              {chat.otherUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="chat-info">
              <div className="chat-header">
                <h4>{chat.otherUser.name}</h4>
                <span className="chat-time">
                  {new Date(chat.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <p className="chat-preview">
                {chat.lastMessage}
              </p>
            </div>

            {chat.unread > 0 && (
              <div className="unread-badge">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;
