import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParty, joinParty, leaveParty, syncVideoState, addMessage, addParticipant, removeParticipant, addReaction, removeReaction, selectCurrentParty, selectParticipants, selectPartyMessages, selectReactions, selectIsHost, selectIsPlaying, selectCurrentTime } from '../store/watchPartySlice';
import { selectUser } from '../store/authSlice';
import socketService from '../services/socketService';
import { PARTY_REACTIONS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCount } from '../utils/formatters';

const WatchPartyPage = () => {
  const { partyId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const party = useSelector(selectCurrentParty);
  const participants = useSelector(selectParticipants);
  const messages = useSelector(selectPartyMessages);
  const reactions = useSelector(selectReactions);
  const isHost = useSelector(selectIsHost);
  const isPlaying = useSelector(selectIsPlaying);
  const currentTime = useSelector(selectCurrentTime);

  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(fetchParty(partyId)).unwrap();
        await dispatch(joinParty(partyId)).unwrap();
        socketService.joinWatchParty(partyId);
      } catch { navigate('/'); } finally { setLoading(false); }
    };
    init();

    // Socket listeners
    socketService.on('party:sync', ({ isPlaying, currentTime }) => dispatch(syncVideoState({ isPlaying, currentTime })));
    socketService.on('party:message', (msg) => dispatch(addMessage(msg)));
    socketService.on('party:user_joined', (user) => dispatch(addParticipant(user)));
    socketService.on('party:user_left', ({ userId }) => dispatch(removeParticipant(userId)));
    socketService.on('party:reaction', (reaction) => {
      dispatch(addReaction(reaction));
      setTimeout(() => dispatch(removeReaction(reaction.id)), 3000);
    });

    return () => {
      socketService.leaveWatchParty(partyId);
      ['party:sync','party:message','party:user_joined','party:user_left','party:reaction'].forEach(e => socketService.off(e));
    };
  }, [partyId, dispatch, navigate]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    socketService.sendPartyMessage(partyId, messageInput);
    setMessageInput('');
  };

  const sendReaction = (emoji) => {
    socketService.sendPartyReaction(partyId, emoji);
    setShowReactions(false);
  };

  const handleLeave = async () => {
    await dispatch(leaveParty(partyId));
    navigate('/');
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-950"><LoadingSpinner size="xl" /></div>;

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Video area */}
      <div className="flex-1 flex flex-col">
        {/* Video player */}
        <div className="relative flex-1 bg-black">
          {party?.currentVideo?.videoUrl ? (
            <video src={party.currentVideo.videoUrl} className="w-full h-full object-contain"
              controls={isHost} autoPlay={isPlaying} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No video playing</p>
            </div>
          )}

          {/* Floating reactions */}
          <div className="absolute bottom-16 left-4 pointer-events-none">
            {reactions.map(r => (
              <div key={r.id} className="text-3xl animate-bounce">{r.emoji}</div>
            ))}
          </div>

          {/* Reaction button */}
          <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
            {showReactions && (
              <div className="flex gap-2 bg-gray-900 border border-gray-800 rounded-full px-3 py-2">
                {PARTY_REACTIONS.map(emoji => (
                  <button key={emoji} onClick={() => sendReaction(emoji)} className="text-2xl hover:scale-125 transition-transform">{emoji}</button>
                ))}
              </div>
            )}
            <button onClick={() => setShowReactions(s => !s)}
              className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center text-lg hover:bg-gray-800 transition-colors">
              👍
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">{participants.length} watching</span>
          </div>
          <button onClick={handleLeave} className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg transition-colors">Leave party</button>
        </div>
      </div>

      {/* Right: Participants + Chat */}
      <div className="w-72 shrink-0 flex flex-col border-l border-gray-800">
        {/* Participants */}
        <div className="p-3 border-b border-gray-800">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Watching ({participants.length})</h3>
          <div className="flex flex-wrap gap-1">
            {participants.slice(0, 8).map(p => (
              <img key={p._id} src={p.avatar || `https://ui-avatars.com/api/?name=${p.username}&background=7C3AED&color=fff&size=32`}
                alt={p.username} title={p.username} className="w-8 h-8 rounded-full" />
            ))}
            {participants.length > 8 && <span className="text-xs text-gray-400">+{participants.length - 8}</span>}
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-2">
              <img src={msg.sender?.avatar || `https://ui-avatars.com/api/?name=${msg.sender?.username}&background=7C3AED&color=fff&size=24`}
                alt="" className="w-6 h-6 rounded-full shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-violet-400">{msg.sender?.username}</span>
                <p className="text-sm text-gray-300">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat input */}
        <form onSubmit={sendMessage} className="p-3 border-t border-gray-800 flex gap-2">
          <input value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder="Say something..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition-colors" />
          <button type="submit" className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default WatchPartyPage;
