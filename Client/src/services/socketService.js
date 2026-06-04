import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

const socketService = {
  /**
   * Connect to the socket server with JWT auth
   */
  connect: (token) => {
    if (socket?.connected) return socket;

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    return socket;
  },

  /**
   * Disconnect the socket
   */
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  /**
   * Get the socket instance
   */
  getSocket: () => socket,

  /**
   * Emit an event
   */
  emit: (event, data) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn('[Socket] Not connected. Cannot emit:', event);
    }
  },

  /**
   * Listen to an event
   */
  on: (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  },

  /**
   * Remove a specific listener
   */
  off: (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  },

  // ── Chat Events ────────────────────────────────────────────────────────────
  joinChat: (chatId) => socketService.emit('chat:join', { chatId }),
  leaveChat: (chatId) => socketService.emit('chat:leave', { chatId }),
  sendMessage: (data) => socketService.emit('chat:message:send', data),
  deleteMessage: (data) => socketService.emit('chat:message:delete', data),
  startTyping: (chatId) => socketService.emit('chat:typing:start', { chatId }),
  stopTyping: (chatId) => socketService.emit('chat:typing:stop', { chatId }),
  markRead: (chatId, messageId) => socketService.emit('chat:read', { chatId, messageId }),
  shareVideo: (data) => socketService.emit('chat:video:share', data),

  // ── Community Events ───────────────────────────────────────────────────────
  joinCommunity: (communityId) => socketService.emit('community:join', { communityId }),
  leaveCommunity: (communityId) => socketService.emit('community:leave', { communityId }),
  joinCommunityChannel: (channelId) => socketService.emit('community:channel:join', { channelId }),
  leaveCommunityChannel: (channelId) => socketService.emit('community:channel:leave', { channelId }),
  sendCommunityMessage: (data) => socketService.emit('community:message:send', data),
  deleteCommunityMessage: (data) => socketService.emit('community:message:delete', data),

  // ── Watch Party Events ────────────────────────────────────────────────────
  joinParty: (partyId) => socketService.emit('watchparty:join', { partyId }),
  leaveParty: (partyId) => socketService.emit('watchparty:leave', { partyId }),
  playVideo: (partyId, timestamp) => socketService.emit('watchparty:play', { partyId, timestamp }),
  pauseVideo: (partyId, timestamp) => socketService.emit('watchparty:pause', { partyId, timestamp }),
  seekVideo: (partyId, timestamp) => socketService.emit('watchparty:seek', { partyId, timestamp }),
  sendReaction: (partyId, emoji) => socketService.emit('watchparty:reaction', { partyId, emoji }),
  sendPartyMessage: (data) => socketService.emit('watchparty:chat:message', data),
  addToQueue: (partyId, videoId) => socketService.emit('watchparty:queue:add', { partyId, videoId }),
  skipQueue: (partyId) => socketService.emit('watchparty:queue:skip', { partyId }),
};

export default socketService;