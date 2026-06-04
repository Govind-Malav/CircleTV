import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { communityAPI } from '../services/api';
import socketService from '../services/socketService';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { formatRelativeTime } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

// ── Message component ─────────────────────────────────────────────────────────
const Message = ({ msg, currentUserId }) => {
  const isOwn = msg.sender?._id === currentUserId;
  return (
    <div className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''} group`}>
      <img
        src={msg.sender?.avatar || `https://ui-avatars.com/api/?name=${msg.sender?.username}&background=7C3AED&color=fff&size=32`}
        alt=""
        className="w-8 h-8 rounded-full shrink-0"
      />
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[60%]`}>
        <span className="text-xs text-gray-500 mb-1">
          {msg.sender?.username} · {formatRelativeTime(msg.createdAt)}
        </span>
        <div className={`px-3 py-2 rounded-2xl text-sm ${
          isOwn ? 'bg-violet-600 text-white rounded-br-sm' : 'bg-gray-800 text-gray-100 rounded-bl-sm'
        }`}>
          {msg.content}
        </div>
      </div>
    </div>
  );
};

// ── Community Channel Page ─────────────────────────────────────────────────────
const CommunityChannel = () => {
  const { communityId, channelId } = useParams();
  const currentUser = useSelector(selectUser);
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Load channel info + messages
        const [chanRes, msgRes] = await Promise.all([
          communityAPI.getChannel(communityId, channelId),
          communityAPI.getChannelMessages(communityId, channelId),
        ]);
        setChannel(chanRes.data?.data || chanRes.data);
        setMessages(msgRes.data?.data || []);

        // Join socket room
        socketService.joinCommunityChannel(communityId, channelId);
      } catch (err) {
        console.error('[CommunityChannel] Load error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (communityId && channelId) init();

    // Socket: receive new community messages
    const handleMessage = (msg) => {
      if (msg.channel === channelId) {
        setMessages(prev => [...prev, msg]);
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    socketService.on('community:message', handleMessage);

    return () => {
      socketService.leaveCommunityChannel(communityId, channelId);
      socketService.off('community:message', handleMessage);
    };
  }, [communityId, channelId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const content = input.trim();
    setInput('');
    socketService.sendCommunityMessage(communityId, channelId, content);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Channel header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-900/50">
        <span className="text-gray-400">#</span>
        <h2 className="text-base font-semibold text-white">{channel?.name || 'general'}</h2>
        {channel?.description && (
          <>
            <span className="text-gray-600">|</span>
            <p className="text-sm text-gray-400 truncate">{channel.description}</p>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3">#</div>
            <h3 className="text-lg font-bold text-white">Welcome to #{channel?.name}</h3>
            <p className="text-gray-400 text-sm">This is the beginning of the channel</p>
          </div>
        ) : (
          messages.map((msg) => (
            <Message key={msg._id} msg={msg} currentUserId={currentUser?._id} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-900/50">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Message #${channel?.name || 'general'}`}
            className="flex-1 bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunityChannel;
