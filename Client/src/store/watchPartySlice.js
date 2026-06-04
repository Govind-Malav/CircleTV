import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { watchPartyAPI } from '../services/api';

// ── Async Thunks ───────────────────────────────────────────────────────────────

export const createParty = createAsyncThunk(
  'watchParty/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await watchPartyAPI.createParty(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create watch party');
    }
  }
);

export const fetchParty = createAsyncThunk(
  'watchParty/fetch',
  async (id, { rejectWithValue }) => {
    try {
      const response = await watchPartyAPI.getParty(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch watch party');
    }
  }
);

export const joinParty = createAsyncThunk(
  'watchParty/join',
  async (id, { rejectWithValue }) => {
    try {
      const response = await watchPartyAPI.joinParty(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join watch party');
    }
  }
);

export const leaveParty = createAsyncThunk(
  'watchParty/leave',
  async (id, { rejectWithValue }) => {
    try {
      await watchPartyAPI.leaveParty(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to leave watch party');
    }
  }
);

export const deleteParty = createAsyncThunk(
  'watchParty/delete',
  async (id, { rejectWithValue }) => {
    try {
      await watchPartyAPI.deleteParty(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete watch party');
    }
  }
);

export const addToQueue = createAsyncThunk(
  'watchParty/addToQueue',
  async ({ partyId, videoId }, { rejectWithValue }) => {
    try {
      const response = await watchPartyAPI.addToQueue(partyId, videoId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to queue');
    }
  }
);

export const removeFromQueue = createAsyncThunk(
  'watchParty/removeFromQueue',
  async ({ partyId, videoId }, { rejectWithValue }) => {
    try {
      await watchPartyAPI.removeFromQueue(partyId, videoId);
      return videoId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from queue');
    }
  }
);

// ── Initial State ──────────────────────────────────────────────────────────────
const initialState = {
  currentParty: null,        // The active watch party
  participants: [],          // List of participants
  queue: [],                 // Video queue
  messages: [],              // Party chat messages
  reactions: [],             // Live floating reactions
  isHost: false,             // Whether current user is the host
  
  // Sync state (controlled by socket events)
  isPlaying: false,
  currentTime: 0,
  
  loading: false,
  error: null,
};

// ── Slice ──────────────────────────────────────────────────────────────────────
const watchPartySlice = createSlice({
  name: 'watchParty',
  initialState,

  reducers: {
    // Sync video state from socket events
    syncVideoState: (state, action) => {
      const { isPlaying, currentTime } = action.payload;
      state.isPlaying = isPlaying;
      state.currentTime = currentTime;
    },

    // Update participant list (socket event)
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },

    // Add a participant (socket join event)
    addParticipant: (state, action) => {
      const exists = state.participants.find((p) => p._id === action.payload._id);
      if (!exists) state.participants.push(action.payload);
    },

    // Remove a participant (socket leave event)
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter((p) => p._id !== action.payload);
    },

    // Add a party chat message
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    // Add a live reaction (emoji float)
    addReaction: (state, action) => {
      const reaction = { ...action.payload, id: Date.now() + Math.random() };
      state.reactions.push(reaction);
      // Keep only last 20 reactions to avoid memory leak
      if (state.reactions.length > 20) {
        state.reactions = state.reactions.slice(-20);
      }
    },

    // Remove a reaction (after its animation ends)
    removeReaction: (state, action) => {
      state.reactions = state.reactions.filter((r) => r.id !== action.payload);
    },

    // Update queue from socket
    setQueue: (state, action) => {
      state.queue = action.payload;
    },

    // Clear party on end/leave
    clearParty: (state) => {
      return initialState;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE PARTY
      .addCase(createParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParty.fulfilled, (state, action) => {
        state.loading = false;
        state.currentParty = action.payload;
        state.isHost = true;
        state.participants = action.payload.participants || [];
        state.queue = action.payload.queue || [];
        state.isPlaying = action.payload.isPlaying || false;
        state.currentTime = action.payload.currentTime || 0;
      })
      .addCase(createParty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PARTY
      .addCase(fetchParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParty.fulfilled, (state, action) => {
        state.loading = false;
        state.currentParty = action.payload;
        state.participants = action.payload.participants || [];
        state.queue = action.payload.queue || [];
        state.isPlaying = action.payload.isPlaying || false;
        state.currentTime = action.payload.currentTime || 0;
      })
      .addCase(fetchParty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // JOIN PARTY
      .addCase(joinParty.fulfilled, (state, action) => {
        state.currentParty = action.payload;
        state.participants = action.payload.participants || [];
        state.queue = action.payload.queue || [];
        state.isPlaying = action.payload.isPlaying || false;
        state.currentTime = action.payload.currentTime || 0;
        state.isHost = false;
      })
      .addCase(joinParty.rejected, (state, action) => {
        state.error = action.payload;
      })

      // LEAVE PARTY
      .addCase(leaveParty.fulfilled, (state) => {
        return initialState;
      })

      // DELETE PARTY
      .addCase(deleteParty.fulfilled, (state) => {
        return initialState;
      })

      // ADD TO QUEUE
      .addCase(addToQueue.fulfilled, (state, action) => {
        state.queue = action.payload.queue || state.queue;
      })

      // REMOVE FROM QUEUE
      .addCase(removeFromQueue.fulfilled, (state, action) => {
        state.queue = state.queue.filter((v) => v._id !== action.payload);
      });
  },
});

// ── Selectors ──────────────────────────────────────────────────────────────────
export const selectCurrentParty     = (state) => state.watchParty.currentParty;
export const selectParticipants     = (state) => state.watchParty.participants;
export const selectQueue            = (state) => state.watchParty.queue;
export const selectPartyMessages    = (state) => state.watchParty.messages;
export const selectReactions        = (state) => state.watchParty.reactions;
export const selectIsHost           = (state) => state.watchParty.isHost;
export const selectIsPlaying        = (state) => state.watchParty.isPlaying;
export const selectCurrentTime      = (state) => state.watchParty.currentTime;
export const selectWatchPartyLoading = (state) => state.watchParty.loading;
export const selectWatchPartyError  = (state) => state.watchParty.error;

export const {
  syncVideoState,
  setParticipants,
  addParticipant,
  removeParticipant,
  addMessage,
  addReaction,
  removeReaction,
  setQueue,
  clearParty,
  clearError,
} = watchPartySlice.actions;

export default watchPartySlice.reducer;
