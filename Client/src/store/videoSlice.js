import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { videoAPI } from '../services/api';

// ASYNC THUNKS - Video API calls

// Fetch all videos (homepage feed)
export const fetchVideos = createAsyncThunk(
  'video/fetchVideos',
  async ({ page = 1, category, searchQuery } = {}, { rejectWithValue }) => {
    try {
      const params = { page, category, search: searchQuery };
      const response = await videoAPI.getAllVideos(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch videos');
    }
  }
);

// Fetch single video by ID
export const fetchVideoById = createAsyncThunk(
  'video/fetchVideoById',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getVideo(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch video');
    }
  }
);

// Upload a new video
export const uploadVideo = createAsyncThunk(
  'video/uploadVideo',
  async (videoData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append all video data to FormData
      formData.append('title', videoData.title);
      formData.append('description', videoData.description);
      formData.append('category', videoData.category);
      formData.append('privacy', videoData.privacy);
      formData.append('video', videoData.videoFile);
      
      if (videoData.thumbnail) {
        formData.append('thumbnail', videoData.thumbnail);
      }
      
      const response = await videoAPI.uploadVideo(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  }
);

// Like a video
export const likeVideo = createAsyncThunk(
  'video/likeVideo',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoAPI.likeVideo(videoId);
      return { videoId, likes: response.data.likes };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like video');
    }
  }
);

// Dislike a video
export const dislikeVideo = createAsyncThunk(
  'video/dislikeVideo',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoAPI.dislikeVideo(videoId);
      return { videoId, dislikes: response.data.dislikes };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to dislike video');
    }
  }
);

