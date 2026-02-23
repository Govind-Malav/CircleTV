import React from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { 
  selectUnreadCountByChatId,
  selectChatDisplayName,
  selectChatAvatar,
  selectIsUserOnline 
} from '../../store/chatSlice';

const ChatListItem = ({ chat, onClick, isActive }) => {
  const unreadCount = useSelector(state => 
    selectUnreadCountByChatId(state, chat._id)
  );
  
  const displayName = useSelector(state => 
    selectChatDisplayName(state, chat)
  );
  
  const avatar = useSelector(state => 
    selectChatAvatar(state, chat)
  );
  
  // Check online status for DMs
  const isOnline = useSelector(state => {
    if (chat.type !== 'direct') return false;
    const currentUserId = state.auth.user?._id;
    const otherUser = chat.participants?.find(p => p._id !== currentUserId);
    return otherUser ? selectIsUserOnline(state, otherUser._id) : false;
  });
  
  const lastMessage = chat.lastMessage;
  const lastMessageTime = lastMessage?.createdAt 
    ? formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })
    : '';
  
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors duration-200
        ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
    >
      {/* Avatar with online indicator */}
      <div className="relative">
        <img
          src={avatar || '/default-avatar.png'}
          alt={displayName}
          className="w-12 h-12 rounded-full object-cover"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-gray-900" />
        )}
      </div>
      
      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white truncate">
            {displayName}
          </h4>
          {lastMessageTime && (
            <span className="text-xs text-gray-400">
              {lastMessageTime}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-400 truncate">
            {lastMessage?.content || 'No messages yet'}
          </p>
          
          {unreadCount > 0 && (
            <span className="unread-badge ml-2">
              {unreadCount}
            </span>
          )}
        </div>
        
        {/* Typing indicator placeholder - will be filled by socket */}
        {chat.typing && (
          <div className="flex gap-1 mt-1">
            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
            <span className="w-1 h-1 bg-primary rounded-full animate-bounce animation-delay-200" />
            <span className="w-1 h-1 bg-primary rounded-full animate-bounce animation-delay-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;