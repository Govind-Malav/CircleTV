import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatAPI } from '../services/api';


// ASYNC THUNKS - Chat API calls


// Fetch all chats for the current user
export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chats');
    }
  }
);

// Fetch a single chat by ID (with messages)
export const fetchChatById = createAsyncThunk(
  'chat/fetchChatById',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChat(chatId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat');
    }
  }
);

// Create a new direct message chat
export const createDirectChat = createAsyncThunk(
  'chat/createDirect',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.createChat({ participantId: userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create chat');
    }
  }
);

// Create a new group chat
export const createGroupChat = createAsyncThunk(
  'chat/createGroup',
  async ({ name, participants, avatar }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.createGroupChat({ name, participants, avatar });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create group');
    }
  }
);

// Fetch messages for a specific chat (with pagination)
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ chatId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getMessages(chatId, page);
      return { chatId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

// Send a new message (this will also be handled by socket, but we need API for history)
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, content, messageType = 'text', sharedVideo }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.sendMessage(chatId, { 
        content, 
        messageType,
        sharedVideo 
      });
      return { chatId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

// Delete a message
export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async ({ chatId, messageId }, { rejectWithValue }) => {
    try {
      await chatAPI.deleteMessage(chatId, messageId);
      return { chatId, messageId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete message');
    }
  }
);

// Add reaction to message
export const addReaction = createAsyncThunk(
  'chat/addReaction',
  async ({ messageId, emoji }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.addReaction(messageId, emoji);
      return { messageId, reactions: response.data.reactions };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add reaction');
    }
  }
);

// Search messages in a chat
export const searchMessages = createAsyncThunk(
  'chat/searchMessages',
  async ({ chatId, query }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.searchMessages(chatId, query);
      return { chatId, results: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search messages');
    }
  }
);

