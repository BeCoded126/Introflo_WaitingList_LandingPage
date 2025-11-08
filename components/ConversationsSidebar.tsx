"use client";

import React from "react";
import Image from "next/image";

export interface Conversation {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityImage?: string;
  lastMessage: string;
  lastMessageTime: Date;
  matchedAt: Date;
  unreadCount?: number;
}

interface ConversationsSidebarProps {
  currentUser: {
    name: string;
    image?: string;
  };
  conversations: Conversation[];
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  onProfileClick: () => void;
}

export default function ConversationsSidebar({
  currentUser,
  conversations,
  selectedConversationId,
  onConversationSelect,
  onProfileClick,
}: ConversationsSidebarProps) {
  const getTimeRemaining = (matchedAt: Date) => {
    const now = new Date();
    const matchTime = new Date(matchedAt);
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(matchTime.getTime() + twoDaysInMs);
    const remaining = expiresAt.getTime() - now.getTime();

    if (remaining <= 0) return "Expired";

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h left`;
    return `${hours}h left`;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diff = now.getTime() - messageDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  return (
    <div className="conversations-sidebar">
      {/* User Profile */}
      <div className="user-profile" onClick={onProfileClick}>
        <div className="user-avatar">
          {currentUser.image ? (
            <img src={currentUser.image} alt={currentUser.name} />
          ) : (
            <div className="avatar-placeholder">
              {currentUser.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="user-info">
          <div className="user-name">{currentUser.name}</div>
          <div className="user-status">View Profile</div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="conversations-header">
        <h3>Matches</h3>
        <span className="conversations-count">{conversations.length}</span>
      </div>

      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <p>No matches yet</p>
            <span>Start swiping to find matches!</span>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${
                selectedConversationId === conversation.id ? "active" : ""
              }`}
              onClick={() => onConversationSelect(conversation.id)}
            >
              <div className="conversation-avatar">
                {conversation.facilityImage ? (
                  <img
                    src={conversation.facilityImage}
                    alt={conversation.facilityName}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {conversation.facilityName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="conversation-content">
                <div className="conversation-header">
                  <span className="conversation-name">
                    {conversation.facilityName}
                  </span>
                  <span className="conversation-time">
                    {formatTime(conversation.lastMessageTime)}
                  </span>
                </div>
                <div className="conversation-preview">
                  <p className="last-message">{conversation.lastMessage}</p>
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <span className="unread-badge">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <div className="conversation-countdown">
                  <span className="countdown-text">
                    ⏱️ {getTimeRemaining(conversation.matchedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
