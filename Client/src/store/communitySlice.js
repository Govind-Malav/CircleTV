import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { communityAPI } from '../services/api';

// ========================================
// ASYNC THUNKS - Community API calls
// ========================================

// Fetch all communities for current user
export const fetchCommunities = createAsyncThunk(
  'community/fetchCommunities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await communityAPI.getCommunities();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch communities');
    }
  }
);

// Fetch single community by ID
export const fetchCommunityById = createAsyncThunk(
  'community/fetchCommunityById',
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await communityAPI.getCommunity(communityId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch community');
    }
  }
);

// Create new community
export const createCommunity = createAsyncThunk(
  'community/createCommunity',
  async (communityData, { rejectWithValue }) => {
    try {
      const response = await communityAPI.createCommunity(communityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create community');
    }
  }
);

// Update community
export const updateCommunity = createAsyncThunk(
  'community/updateCommunity',
  async ({ communityId, data }, { rejectWithValue }) => {
    try {
      const response = await communityAPI.updateCommunity(communityId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update community');
    }
  }
);

// Delete community
export const deleteCommunity = createAsyncThunk(
  'community/deleteCommunity',
  async (communityId, { rejectWithValue }) => {
    try {
      await communityAPI.deleteCommunity(communityId);
      return communityId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete community');
    }
  }
);

// Join community
export const joinCommunity = createAsyncThunk(
  'community/joinCommunity',
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await communityAPI.joinCommunity(communityId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join community');
    }
  }
);

// Leave community
export const leaveCommunity = createAsyncThunk(
  'community/leaveCommunity',
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await communityAPI.leaveCommunity(communityId);
      return { communityId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to leave community');
    }
  }
);

// Fetch channels for a community
export const fetchChannels = createAsyncThunk(
  'community/fetchChannels',
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await communityAPI.getChannels(communityId);
      return { communityId, channels: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch channels');
    }
  }
);

