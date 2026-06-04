import { videoAPI, commentAPI } from './api';

const videoService = {
  // ── Videos ────────────────────────────────────────────────────────────────
  getAllVideos: async (params) => {
    const response = await videoAPI.getAllVideos(params);
    return response.data;
  },

  uploadVideo: async (formData) => {
    const response = await videoAPI.uploadVideo(formData);
    return response.data;
  },

  getVideo: async (id) => {
    const response = await videoAPI.getVideo(id);
    return response.data;
  },

  updateVideo: async (id, data) => {
    const response = await videoAPI.updateVideo(id, data);
    return response.data;
  },

  deleteVideo: async (id) => {
    const response = await videoAPI.deleteVideo(id);
    return response.data;
  },

  likeVideo: async (id) => {
    const response = await videoAPI.likeVideo(id);
    return response.data;
  },

  unlikeVideo: async (id) => {
    const response = await videoAPI.unlikeVideo(id);
    return response.data;
  },

  dislikeVideo: async (id) => {
    const response = await videoAPI.dislikeVideo(id);
    return response.data;
  },

  getRecommended: async (id) => {
    const response = await videoAPI.getRecommended(id);
    return response.data;
  },

  getTrending: async () => {
    const response = await videoAPI.getTrending();
    return response.data;
  },

  getSubscriptionFeed: async () => {
    const response = await videoAPI.getSubscriptionFeed();
    return response.data;
  },

  getHistory: async () => {
    const response = await videoAPI.getHistory();
    return response.data;
  },

  removeFromHistory: async (id) => {
    const response = await videoAPI.removeFromHistory(id);
    return response.data;
  },

  searchVideos: async (q, params) => {
    const response = await videoAPI.searchVideos(q, params);
    return response.data;
  },

  recordView: async (id) => {
    const response = await videoAPI.recordView(id);
    return response.data;
  },

  // ── Comments ──────────────────────────────────────────────────────────────
  getComments: async (videoId, params) => {
    const response = await commentAPI.getComments(videoId, params);
    return response.data;
  },

  createComment: async (data) => {
    const response = await commentAPI.createComment(data);
    return response.data;
  },

  updateComment: async (id, data) => {
    const response = await commentAPI.updateComment(id, data);
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await commentAPI.deleteComment(id);
    return response.data;
  },

  likeComment: async (id) => {
    const response = await commentAPI.likeComment(id);
    return response.data;
  },

  getReplies: async (id) => {
    const response = await commentAPI.getReplies(id);
    return response.data;
  },
};

export default videoService;
