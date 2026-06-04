import { communityAPI, memberAPI } from './api';

const communityService = {
  // ── Communities ───────────────────────────────────────────────────────────
  getCommunities: async (params) => {
    const response = await communityAPI.getCommunities(params);
    return response.data;
  },

  createCommunity: async (formData) => {
    const response = await communityAPI.createCommunity(formData);
    return response.data;
  },

  getCommunity: async (id) => {
    const response = await communityAPI.getCommunity(id);
    return response.data;
  },

  updateCommunity: async (id, data) => {
    const response = await communityAPI.updateCommunity(id, data);
    return response.data;
  },

  deleteCommunity: async (id) => {
    const response = await communityAPI.deleteCommunity(id);
    return response.data;
  },

  joinCommunity: async (id) => {
    const response = await communityAPI.joinCommunity(id);
    return response.data;
  },

  leaveCommunity: async (id) => {
    const response = await communityAPI.leaveCommunity(id);
    return response.data;
  },

  getMembers: async (id) => {
    const response = await communityAPI.getMembers(id);
    return response.data;
  },

  joinByInvite: async (code) => {
    const response = await communityAPI.joinByInvite(code);
    return response.data;
  },

  // ── Channels ──────────────────────────────────────────────────────────────
  getChannels: async (communityId) => {
    const response = await communityAPI.getChannels(communityId);
    return response.data;
  },

  createChannel: async (communityId, data) => {
    const response = await communityAPI.createChannel(communityId, data);
    return response.data;
  },

  updateChannel: async (communityId, channelId, data) => {
    const response = await communityAPI.updateChannel(communityId, channelId, data);
    return response.data;
  },

  deleteChannel: async (communityId, channelId) => {
    const response = await communityAPI.deleteChannel(communityId, channelId);
    return response.data;
  },

  getChannelMessages: async (communityId, channelId, params) => {
    const response = await communityAPI.getChannelMessages(communityId, channelId, params);
    return response.data;
  },

  sendChannelMessage: async (communityId, channelId, data) => {
    const response = await communityAPI.sendChannelMessage(communityId, channelId, data);
    return response.data;
  },

  // ── Members ───────────────────────────────────────────────────────────────
  updateRole: async (communityId, userId, role) => {
    const response = await memberAPI.updateRole(communityId, userId, role);
    return response.data;
  },

  kickMember: async (communityId, userId) => {
    const response = await memberAPI.kickMember(communityId, userId);
    return response.data;
  },

  banMember: async (communityId, userId) => {
    const response = await memberAPI.banMember(communityId, userId);
    return response.data;
  },
};

export default communityService;