// Mark messages as read
export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async ({ chatId, messageIds }, { rejectWithValue }) => {
    try {
      await chatAPI.markAsRead(chatId, messageIds);
      return { chatId, messageIds };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

// ========================================
// INITIAL STATE
// ========================================
const initialState = {
  // All chats list (sidebar)
  chats: [],
  
  // Currently active chat
  activeChat: null,
  
  // Messages organized by chatId
  messages: {},           // { chatId1: [msg1, msg2], chatId2: [msg3, msg4] }
  
  // Pagination for messages
  messagePagination: {},  // { chatId1: { page: 1, hasMore: true } }
  
  // Typing indicators
  typingUsers: {},        // { chatId1: [userId1, userId2] }
  
  // Online status of users
  onlineUsers: [],        // [userId1, userId2]
  
  // Search results
  searchResults: [],      // For global chat search
  searchQuery: '',
  
  // UI states
  loading: false,
  sendingMessage: false,
  error: null,
  
  // Unread counts
  unreadCount: 0,         // Total unread messages
  chatUnreadCounts: {},   // { chatId1: 3, chatId2: 1 }
  
  // Message drafts (unsaved messages)
  drafts: {},             // { chatId1: "draft text" }
  
  // Reply to specific message
  replyTo: null,          // { chatId, messageId, content }
};

// ========================================
// CHAT SLICE
// ========================================
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  
  // Reducers - synchronous actions (mostly for socket updates)
  reducers: {
    // Set active chat
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      
      // Mark messages as read when opening chat
      if (action.payload) {
        const chatId = action.payload._id;
        if (state.chatUnreadCounts[chatId]) {
          state.unreadCount -= state.chatUnreadCounts[chatId];
          state.chatUnreadCounts[chatId] = 0;
        }
      }
    },
    
    // Add a new message (from socket)
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      
      // Initialize messages array if needed
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      
      // Add message
      state.messages[chatId].push(message);
      
      // Update last message in chat list
      const chatIndex = state.chats.findIndex(c => c._id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = message;
        state.chats[chatIndex].updatedAt = new Date().toISOString();
        
        // Move chat to top of list
        const chat = state.chats[chatIndex];
        state.chats.splice(chatIndex, 1);
        state.chats.unshift(chat);
      }
      
      // Increment unread count if not active chat
      if (!state.activeChat || state.activeChat._id !== chatId) {
        state.chatUnreadCounts[chatId] = (state.chatUnreadCounts[chatId] || 0) + 1;
        state.unreadCount += 1;
      }
    },
    
    // Update message (edit, delete, reaction)
    updateMessage: (state, action) => {
      const { chatId, messageId, updates } = action.payload;
      
      if (state.messages[chatId]) {
        const messageIndex = state.messages[chatId].findIndex(m => m._id === messageId);
        if (messageIndex !== -1) {
          state.messages[chatId][messageIndex] = {
            ...state.messages[chatId][messageIndex],
            ...updates
          };
        }
      }
    },
    
    // Set typing indicator
    setTyping: (state, action) => {
      const { chatId, userId, isTyping } = action.payload;
      
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = [];
      }
      
      if (isTyping) {
        if (!state.typingUsers[chatId].includes(userId)) {
          state.typingUsers[chatId].push(userId);
        }
      } else {
        state.typingUsers[chatId] = state.typingUsers[chatId].filter(id => id !== userId);
      }
    },
    
    // Update online users
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
      
      // Update online status in chats list
      state.chats.forEach(chat => {
        if (chat.type === 'direct') {
          const otherParticipant = chat.participants?.find(p => 
            !p._id || p._id !== state.activeChat?.participants?.[0]?._id
          );
          if (otherParticipant) {
            otherParticipant.online = state.onlineUsers.includes(otherParticipant._id);
          }
        }
      });
    },
    
    // Save message draft
    saveDraft: (state, action) => {
      const { chatId, draft } = action.payload;
      state.drafts[chatId] = draft;
    },
    
    // Clear draft
    clearDraft: (state, action) => {
      const { chatId } = action.payload;
      delete state.drafts[chatId];
    },
    
    // Set reply to message
    setReplyTo: (state, action) => {
      state.replyTo = action.payload;
    },
    
    // Clear reply
    clearReplyTo: (state) => {
      state.replyTo = null;
    },
    
    // Mark messages as read (socket sync)
    markMessagesRead: (state, action) => {
      const { chatId, messageIds } = action.payload;
      
      if (state.messages[chatId]) {
        state.messages[chatId] = state.messages[chatId].map(msg => {
          if (messageIds.includes(msg._id)) {
            return { ...msg, read: true };
          }
          return msg;
        });
      }
    },
    
    // Clear search results
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset all chat state (logout)
    resetChat: (state) => {
      return initialState;
    },
  },
  
  // Extra reducers - handle async thunk actions
  extraReducers: (builder) => {
    builder
      // ===== FETCH CHATS =====
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
        
        // Calculate total unread
        state.unreadCount = action.payload.reduce(
          (total, chat) => total + (chat.unreadCount || 0), 0
        );
        
        // Store per-chat unread counts
        action.payload.forEach(chat => {
          state.chatUnreadCounts[chat._id] = chat.unreadCount || 0;
        });
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===== FETCH SINGLE CHAT =====
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.activeChat = action.payload.chat;
        
        // Update in chats list if exists
        const index = state.chats.findIndex(c => c._id === action.payload.chat._id);
        if (index !== -1) {
          state.chats[index] = action.payload.chat;
        } else {
          state.chats.unshift(action.payload.chat);
        }
      })
      
      // ===== CREATE DIRECT CHAT =====
      .addCase(createDirectChat.fulfilled, (state, action) => {
        // Add to chats list if not already there
        const exists = state.chats.some(c => c._id === action.payload._id);
        if (!exists) {
          state.chats.unshift(action.payload);
        }
        state.activeChat = action.payload;
      })
      
      // ===== CREATE GROUP CHAT =====
      .addCase(createGroupChat.fulfilled, (state, action) => {
        state.chats.unshift(action.payload);
        state.activeChat = action.payload;
      })
      
      // ===== FETCH MESSAGES =====
      .addCase(fetchMessages.pending, (state, action) => {
        const { chatId } = action.meta.arg;
        if (!state.messages[chatId] || action.meta.arg.page === 1) {
          state.loading = true;
        }
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { chatId, messages, page, hasMore } = action.payload;
        
        if (page === 1) {
          // First page - replace messages
          state.messages[chatId] = messages;
        } else {
          // Load more - prepend to existing (older messages)
          state.messages[chatId] = [...messages, ...(state.messages[chatId] || [])];
        }
        
        // Update pagination info
        state.messagePagination[chatId] = {
          page,
          hasMore
        };
        
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.loading = false;
      })
      
      // ===== SEND MESSAGE =====
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, message } = action.payload;
        
        // Add message (though socket will also add it)
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        
        // Check if message already exists (avoid duplicates)
        const exists = state.messages[chatId].some(m => m._id === message._id);
        if (!exists) {
          state.messages[chatId].push(message);
        }
        
        // Update last message in chat list
        const chatIndex = state.chats.findIndex(c => c._id === chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex].lastMessage = message;
          state.chats[chatIndex].updatedAt = new Date().toISOString();
          
          // Move to top
          const chat = state.chats[chatIndex];
          state.chats.splice(chatIndex, 1);
          state.chats.unshift(chat);
        }
        
        state.sendingMessage = false;
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
      })
      
      // ===== DELETE MESSAGE =====
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { chatId, messageId } = action.payload;
        
        if (state.messages[chatId]) {
          state.messages[chatId] = state.messages[chatId].map(msg => 
            msg._id === messageId 
              ? { ...msg, deleted: true, content: 'This message was deleted' }
              : msg
          );
        }
      })
      
      // ===== ADD REACTION =====
      .addCase(addReaction.fulfilled, (state, action) => {
        const { messageId, reactions } = action.payload;
        
        // Find and update message in all chats
        Object.keys(state.messages).forEach(chatId => {
          const msgIndex = state.messages[chatId]?.findIndex(m => m._id === messageId);
          if (msgIndex !== -1) {
            state.messages[chatId][msgIndex].reactions = reactions;
          }
        });
      })
      
      // ===== SEARCH MESSAGES =====
      .addCase(searchMessages.fulfilled, (state, action) => {
        state.searchResults = action.payload.results;
      })
      
      // ===== MARK AS READ =====
      .addCase(markAsRead.fulfilled, (state, action) => {
        const { chatId, messageIds } = action.payload;
        
        if (state.messages[chatId]) {
          state.messages[chatId] = state.messages[chatId].map(msg => {
            if (messageIds.includes(msg._id)) {
              return { ...msg, read: true };
            }
            return msg;
          });
        }
      });
  },
});

