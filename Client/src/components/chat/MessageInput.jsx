import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { saveDraft } from '../../store/chatSlice';
import EmojiPicker from 'emoji-picker-react';
import { 
  PaperAirplaneIcon,
  FaceSmileIcon,
  PhotoIcon,
  VideoCameraIcon 
} from '@heroicons/react/24/outline';

const MessageInput = ({ value, onChange, onSend, onTyping, disabled, chatId }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const textareaRef = useRef();
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    dispatch(saveDraft({ chatId, draft: newValue }));
    
    // Handle typing indicator
    if (typingTimeout) clearTimeout(typingTimeout);
    
    onTyping(true);
    
    setTypingTimeout(
      setTimeout(() => {
        onTyping(false);
      }, 1000)
    );
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  
  const handleEmojiClick = (emojiData) => {
    onChange(value + emojiData.emoji);
    setShowEmoji(false);
  };
  
  const handleShareVideo = () => {
    // Open video selector modal
    // This will be implemented later
  };
  
  return (
    <div className="p-4 border-t border-gray-800">
      {/* Attachment options */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleShareVideo}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition"
          title="Share Video"
        >
          <VideoCameraIcon className="w-5 h-5" />
        </button>
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition"
          title="Upload Photo"
        >
          <PhotoIcon className="w-5 h-5" />
        </button>
      </div>
      
      {/* Input area */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-10 py-3 max-h-32 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            rows="1"
            disabled={disabled}
          />
          
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="absolute right-3 bottom-3 text-gray-400 hover:text-white transition"
          >
            <FaceSmileIcon className="w-5 h-5" />
          </button>
          
          {/* Emoji picker */}
          {showEmoji && (
            <div className="absolute bottom-full right-0 mb-2">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className={`p-3 rounded-full transition ${
            value.trim() && !disabled
              ? 'bg-primary text-white hover:bg-blue-600'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;