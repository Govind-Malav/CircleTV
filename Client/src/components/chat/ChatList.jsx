import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchChats, 
  selectAllChats, 
  selectUnreadCount,
  setActiveChat 
} from '../../store/chatSlice';
import ChatListItem from './ChatListItem';
import LoadingSpinner from '../common/LoadingSpinner';

const ChatList = ({ onSelectChat }) => {
  const dispatch = useDispatch();
  const chats = useSelector(selectAllChats);
  const unreadCount = useSelector(selectUnreadCount);
  const loading = useSelector(state => state.chat.loading);
  
  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);
  
  const handleChatSelect = (chat) => {
    dispatch(setActiveChat(chat));
    if (onSelectChat) onSelectChat(chat);
  };
  
  if (loading && chats.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Chats</h2>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        
        {/* Search */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search chats..."
            className="input-custom text-sm"
          />
        </div>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No chats yet</p>
            <button className="btn-primary mt-3 text-sm">
              Start New Chat
            </button>
          </div>
        ) : (
          chats.map(chat => (
            <ChatListItem
              key={chat._id}
              chat={chat}
              onClick={() => handleChatSelect(chat)}
            />
          ))
        )}
      </div>
      
      {/* New Chat Button */}
      <div className="p-4 border-t border-gray-800">
        <button className="btn-primary w-full">
          New Message
        </button>
      </div>
    </div>
  );
};

export default ChatList;