// Add comment to video
export const addComment = createAsyncThunk(
  'video/addComment',
  async ({ videoId, comment }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.addComment(videoId, comment);
      return { videoId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

// Fetch comments for a video
export const fetchComments = createAsyncThunk(
  'video/fetchComments',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getComments(videoId);
      return { videoId, comments: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

// Delete a video
export const deleteVideo = createAsyncThunk(
  'video/deleteVideo',
  async (videoId, { rejectWithValue }) => {
    try {
      await videoAPI.deleteVideo(videoId);
      return videoId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete video');
    }
  }
);

// Get recommended videos
export const fetchRecommendedVideos = createAsyncThunk(
  'video/fetchRecommended',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getRecommended(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

// INITIAL STATE
const initialState = {
  // Video lists
  videos: [],                 // Main video feed
  recommendedVideos: [],      // Sidebar recommendations
  userVideos: [],             // Videos uploaded by current user
  
  // Current video
  currentVideo: null,         // Currently playing video
  comments: [],                // Comments for current video
  
  // Pagination
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  
  // Search & filters
  searchQuery: '',
  selectedCategory: 'All',
  sortBy: 'newest',           // newest, popular, oldest
  
  // UI states
  loading: false,
  uploading: false,
  error: null,
  success: false,
  
  // Watch history
  history: [],                 // Recently watched videos
  
  // Cache for video details
  videoCache: {},              // { videoId: videoData }
};

// VIDEO SLICE
const videoSlice = createSlice({
  name: 'video',
  initialState,
  
  // Reducers - synchronous actions
  reducers: {
    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    // Set selected category
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset pagination on category change
      state.videos = []; // Clear videos for new category
    },
    
    // Set sort option
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    // Clear current video
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
      state.comments = [];
    },
    
    // Add to watch history
    addToHistory: (state, action) => {
      const video = action.payload;
      
      // Remove if already exists (to move to front)
      state.history = state.history.filter(v => v._id !== video._id);
      
      // Add to beginning
      state.history.unshift(video);
      
      // Keep only last 50 videos
      if (state.history.length > 50) {
        state.history.pop();
      }
      
      // Save to localStorage
      localStorage.setItem('watchHistory', JSON.stringify(state.history));
    },
    
    // Clear watch history
    clearHistory: (state) => {
      state.history = [];
      localStorage.removeItem('watchHistory');
    },
    
    // Load history from localStorage
    loadHistory: (state) => {
      const saved = localStorage.getItem('watchHistory');
      if (saved) {
        state.history = JSON.parse(saved);
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear success
    clearSuccess: (state) => {
      state.success = false;
    },
    
    // Reset upload state
    resetUpload: (state) => {
      state.uploading = false;
      state.success = false;
      state.error = null;
    },
    
    // Update video in cache
    updateVideoInCache: (state, action) => {
      const video = action.payload;
      if (video._id) {
        state.videoCache[video._id] = video;
      }
    },
  },
  
  // Extra reducers - handle async thunk actions
  extraReducers: (builder) => {
    builder
      // ===== FETCH VIDEOS =====
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.page === 1) {
          // New search/filter - replace videos
          state.videos = action.payload.videos;
        } else {
          // Load more - append to existing
          state.videos = [...state.videos, ...action.payload.videos];
        }
        
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===== FETCH SINGLE VIDEO =====
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload.video;
        state.comments = action.payload.comments || [];
        
        // Add to cache
        state.videoCache[action.payload.video._id] = action.payload.video;
        
        // Add to history
        const video = action.payload.video;
        state.history = state.history.filter(v => v._id !== video._id);
        state.history.unshift(video);
        if (state.history.length > 50) state.history.pop();
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===== UPLOAD VIDEO =====
      .addCase(uploadVideo.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.uploading = false;
        state.success = true;
        
        // Add to user videos
        state.userVideos.unshift(action.payload.video);
        
        // Add to main feed if public
        if (action.payload.video.privacy === 'public') {
          state.videos.unshift(action.payload.video);
        }
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // ===== LIKE VIDEO =====
      .addCase(likeVideo.fulfilled, (state, action) => {
        const { videoId, likes } = action.payload;
        
        // Update in videos array
        const videoIndex = state.videos.findIndex(v => v._id === videoId);
        if (videoIndex !== -1) {
          state.videos[videoIndex].likes = likes;
          state.videos[videoIndex].isLiked = true;
          state.videos[videoIndex].isDisliked = false;
        }
        
        // Update current video if it's the same
        if (state.currentVideo && state.currentVideo._id === videoId) {
          state.currentVideo.likes = likes;
          state.currentVideo.isLiked = true;
          state.currentVideo.isDisliked = false;
        }
      })
      
      // ===== DISLIKE VIDEO =====
      .addCase(dislikeVideo.fulfilled, (state, action) => {
        const { videoId, dislikes } = action.payload;
        
        // Update in videos array
        const videoIndex = state.videos.findIndex(v => v._id === videoId);
        if (videoIndex !== -1) {
          state.videos[videoIndex].dislikes = dislikes;
          state.videos[videoIndex].isDisliked = true;
          state.videos[videoIndex].isLiked = false;
        }
        
        // Update current video if it's the same
        if (state.currentVideo && state.currentVideo._id === videoId) {
          state.currentVideo.dislikes = dislikes;
          state.currentVideo.isDisliked = true;
          state.currentVideo.isLiked = false;
        }
      })
      
      // ===== ADD COMMENT =====
      .addCase(addComment.fulfilled, (state, action) => {
        const { videoId, comment } = action.payload;
        
        // Add to comments if it's current video
        if (state.currentVideo && state.currentVideo._id === videoId) {
          state.comments.unshift(comment);
          
          // Increment comment count
          state.currentVideo.commentCount = (state.currentVideo.commentCount || 0) + 1;
        }
      })
      
      // ===== FETCH COMMENTS =====
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { videoId, comments } = action.payload;
        
        if (state.currentVideo && state.currentVideo._id === videoId) {
          state.comments = comments;
        }
      })
      
      // ===== DELETE VIDEO =====
      .addCase(deleteVideo.fulfilled, (state, action) => {
        const videoId = action.payload;
        
        // Remove from videos array
        state.videos = state.videos.filter(v => v._id !== videoId);
        
        // Remove from user videos
        state.userVideos = state.userVideos.filter(v => v._id !== videoId);
        
        // Clear current video if it's the one deleted
        if (state.currentVideo && state.currentVideo._id === videoId) {
          state.currentVideo = null;
          state.comments = [];
        }
      })
      
      // ===== FETCH RECOMMENDATIONS =====
      .addCase(fetchRecommendedVideos.fulfilled, (state, action) => {
        state.recommendedVideos = action.payload;
      });
  },
});


// SELECTORS - Helper functions to get state
export const selectAllVideos = (state) => state.video.videos;
export const selectCurrentVideo = (state) => state.video.currentVideo;
export const selectRecommendedVideos = (state) => state.video.recommendedVideos;
export const selectVideoComments = (state) => state.video.comments;
export const selectVideoLoading = (state) => state.video.loading;
export const selectVideoUploading = (state) => state.video.uploading;
export const selectVideoError = (state) => state.video.error;
export const selectVideoSuccess = (state) => state.video.success;
export const selectSearchQuery = (state) => state.video.searchQuery;
export const selectSelectedCategory = (state) => state.video.selectedCategory;
export const selectHistory = (state) => state.video.history;
export const selectHasMore = (state) => state.video.hasMore;
export const selectCurrentPage = (state) => state.video.currentPage;

// Memoized selector for filtered videos (if needed)
export const selectFilteredVideos = (state) => {
  const { videos, searchQuery, selectedCategory, sortBy } = state.video;
  
  let filtered = [...videos];
  
  // Filter by search query
  if (searchQuery) {
    filtered = filtered.filter(v => 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channelName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Filter by category
  if (selectedCategory !== 'All') {
    filtered = filtered.filter(v => v.category === selectedCategory);
  }
  
  // Sort
  switch (sortBy) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'popular':
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    default:
      break;
  }
  
  return filtered;
};

// ========================================
// EXPORTS
// ========================================
export const {
  setSearchQuery,
  setCategory,
  setSortBy,
  clearCurrentVideo,
  addToHistory,
  clearHistory,
  loadHistory,
  clearError,
  clearSuccess,
  resetUpload,
  updateVideoInCache,
} = videoSlice.actions;

export default videoSlice.reducer;