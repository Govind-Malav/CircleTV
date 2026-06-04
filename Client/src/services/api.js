import axios from 'axios';

// ─── Base Axios Instance ──────────────────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 30000,
});

// ─── Request Interceptor — attach Bearer token ────────────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — handle 401 / token refresh ───────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await API.post('/auth/refresh-token');
        const newToken = data.data.accessToken;
        localStorage.setItem('token', newToken);
        API.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;

// ─── AUTH API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  refreshToken: () => API.post('/auth/refresh-token'),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.post(`/auth/reset-password/${token}`, { password }),
};

// ─── USER API ─────────────────────────────────────────────────────────────────
export const userAPI = {
  getUser: (id) => API.get(`/users/${id}`),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  deleteUser: (id) => API.delete(`/users/${id}`),
  subscribe: (id) => API.post(`/users/${id}/subscribe`),
  unsubscribe: (id) => API.delete(`/users/${id}/subscribe`),
  getUserVideos: (id, params) => API.get(`/users/${id}/videos`, { params }),
  getUserPlaylists: (id) => API.get(`/users/${id}/playlists`),
  updateAvatar: (formData) => API.put('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBanner: (formData) => API.put('/users/banner', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ─── VIDEO API ────────────────────────────────────────────────────────────────
export const videoAPI = {
  getAllVideos: (params) => API.get('/videos', { params }),
  uploadVideo: (formData) => API.post('/videos', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getVideo: (id) => API.get(`/videos/${id}`),
  updateVideo: (id, data) => API.put(`/videos/${id}`, data),
  deleteVideo: (id) => API.delete(`/videos/${id}`),
  likeVideo: (id) => API.post(`/videos/${id}/like`),
  unlikeVideo: (id) => API.delete(`/videos/${id}/like`),
  dislikeVideo: (id) => API.post(`/videos/${id}/dislike`),
  getRecommended: (id) => API.get(`/videos/${id}/recommendations`),
  getTrending: () => API.get('/videos/trending'),
  getSubscriptionFeed: () => API.get('/videos/subscriptions'),
  getHistory: () => API.get('/videos/history'),
  removeFromHistory: (id) => API.delete(`/videos/history/${id}`),
  searchVideos: (q, params) => API.get('/videos/search', { params: { q, ...params } }),
  recordView: (id) => API.post(`/videos/${id}/view`),
  getShorts: (params) => API.get('/videos', { params: { isShort: true, ...params } }),
  addComment: (videoId, data) => API.post('/comments', { videoId, ...data }),
  getComments: (videoId, params) => API.get('/comments', { params: { videoId, ...params } }),
};

// ─── COMMENT API ──────────────────────────────────────────────────────────────
export const commentAPI = {
  getComments: (videoId, params) => API.get('/comments', { params: { videoId, ...params } }),
  createComment: (data) => API.post('/comments', data),
  updateComment: (id, data) => API.put(`/comments/${id}`, data),
  deleteComment: (id) => API.delete(`/comments/${id}`),
  likeComment: (id) => API.post(`/comments/${id}/like`),
  getReplies: (id) => API.get(`/comments/${id}/replies`),
};

// ─── CHAT API ─────────────────────────────────────────────────────────────────
export const chatAPI = {
  getChats: () => API.get('/chats'),
  getConversations: () => API.get('/chats'),                          // alias
  createChat: (data) => API.post('/chats', data),
  getChat: (id) => API.get(`/chats/${id}`),
  getMessages: (chatId, params) => API.get(`/chats/${chatId}/messages`, { params }),
  sendMessage: (chatId, data) => API.post(`/chats/${chatId}/messages`, data),
  deleteChat: (id) => API.delete(`/chats/${id}`),
  updateChat: (id, data) => API.put(`/chats/${id}`, data),
  addMember: (chatId, userId) => API.post(`/chats/${chatId}/members`, { userId }),
  removeMember: (chatId, userId) => API.delete(`/chats/${chatId}/members/${userId}`),
};

// ─── MESSAGE API ──────────────────────────────────────────────────────────────
export const messageAPI = {
  getMessages: (chatId, params) => API.get('/messages', { params: { chatId, ...params } }),
  sendMessage: (data) => API.post('/messages', data),
  deleteMessage: (id) => API.delete(`/messages/${id}`),
  markRead: (id) => API.put(`/messages/${id}/read`),
};

// ─── COMMUNITY API ────────────────────────────────────────────────────────────
export const communityAPI = {
  getCommunities: (params) => API.get('/communities', { params }),
  getUserCommunities: () => API.get('/communities/my'),              // current user's communities
  createCommunity: (formData) => API.post('/communities', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getCommunity: (id) => API.get(`/communities/${id}`),
  updateCommunity: (id, data) => API.put(`/communities/${id}`, data),
  deleteCommunity: (id) => API.delete(`/communities/${id}`),
  joinCommunity: (id) => API.post(`/communities/${id}/join`),
  leaveCommunity: (id) => API.delete(`/communities/${id}/leave`),
  getMembers: (id) => API.get(`/communities/${id}/members`),
  joinByInvite: (code) => API.post(`/communities/join/${code}`),
  // Channel routes
  getChannels: (communityId) => API.get(`/communities/${communityId}/channels`),
  getChannel: (communityId, channelId) => API.get(`/communities/${communityId}/channels/${channelId}`),
  createChannel: (communityId, data) => API.post(`/communities/${communityId}/channels`, data),
  updateChannel: (communityId, channelId, data) => API.put(`/communities/${communityId}/channels/${channelId}`, data),
  deleteChannel: (communityId, channelId) => API.delete(`/communities/${communityId}/channels/${channelId}`),
  getChannelMessages: (communityId, channelId, params) =>
    API.get(`/communities/${communityId}/channels/${channelId}/messages`, { params }),
  sendChannelMessage: (communityId, channelId, data) =>
    API.post(`/communities/${communityId}/channels/${channelId}/messages`, data),
};

// ─── MEMBER API ───────────────────────────────────────────────────────────────
export const memberAPI = {
  updateRole: (communityId, userId, role) =>
    API.put(`/communities/${communityId}/members/${userId}/role`, { role }),
  kickMember: (communityId, userId) => API.delete(`/communities/${communityId}/members/${userId}`),
  banMember: (communityId, userId) => API.post(`/communities/${communityId}/members/${userId}/ban`),
};

// ─── WATCH PARTY API ──────────────────────────────────────────────────────────
export const watchPartyAPI = {
  createParty: (data) => API.post('/watchparty', data),
  getParty: (id) => API.get(`/watchparty/${id}`),
  deleteParty: (id) => API.delete(`/watchparty/${id}`),
  joinParty: (id) => API.post(`/watchparty/${id}/join`),
  leaveParty: (id) => API.delete(`/watchparty/${id}/leave`),
  addToQueue: (id, videoId) => API.post(`/watchparty/${id}/queue`, { videoId }),
  removeFromQueue: (id, videoId) => API.delete(`/watchparty/${id}/queue/${videoId}`),
};

// ─── PLAYLIST API ─────────────────────────────────────────────────────────────
export const playlistAPI = {
  getPlaylists: () => API.get('/playlists'),
  createPlaylist: (data) => API.post('/playlists', data),
  getPlaylist: (id) => API.get(`/playlists/${id}`),
  updatePlaylist: (id, data) => API.put(`/playlists/${id}`, data),
  deletePlaylist: (id) => API.delete(`/playlists/${id}`),
  addVideo: (id, videoId) => API.post(`/playlists/${id}/videos`, { videoId }),
  removeVideo: (id, videoId) => API.delete(`/playlists/${id}/videos/${videoId}`),
};

// ─── NOTIFICATION API ─────────────────────────────────────────────────────────
export const notificationAPI = {
  getNotifications: () => API.get('/notifications'),
  markAllRead: () => API.put('/notifications/read-all'),
  deleteNotification: (id) => API.delete(`/notifications/${id}`),
};