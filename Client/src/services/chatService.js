import { chatAPI, messageAPI } from './api';

const chatService = {
  // ── Chats ──────────────────────────────────────────────────────────────────
  getChats: async () => {
    const response = await chatAPI.getChats();
    return response.data;
  },

  createChat: async (data) => {
    const response = await chatAPI.createChat(data);
    return response.data;
  },

  getChat: async (id) => {
    const response = await chatAPI.getChat(id);
    return response.data;
  },

  deleteChat: async (id) => {
    const response = await chatAPI.deleteChat(id);
    return response.data;
  },

  updateChat: async (id, data) => {
    const response = await chatAPI.updateChat(id, data);
    return response.data;
  },

  addMember: async (chatId, userId) => {
    const response = await chatAPI.addMember(chatId, userId);
    return response.data;
  },

  removeMember: async (chatId, userId) => {
    const response = await chatAPI.removeMember(chatId, userId);
    return response.data;
  },

  // ── Messages ──────────────────────────────────────────────────────────────
  getMessages: async (chatId, params) => {
    const response = await messageAPI.getMessages(chatId, params);
    return response.data;
  },

  sendMessage: async (data) => {
    const response = await messageAPI.sendMessage(data);
    return response.data;
  },

  deleteMessage: async (id) => {
    const response = await messageAPI.deleteMessage(id);
    return response.data;
  },

  markRead: async (id) => {
    const response = await messageAPI.markRead(id);
    return response.data;
  },
};

export default chatService;
