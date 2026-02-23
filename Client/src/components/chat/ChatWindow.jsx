import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMessages,
  sendMessage,
  selectMessagesByChatId,
  selectActiveChat,
  selectTypingUsersByChatId,
  selectSendingMessage,
  saveDraft,
  selectDraftByChatId,
  setReplyTo,
  selectReplyTo,
  clearReplyTo
} from '../../store/chatSlice';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useSocket } from '../../context/SocketContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const messagesEndRef = useRef();
  const chatContainerRef = useRef();
  
  const activeChat = useSelector(selectActiveChat);
  const messages = useSelector(state => 
    selectMessagesByChatId(state, activeChat?._id)
  );
  const typingUsers = useSelector(state => 
    selectTypingUsersByChatId(state, activeChat?._id)
  );
  const sending = useSelector(selectSendingMessage);
  const savedDraft = useSelector(state => 
    selectDraftByChatId(state, activeChat?._id)
  );
  const replyTo = useSelector(selectReplyTo);
  
  const [input, setInput] = useState(savedDraft || '');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  useEffect(() => {
    if (activeChat) {
      // Load messages
      dispatch(fetchMessages({ chatId: activeChat._id, page: 1 }));
      setPage(1);
      
      // Join socket room
      socket.joinChat(activeChat._id);
      
      return () => {
        socket.leaveChat(activeChat._id);
        dispatch(clearReplyTo());
      };
    }
  }, [activeChat, dispatch, socket]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleScroll = async () => {
    if (!chatContainerRef.current || !hasMore || loadingMore) return;
    
    const { scrollTop } = chatContainerRef.current;
    if (scrollTop === 0) {
      setLoadingMore(true);
      const nextPage = page + 1;
      const result = await dispatch(fetchMessages({ 
        chatId: activeChat._id, 
        page: nextPage 
      }));
      
      if (fetchMessages.fulfilled.match(result)) {
        setPage(nextPage);
        setHasMore(result.payload.hasMore);
      }
      setLoadingMore(false);
    }
  };
  
  const handleSend = () => {
    if (input.trim()) {
      dispatch(sendMessage({
        chatId: activeChat._id,
        content: input,
        messageType: 'text',
        replyTo: replyTo?._id
      }));
      
      setInput('');
      dispatch(saveDraft({ chatId: activeChat._id, draft: '' }));
      dispatch(clearReplyTo());
      socket.sendTyping(activeChat._id, false);
    }
  };
  
  const handleTyping = (isTyping) => {
    socket.sendTyping(activeChat._id, isTyping);
  };
  
  if (!activeChat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-gray-400">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <img
          src={activeChat.avatar || '/default-avatar.png'}
          alt={activeChat.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-white">{activeChat.name}</h3>
          {typingUsers.length > 0 && (
            <p className="text-xs text-primary">
              {typingUsers.length} typing...
            </p>
          )}
        </div>
      </div>
      
      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar"
      >
        {loadingMore && (
          <div className="text-center py-2">
            <span className="text-gray-400">Loading older messages...</span>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            previousMessage={messages[index - 1]}
            onReply={() => dispatch(setReplyTo(msg))}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Reply Preview */}
      {replyTo && (
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-primary">Replying to {replyTo.sender?.name}</p>
            <p className="text-sm text-gray-300 truncate">{replyTo.content}</p>
          </div>
          <button
            onClick={() => dispatch(clearReplyTo())}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Message Input */}
      <MessageInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onTyping={handleTyping}
        disabled={sending}
        chatId={activeChat._id}
      />
    </div>
  );
};

export default ChatWindow;