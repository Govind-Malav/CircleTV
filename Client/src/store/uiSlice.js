import { createSlice } from '@reduxjs/toolkit';

// ========================================
// INITIAL STATE
// ========================================
const initialState = {
  // Sidebar state
  sidebarOpen: true,
  sidebarWidth: 240, // in pixels
  
  // Theme
  theme: 'dark', // 'dark' or 'light'
  
  // Modals
  modal: {
    isOpen: false,
    type: null, // 'upload', 'share', 'invite', 'createCommunity', etc.
    data: null, // Data to pass to modal
  },
  
  // Toast notifications
  toast: {
    show: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
    duration: 3000,
  },
  
  // Notifications center
  notifications: [],
  unreadNotifications: 0,
  
  // Loading states for specific actions
  loadingStates: {}, // { 'actionName': true/false }
  
  // Current page info
  currentPage: {
    name: '',
    params: {},
  },
  
  // Scroll positions (for preserving scroll on navigation)
  scrollPositions: {}, // { 'route': scrollY }
  
  // Responsive breakpoints
  isMobile: window.innerWidth < 768,
  isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
  isDesktop: window.innerWidth >= 1024,
  
  // Context menus
  contextMenu: {
    show: false,
    x: 0,
    y: 0,
    items: [],
    data: null,
  },
  
  // Draggable elements
  dragging: {
    isDragging: false,
    type: null,
    data: null,
  },
  
  // Recently used emojis (for chat)
  recentEmojis: ['😂', '❤️', '🔥', '👍', '😢'],
  
  // App settings
  settings: {
    autoplay: true,
    quality: 'auto',
    volume: 80,
    muted: false,
    showTimestamps: true,
    language: 'en',
  },
  
  // Error boundary
  hasError: false,
  errorInfo: null,
};

// ========================================
// UI SLICE
// ========================================
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  
  // Reducers
  reducers: {
    // ===== SIDEBAR =====
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    setSidebarWidth: (state, action) => {
      state.sidebarWidth = action.payload;
    },
    
    // ===== THEME =====
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    },
    
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    
    // ===== MODALS =====
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    
    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.data = null;
    },
    
    updateModalData: (state, action) => {
      state.modal.data = { ...state.modal.data, ...action.payload };
    },
    
    // ===== TOAST =====
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
        duration: action.payload.duration || 3000,
      };
    },
    
    hideToast: (state) => {
      state.toast.show = false;
    },
    
    // ===== NOTIFICATIONS =====
    addNotification: (state, action) => {
      const notification = {
        _id: Date.now().toString(),
        read: false,
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      
      state.notifications.unshift(notification);
      state.unreadNotifications += 1;
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications.pop();
      }
    },
    
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n._id === notificationId);
      
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadNotifications -= 1;
      }
    },
    
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadNotifications = 0;
    },
    
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n._id === notificationId);
      
      if (notification && !notification.read) {
        state.unreadNotifications -= 1;
      }
      
      state.notifications = state.notifications.filter(n => n._id !== notificationId);
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadNotifications = 0;
    },
    
    // ===== LOADING STATES =====
    setLoading: (state, action) => {
      const { key, isLoading } = action.payload;
      state.loadingStates[key] = isLoading;
    },
    
    clearLoading: (state, action) => {
      const key = action.payload;
      delete state.loadingStates[key];
    },
    
    // ===== PAGE INFO =====
    setCurrentPage: (state, action) => {
      state.currentPage = {
        name: action.payload.name,
        params: action.payload.params || {},
      };
    },
    
    // ===== SCROLL POSITIONS =====
    saveScrollPosition: (state, action) => {
      const { route, position } = action.payload;
      state.scrollPositions[route] = position;
    },
    
    getScrollPosition: (state, action) => {
      return state.scrollPositions[action.payload] || 0;
    },
    
    // ===== RESPONSIVE =====
    setDeviceInfo: (state, action) => {
      const { width } = action.payload;
      state.isMobile = width < 768;
      state.isTablet = width >= 768 && width < 1024;
      state.isDesktop = width >= 1024;
    },
    
    // ===== CONTEXT MENU =====
    showContextMenu: (state, action) => {
      state.contextMenu = {
        show: true,
        x: action.payload.x,
        y: action.payload.y,
        items: action.payload.items,
        data: action.payload.data || null,
      };
    },
    
    hideContextMenu: (state) => {
      state.contextMenu.show = false;
    },
    
    // ===== DRAGGING =====
    startDragging: (state, action) => {
      state.dragging = {
        isDragging: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    
    stopDragging: (state) => {
      state.dragging.isDragging = false;
      state.dragging.type = null;
      state.dragging.data = null;
    },
    
    // ===== EMOJIS =====
    addRecentEmoji: (state, action) => {
      const emoji = action.payload;
      
      // Remove if already exists
      state.recentEmojis = state.recentEmojis.filter(e => e !== emoji);
      
      // Add to front
      state.recentEmojis.unshift(emoji);
      
      // Keep only last 8
      if (state.recentEmojis.length > 8) {
        state.recentEmojis.pop();
      }
    },
    
    // ===== SETTINGS =====
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    
    resetSettings: (state) => {
      state.settings = initialState.settings;
      localStorage.removeItem('settings');
    },
    
    // ===== ERROR HANDLING =====
    setError: (state, action) => {
      state.hasError = true;
      state.errorInfo = action.payload;
    },
    
    clearError: (state) => {
      state.hasError = false;
      state.errorInfo = null;
    },
    
    // ===== RESET UI STATE =====
    resetUI: () => initialState,
  },
});

