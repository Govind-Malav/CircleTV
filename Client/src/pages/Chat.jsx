import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chatAPI } from '../services/api';
import socketService from '../services/socketService';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { formatRelativeTime } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

// ── Conversation List Item ─────────────────────────────────────────────────────
const ConversationItem = ({ chat, isActive, onSelect, currentUserId }) => {
  const other = chat.participants?.find((p) => p._id !== currentUserId);
  return (
    <button
      onClick={() => onSelect(chat)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
        isActive ? 'bg-violet-600/20' : 'hover:bg-gray-800'
      }`}
    >
      <div className="relative shrink-0">
        <img
          src={other?.avatar || `https://ui-avatars.com/api/?name=${other?.username}&background=7C3AED&color=fff&size=40`}
          alt={other?.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        {chat.unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-0.5">
            {chat.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{other?.username}</p>
        <p className="text-xs text-gray-400 truncate">
          {chat.lastMessage?.content || 'No messages yet'}
        </p>
      </div>
      {chat.lastMessage?.createdAt && (
        <span className="text-[10px] text-gray-500 shrink-0">
          {formatRelativeTime(chat.lastMessage.createdAt)}
        </span>
      )}
    </button>
  );
};

// ── Message Bubble ─────────────────────────────────────────────────────────────
const MessageBubble = ({ message, isOwn }) => (
  <div className={`flex gap-2 mb-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
    {!isOwn && (
      <img
        src={message.sender?.avatar || `https://ui-avatars.com/api/?name=${message.sender?.username}&background=7C3AED&color=fff&size=28`}
        alt=""
        className="w-7 h-7 rounded-full shrink-0 mt-auto"
      />
    )}
    <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
      <div className={`px-4 py-2 rounded-2xl text-sm ${
        isOwn
          ? 'bg-violet-600 text-white rounded-br-sm'
          : 'bg-gray-800 text-gray-100 rounded-bl-sm'
      }`}>
        {message.content}
      </div>
      <span className="text-[10px] text-gray-500 mt-1 px-1">
        {formatRelativeTime(message.createdAt)}
      </span>
    </div>
  </div>
);

// ── Main Chat Page ─────────────────────────────────────────────────────────────
const Chat = () => {
  const currentUser = useSelector(selectUser);
  const { chatId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load conversations
  useEffect(() => {
    const load = async () => {
      try {
        const response = await chatAPI.getConversations();
        setConversations(response.data?.data || []);
      } catch { } finally { setLoadingChats(false); }
    };
    load();
  }, []);

  // Load messages when chat selected
  const selectChat = useCallback(async (chat) => {
    setActiveChat(chat);
    setLoadingMessages(true);
    try {
      const response = await chatAPI.getMessages(chat._id);
      setMessages(response.data?.data || []);
      socketService.joinChat(chat._id);
    } catch { } finally { setLoadingMessages(false); }
  }, []);

  // Socket: receive messages
  useEffect(() => {
    const handleMessage = (message) => {
      if (message.chat === activeChat?._id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      // Update last message in conversations list
      setConversations(prev => prev.map(c =>
        c._id === message.chat ? { ...c, lastMessage: message } : c
      ));
    };
    socketService.on('message:new', handleMessage);
    return () => socketService.off('message:new', handleMessage);
  }, [activeChat, scrollToBottom]);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;
    const content = messageInput.trim();
    setMessageInput('');

    // Optimistic update
    const optimistic = {
      _id: Date.now(),
      content,
      sender: currentUser,
      chat: activeChat._id,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      socketService.sendMessage(activeChat._id, content);
    } catch {
      setMessages(prev => prev.filter(m => m._id !== optimistic._id));
    }
  };

  const other = activeChat?.participants?.find((p) => p._id !== currentUser?._id);

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* ── Conversations sidebar ──────────────────────────────── */}
      <div className={`${showSidebar ? 'w-72' : 'w-0'} md:w-72 shrink-0 border-r border-gray-800 bg-gray-900 flex flex-col overflow-hidden transition-all`}>
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {loadingChats ? (
            <div className="flex justify-center pt-8">
              <LoadingSpinner size="md" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map(chat => (
              <ConversationItem
                key={chat._id}
                chat={chat}
                isActive={activeChat?._id === chat._id}
                onSelect={selectChat}
                currentUserId={currentUser?._id}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Message area ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-900">
              <img
                src={other?.avatar || `https://ui-avatars.com/api/?name=${other?.username}&background=7C3AED&color=fff&size=36`}
                alt={other?.username}
                className="w-9 h-9 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold text-white">{other?.username}</p>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg._id}
                      message={msg}
                      isOwn={msg.sender?._id === currentUser?._id || msg.sender === currentUser?._id}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="flex items-center gap-2 px-4 py-3 border-t border-gray-800 bg-gray-900">
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder={`Message ${other?.username}…`}
                className="flex-1 bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="w-9 h-9 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Your messages</h3>
            <p className="text-gray-400 text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
