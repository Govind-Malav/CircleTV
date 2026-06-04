import { watchPartyAPI } from './api';

const watchPartyService = {
  createParty: async (data) => {
    const response = await watchPartyAPI.createParty(data);
    return response.data;
  },

  getParty: async (id) => {
    const response = await watchPartyAPI.getParty(id);
    return response.data;
  },

  deleteParty: async (id) => {
    const response = await watchPartyAPI.deleteParty(id);
    return response.data;
  },

  joinParty: async (id) => {
    const response = await watchPartyAPI.joinParty(id);
    return response.data;
  },

  leaveParty: async (id) => {
    const response = await watchPartyAPI.leaveParty(id);
    return response.data;
  },

  addToQueue: async (id, videoId) => {
    const response = await watchPartyAPI.addToQueue(id, videoId);
    return response.data;
  },

  removeFromQueue: async (id, videoId) => {
    const response = await watchPartyAPI.removeFromQueue(id, videoId);
    return response.data;
  },
};

export default watchPartyService;
