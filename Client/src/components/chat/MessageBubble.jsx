import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'timeago.js';
import { addReaction } from '../../store/chatSlice';
import EmojiPicker from 'emoji-picker-react';

const MessageBubble = ({ message, previousMessage, onReply }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  
  const isOwn = message.sender?._id === currentUser?._id;
  const showAvatar = !previousMessage || 
    previousMessage.sender?._id !== message.sender?._id;
  
  const handleReaction = (emojiData) => {
    dispatch(addReaction({
      messageId: message._id,
      emoji: emojiData.emoji
    }));
    setShowEmojiPicker(false);
  };
  
  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'video-share':
        return (
          <div className="mt-2 bg-gray-800 rounded-lg overflow-hidden">
            <img 
              src={message.sharedVideo?.thumbnail} 
              alt={message.sharedVideo?.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-2">
              <h4 className="text-sm font-medium">{message.sharedVideo?.title}</h4>
              <button 
                onClick={() => window.open(`/watch/${message.sharedVideo?.videoId}`)}
                className="text-xs text-primary mt-1"
              >
                Watch Video
              </button>
            </div>
          </div>
        );
        
      case 'emoji':
        return (
          <div className="text-4xl">{message.content}</div>
        );
        
      default:
        return (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        );
    }
  };
  
  return (
    <div 
      className={`flex gap-2 mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar for other users' messages */}
      {!isOwn && showAvatar && (
        <img
          src={message.sender?.avatar || '/default-avatar.png'}
          alt={message.sender?.name}
          className="w-8 h-8 rounded-full self-end"
        />
      )}
      
      {/* Message Content */}
      <div className={`max-w-[70%] ${!isOwn && !showAvatar ? 'ml-10' : ''}`}>
        {/* Sender name (for group chats) */}
        {!isOwn && showAvatar && message.sender?.name && (
          <p className="text-xs text-gray-400 mb-1 ml-2">
            {message.sender.name}
          </p>
        )}
        
        {/* Reply preview */}
        {message.replyTo && (
          <div className="mb-1 p-2 bg-gray-800 rounded-lg text-xs">
            <p className="text-primary">Replying to {message.replyTo.sender?.name}</p>
            <p className="text-gray-400 truncate">{message.replyTo.content}</p>
          </div>
        )}
        
        {/* Main message bubble */}
        <div className={`relative group ${isOwn ? 'flex justify-end' : ''}`}>
          <div className={`message-bubble ${isOwn ? 'sent' : 'received'}`}>
            {renderMessageContent()}
            
            {/* Message footer */}
            <div className={`flex items-center gap-2 mt-1 text-xs ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <span className="text-gray-400">
                {format(message.createdAt)}
              </span>
              
              {isOwn && message.read && (
                <span className="text-primary">✓✓</span>
              )}
            </div>
          </div>
          
          {/* Message actions (on hover) */}
          {showActions && (
            <div className={`absolute top-0 ${isOwn ? 'left-0' : 'right-0'} -translate-y-full bg-gray-800 rounded-full p-1 shadow-lg flex gap-1`}>
              <button
                onClick={onReply}
                className="p-1 hover:bg-gray-700 rounded-full"
                title="Reply"
              >
                ↩️
              </button>
              <button
                onClick={() => setShowEmojiPicker(true)}
                className="p-1 hover:bg-gray-700 rounded-full"
                title="React"
              >
                😊
              </button>
            </div>
          )}
        </div>
        
        {/* Reactions */}
        {message.reactions?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction, idx) => (
              <span
                key={idx}
                className="bg-gray-800 rounded-full px-2 py-0.5 text-sm flex items-center gap-1"
              >
                {reaction.emoji} {reaction.users.length}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute z-50">
          <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)} />
          <div className="absolute bottom-0 right-0">
            <EmojiPicker onEmojiClick={handleReaction} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;