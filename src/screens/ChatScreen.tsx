import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { colors } from '../utils/theme';
import './ChatScreen.css';

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }>;
  lastMessage?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
    };
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

export default function ChatScreen() {
  const { authState } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    try {
      console.log('🔄 Loading conversations...');
      const data = await api.getConversations();
      setConversations(data || []);
      console.log('✅ Loaded', data?.length || 0, 'conversations');
    } catch (error) {
      console.error('❌ Failed to load conversations:', error);
      alert('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="chat-loading-container">
        <div className="chat-loading-icon">💬</div>
        <p className="chat-loading-text">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-content">
          <h1 className="chat-header-title">Messages</h1>
          <p className="chat-header-subtitle">Connect with fellow Muslims</p>
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="chat-empty-container">
          <div className="chat-empty-icon">💬</div>
          <h2 className="chat-empty-title">No conversations yet</h2>
          <p className="chat-empty-subtitle">
            Start chatting with other members of the community
          </p>
        </div>
      ) : (
        <div className="chat-conversations-list">
          {conversations.map((conversation) => {
            const otherUser = conversation.participants.find(p => p.id !== authState.user?.id);
            
            return (
              <div 
                key={conversation.id} 
                className="chat-conversation-item"
                onClick={() => navigate(`/chat/${conversation.id}`)}
              >
                <div className="chat-avatar">
                  {otherUser?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <div className="chat-conversation-content">
                  <div className="chat-conversation-header">
                    <h3 className="chat-conversation-name">
                      {otherUser?.name || 'Unknown User'}
                    </h3>
                    <span className="chat-conversation-time">
                      {formatTime(conversation.updatedAt)}
                    </span>
                  </div>
                  
                  <div className="chat-conversation-footer">
                    <p 
                      className={`chat-last-message ${conversation.unreadCount > 0 ? 'chat-unread-message' : ''}`}
                    >
                      {conversation.lastMessage 
                        ? `${conversation.lastMessage.sender.id === authState.user?.id ? 'You: ' : ''}${conversation.lastMessage.content}`
                        : 'No messages yet'
                      }
                    </p>
                    
                    {conversation.unreadCount > 0 && (
                      <div className="chat-unread-badge">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

