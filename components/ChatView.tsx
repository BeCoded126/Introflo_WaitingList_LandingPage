"use client";

import React, { useState, useRef, useEffect } from "react";

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

interface ChatViewProps {
  conversationId: string;
  facilityName: string;
  facilityImage?: string;
  messages: ChatMessage[];
  currentUserId: string;
  onClose: () => void;
  onSendMessage: (text: string) => void;
}

export default function ChatView({
  conversationId,
  facilityName,
  facilityImage,
  messages,
  currentUserId,
  onClose,
  onSendMessage,
}: ChatViewProps) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (date: Date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeString = messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (messageDate.toDateString() === today.toDateString()) {
      return timeString;
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${timeString}`;
    } else {
      return `${messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} ${timeString}`;
    }
  };

  return (
    <div className="chat-view">
      {/* Chat Header */}
      <div className="chat-view-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            {facilityImage ? (
              <img src={facilityImage} alt={facilityName} />
            ) : (
              <div className="avatar-placeholder">{facilityName.charAt(0)}</div>
            )}
          </div>
          <div className="chat-header-text">
            <h3>{facilityName}</h3>
            <span className="online-status">Active now</span>
          </div>
        </div>
        <button className="close-chat-btn" onClick={onClose} aria-label="Close chat">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">💬</div>
            <p>Start your conversation with {facilityName}</p>
            <span>Say hello and discuss potential referrals!</span>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${
                message.senderId === currentUserId ? "sent" : "received"
              }`}
            >
              <div className="message-bubble">
                <p>{message.text}</p>
                <span className="message-time">
                  {formatMessageTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="chat-input-container">
        <textarea
          className="chat-textarea"
          placeholder={`Message ${facilityName}...`}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!messageText.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