// ========================================
// SELECTORS - Helper functions to get state
// ========================================

// Basic selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSidebarWidth = (state) => state.ui.sidebarWidth;
export const selectTheme = (state) => state.ui.theme;
export const selectModal = (state) => state.ui.modal;
export const selectToast = (state) => state.ui.toast;
export const selectNotifications = (state) => state.ui.notifications;
export const selectUnreadNotifications = (state) => state.ui.unreadNotifications;
export const selectCurrentPage = (state) => state.ui.currentPage;
export const selectIsMobile = (state) => state.ui.isMobile;
export const selectIsTablet = (state) => state.ui.isTablet;
export const selectIsDesktop = (state) => state.ui.isDesktop;
export const selectContextMenu = (state) => state.ui.contextMenu;
export const selectDragging = (state) => state.ui.dragging;
export const selectRecentEmojis = (state) => state.ui.recentEmojis;
export const selectSettings = (state) => state.ui.settings;
export const selectHasError = (state) => state.ui.hasError;

// Get loading state for specific action
export const selectIsLoading = (state, key) => 
  state.ui.loadingStates[key] || false;

// Check if any modal is open
export const selectIsModalOpen = (state) => state.ui.modal.isOpen;

// Get modal type
export const selectModalType = (state) => state.ui.modal.type;

// Get modal data
export const selectModalData = (state) => state.ui.modal.data;

// Check if toast is showing
export const selectIsToastShowing = (state) => state.ui.toast.show;

// Get toast info
export const selectToastInfo = (state) => {
  const { show, ...info } = state.ui.toast;
  return info;
};

// Get recent unread notifications
export const selectRecentNotifications = (state, limit = 5) => 
  state.ui.notifications.slice(0, limit);

// Get unread notifications only
export const selectUnreadNotificationsList = (state) => 
  state.ui.notifications.filter(n => !n.read);

// Get setting value
export const selectSetting = (state, key) => state.ui.settings[key];

// ========================================
// EXPORTS
// ========================================
export const {
  // Sidebar
  toggleSidebar,
  setSidebarOpen,
  setSidebarWidth,
  
  // Theme
  toggleTheme,
  setTheme,
  
  // Modals
  openModal,
  closeModal,
  updateModalData,
  
  // Toast
  showToast,
  hideToast,
  
  // Notifications
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearAllNotifications,
  
  // Loading
  setLoading,
  clearLoading,
  
  // Page
  setCurrentPage,
  saveScrollPosition,
  
  // Responsive
  setDeviceInfo,
  
  // Context menu
  showContextMenu,
  hideContextMenu,
  
  // Dragging
  startDragging,
  stopDragging,
  
  // Emojis
  addRecentEmoji,
  
  // Settings
  updateSettings,
  resetSettings,
  
  // Error
  setError,
  clearError,
  
  // Reset
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;