// Create channel
export const createChannel = createAsyncThunk(
  'community/createChannel',
  async ({ communityId, channelData }, { rejectWithValue }) => {
    try {
      const response = await communityAPI.createChannel(communityId, channelData);
      return { communityId, channel: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create channel');
    }
  }
);

// Delete channel
export const deleteChannel = createAsyncThunk(
  'community/deleteChannel',
  async ({ communityId, channelId }, { rejectWithValue }) => {
    try {
      await communityAPI.deleteChannel(communityId, channelId);
      return { communityId, channelId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete channel');
    }
  }
);

// Fetch members of a community
export const fetchMembers = createAsyncThunk(
  'community/fetchMembers',
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await communityAPI.getMembers(communityId);
      return { communityId, members: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch members');
    }
  }
);

// Update member role
export const updateMemberRole = createAsyncThunk(
  'community/updateMemberRole',
  async ({ communityId, userId, role }, { rejectWithValue }) => {
    try {
      const response = await communityAPI.updateMemberRole(communityId, userId, role);
      return { communityId, userId, role: response.data.role };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update role');
    }
  }
);

// Kick member
export const kickMember = createAsyncThunk(
  'community/kickMember',
  async ({ communityId, userId }, { rejectWithValue }) => {
    try {
      await communityAPI.kickMember(communityId, userId);
      return { communityId, userId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to kick member');
    }
  }
);

// Create invite link
export const createInvite = createAsyncThunk(
  'community/createInvite',
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await communityAPI.createInvite(communityId);
      return { communityId, invite: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create invite');
    }
  }
);

// ========================================
// INITIAL STATE
// ========================================
const initialState = {
  // Communities list
  communities: [],
  
  // Currently active community
  activeCommunity: null,
  
  // Channels organized by communityId
  channels: {},           // { communityId1: [channel1, channel2] }
  
  // Members organized by communityId
  members: {},            // { communityId1: [member1, member2] }
  
  // Currently active channel
  activeChannel: null,
  
  // Invites
  invites: {},            // { communityId1: { code: 'abc123', expires: Date } }
  
  // UI states
  loading: false,
  error: null,
  success: false,
  
  // Search/filter
  searchQuery: '',
  
  // Member roles cache
  userRoles: {},          // { communityId1: { userId1: 'admin', userId2: 'member' } }
};

// ========================================
// COMMUNITY SLICE
// ========================================
const communitySlice = createSlice({
  name: 'community',
  initialState,
  
  // Reducers - synchronous actions
  reducers: {
    // Set active community
    setActiveCommunity: (state, action) => {
      state.activeCommunity = action.payload;
    },
    
    // Set active channel
    setActiveChannel: (state, action) => {
      state.activeChannel = action.payload;
    },
    
    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    // Add member to community (when someone joins via socket)
    addMember: (state, action) => {
      const { communityId, member } = action.payload;
      if (state.members[communityId]) {
        // Check if member already exists
        const exists = state.members[communityId].some(m => m._id === member._id);
        if (!exists) {
          state.members[communityId].push(member);
        }
      }
    },
    
    // Remove member (when someone leaves)
    removeMember: (state, action) => {
      const { communityId, userId } = action.payload;
      if (state.members[communityId]) {
        state.members[communityId] = state.members[communityId].filter(
          m => m._id !== userId
        );
      }
    },
    
    // Update member online status (from socket)
    updateMemberStatus: (state, action) => {
      const { communityId, userId, online, lastSeen } = action.payload;
      
      if (state.members[communityId]) {
        const member = state.members[communityId].find(m => m._id === userId);
        if (member) {
          if (online !== undefined) member.online = online;
          if (lastSeen) member.lastSeen = lastSeen;
        }
      }
    },
    
    // Update channel list (reorder, etc.)
    updateChannels: (state, action) => {
      const { communityId, channels } = action.payload;
      state.channels[communityId] = channels;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear success
    clearSuccess: (state) => {
      state.success = false;
    },
    
    // Reset community state (logout)
    resetCommunity: (state) => {
      return initialState;
    },
  },
  
  // Extra reducers - handle async thunk actions
  extraReducers: (builder) => {
    builder
      // ===== FETCH COMMUNITIES =====
      .addCase(fetchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===== FETCH SINGLE COMMUNITY =====
      .addCase(fetchCommunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityById.fulfilled, (state, action) => {
        state.loading = false;
        state.activeCommunity = action.payload.community;
        
        // Store channels if they came with the response
        if (action.payload.channels) {
          state.channels[action.payload.community._id] = action.payload.channels;
        }
        
        // Store members if they came with the response
        if (action.payload.members) {
          state.members[action.payload.community._id] = action.payload.members;
        }
        
        // Update in communities list
        const index = state.communities.findIndex(
          c => c._id === action.payload.community._id
        );
        if (index !== -1) {
          state.communities[index] = action.payload.community;
        }
      })
      .addCase(fetchCommunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===== CREATE COMMUNITY =====
      .addCase(createCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.communities.unshift(action.payload.community);
        state.activeCommunity = action.payload.community;
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // ===== UPDATE COMMUNITY =====
      .addCase(updateCommunity.fulfilled, (state, action) => {
        const updatedCommunity = action.payload.community;
        
        // Update in communities list
        const index = state.communities.findIndex(c => c._id === updatedCommunity._id);
        if (index !== -1) {
          state.communities[index] = updatedCommunity;
        }
        
        // Update active community if it's the same
        if (state.activeCommunity && state.activeCommunity._id === updatedCommunity._id) {
          state.activeCommunity = updatedCommunity;
        }
      })
      
      // ===== DELETE COMMUNITY =====
      .addCase(deleteCommunity.fulfilled, (state, action) => {
        const communityId = action.payload;
        
        // Remove from communities list
        state.communities = state.communities.filter(c => c._id !== communityId);
        
        // Clear active community if it's the one deleted
        if (state.activeCommunity && state.activeCommunity._id === communityId) {
          state.activeCommunity = null;
          state.activeChannel = null;
        }
        
        // Clean up related data
        delete state.channels[communityId];
        delete state.members[communityId];
        delete state.userRoles[communityId];
      })
      
      // ===== JOIN COMMUNITY =====
      .addCase(joinCommunity.fulfilled, (state, action) => {
        // Add to communities list
        state.communities.unshift(action.payload.community);
        state.activeCommunity = action.payload.community;
      })
      
      // ===== LEAVE COMMUNITY =====
      .addCase(leaveCommunity.fulfilled, (state, action) => {
        const { communityId } = action.payload;
        
        // Remove from communities list
        state.communities = state.communities.filter(c => c._id !== communityId);
        
        // Clear active community if it's the one left
        if (state.activeCommunity && state.activeCommunity._id === communityId) {
          state.activeCommunity = null;
          state.activeChannel = null;
        }
        
        // Clean up related data
        delete state.channels[communityId];
        delete state.members[communityId];
        delete state.userRoles[communityId];
      })
      
      // ===== FETCH CHANNELS =====
      .addCase(fetchChannels.fulfilled, (state, action) => {
        const { communityId, channels } = action.payload;
        state.channels[communityId] = channels;
      })
      
      // ===== CREATE CHANNEL =====
      .addCase(createChannel.fulfilled, (state, action) => {
        const { communityId, channel } = action.payload;
        
        if (!state.channels[communityId]) {
          state.channels[communityId] = [];
        }
        
        state.channels[communityId].push(channel);
      })
      
      // ===== DELETE CHANNEL =====
      .addCase(deleteChannel.fulfilled, (state, action) => {
        const { communityId, channelId } = action.payload;
        
        if (state.channels[communityId]) {
          state.channels[communityId] = state.channels[communityId].filter(
            c => c._id !== channelId
          );
        }
        
        // Clear active channel if it's the one deleted
        if (state.activeChannel && state.activeChannel._id === channelId) {
          state.activeChannel = null;
        }
      })
      
      // ===== FETCH MEMBERS =====
      .addCase(fetchMembers.fulfilled, (state, action) => {
        const { communityId, members } = action.payload;
        state.members[communityId] = members;
        
        // Update user roles cache
        members.forEach(member => {
          if (!state.userRoles[communityId]) {
            state.userRoles[communityId] = {};
          }
          state.userRoles[communityId][member.userId] = member.role;
        });
      })
      
      // ===== UPDATE MEMBER ROLE =====
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        const { communityId, userId, role } = action.payload;
        
        // Update in members list
        if (state.members[communityId]) {
          const member = state.members[communityId].find(m => m.userId === userId);
          if (member) {
            member.role = role;
          }
        }
        
        // Update roles cache
        if (state.userRoles[communityId]) {
          state.userRoles[communityId][userId] = role;
        }
      })
      
      // ===== KICK MEMBER =====
      .addCase(kickMember.fulfilled, (state, action) => {
        const { communityId, userId } = action.payload;
        
        if (state.members[communityId]) {
          state.members[communityId] = state.members[communityId].filter(
            m => m.userId !== userId
          );
        }
        
        if (state.userRoles[communityId]) {
          delete state.userRoles[communityId][userId];
        }
      })
      
      // ===== CREATE INVITE =====
      .addCase(createInvite.fulfilled, (state, action) => {
        const { communityId, invite } = action.payload;
        
        if (!state.invites[communityId]) {
          state.invites[communityId] = [];
        }
        
        state.invites[communityId].push(invite);
      });
  },
});

// ========================================
// SELECTORS - Helper functions to get state
// ========================================

// Basic selectors
export const selectAllCommunities = (state) => state.community.communities;
export const selectActiveCommunity = (state) => state.community.activeCommunity;
export const selectActiveChannel = (state) => state.community.activeChannel;
export const selectCommunityLoading = (state) => state.community.loading;
export const selectCommunityError = (state) => state.community.error;
export const selectCommunitySuccess = (state) => state.community.success;
export const selectSearchQuery = (state) => state.community.searchQuery;

// Get channels for a specific community
export const selectChannelsByCommunityId = (state, communityId) => 
  state.community.channels[communityId] || [];

// Get members for a specific community
export const selectMembersByCommunityId = (state, communityId) => 
  state.community.members[communityId] || [];

// Get online members count
export const selectOnlineMembersCount = (state, communityId) => {
  const members = state.community.members[communityId] || [];
  return members.filter(m => m.online).length;
};

// Get user's role in a community
export const selectUserRole = (state, communityId, userId) => 
  state.community.userRoles[communityId]?.[userId] || 'member';

// Check if user is admin
export const selectIsAdmin = (state, communityId, userId) => {
  const role = state.community.userRoles[communityId]?.[userId];
  return role === 'admin';
};

// Check if user is moderator
export const selectIsModerator = (state, communityId, userId) => {
  const role = state.community.userRoles[communityId]?.[userId];
  return role === 'moderator' || role === 'admin';
};

// Get text channels only
export const selectTextChannels = (state, communityId) => {
  const channels = state.community.channels[communityId] || [];
  return channels.filter(c => c.type === 'text');
};

// Get voice channels only
export const selectVoiceChannels = (state, communityId) => {
  const channels = state.community.channels[communityId] || [];
  return channels.filter(c => c.type === 'voice');
};

// Get announcement channels
export const selectAnnouncementChannels = (state, communityId) => {
  const channels = state.community.channels[communityId] || [];
  return channels.filter(c => c.type === 'announcement');
};

// Get invites for a community
export const selectInvites = (state, communityId) => 
  state.community.invites[communityId] || [];

// Filter communities by search
export const selectFilteredCommunities = (state) => {
  const { communities, searchQuery } = state.community;
  
  if (!searchQuery) return communities;
  
  return communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

// ========================================
// EXPORTS
// ========================================
export const {
  setActiveCommunity,
  setActiveChannel,
  setSearchQuery,
  addMember,
  removeMember,
  updateMemberStatus,
  updateChannels,
  clearError,
  clearSuccess,
  resetCommunity,
} = communitySlice.actions;

export default communitySlice.reducer;