// ========================================
// SELECTORS - Helper functions to get state
// ========================================

// Basic selectors
export const selectAllChats = (state) => state.chat.chats;
export const selectActiveChat = (state) => state.chat.activeChat;
export const selectChatMessages = (state) => state.chat.messages;
export const selectChatLoading = (state) => state.chat.loading;
export const selectSendingMessage = (state) => state.chat.sendingMessage;
export const selectChatError = (state) => state.chat.error;
export const selectUnreadCount = (state) => state.chat.unreadCount;
export const selectTypingUsers = (state) => state.chat.typingUsers;
export const selectOnlineUsers = (state) => state.chat.onlineUsers;
export const selectSearchResults = (state) => state.chat.searchResults;
export const selectDrafts = (state) => state.chat.drafts;
export const selectReplyTo = (state) => state.chat.replyTo;

// Get messages for a specific chat
export const selectMessagesByChatId = (state, chatId) => 
  state.chat.messages[chatId] || [];

// Get typing users for a specific chat
export const selectTypingUsersByChatId = (state, chatId) => 
  state.chat.typingUsers[chatId] || [];

// Get unread count for a specific chat
export const selectUnreadCountByChatId = (state, chatId) => 
  state.chat.chatUnreadCounts[chatId] || 0;

// Get draft for a specific chat
export const selectDraftByChatId = (state, chatId) => 
  state.chat.drafts[chatId] || '';

// Check if user is online
export const selectIsUserOnline = (state, userId) => 
  state.chat.onlineUsers.includes(userId);

// Get chat with another user (for DM)
export const selectDirectChatWithUser = (state, userId) => 
  state.chat.chats.find(chat => 
    chat.type === 'direct' && 
    chat.participants?.some(p => p._id === userId)
  );

// Get chat name for display
export const selectChatDisplayName = (state, chat) => {
  if (!chat) return '';
  
  if (chat.type === 'group') {
    return chat.name;
  }
  
  // For direct messages, show other participant's name
  const currentUserId = state.auth.user?._id;
  const otherParticipant = chat.participants?.find(p => p._id !== currentUserId);
  return otherParticipant?.name || otherParticipant?.username || 'Unknown User';
};

// Get chat avatar
export const selectChatAvatar = (state, chat) => {
  if (!chat) return null;
  
  if (chat.type === 'group') {
    return chat.avatar;
  }
  
  // For direct messages, show other participant's avatar
  const currentUserId = state.auth.user?._id;
  const otherParticipant = chat.participants?.find(p => p._id !== currentUserId);
  return otherParticipant?.avatar;
};


// EXPORTS

export const {
  setActiveChat,
  addMessage,
  updateMessage,
  setTyping,
  setOnlineUsers,
  saveDraft,
  clearDraft,
  setReplyTo,
  clearReplyTo,
  markMessagesRead,
  clearSearch,
  clearError,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;