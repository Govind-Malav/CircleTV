import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import videoReducer from './videoSlice';
import chatReducer from './chatSlice';
import communityReducer from './communitySlice';
import uiReducer from './uiSlice';

// This is the MAIN STORE - the central brain of your application
export const store = configureStore({
    // All different slices of state combined into one object
    reducer: {
        auth: authReducer,        // Handles user login, registration, profile
        video: videoReducer,       // Handles videos, uploads, watching
        chat: chatReducer,         // Handles Instagram-style messaging
        community: communityReducer, // Handles Discord-like communities
        ui: uiReducer,             // Handles UI state (sidebar, modals, theme)
    },

    // Middleware customization
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Allows non-serializable data in Redux (like Date objects)
            serializableCheck: false,

            // Ignores certain actions from serialization check
            ignoredActions: ['persist/PERSIST'],
        }),

    // Enable Redux DevTools in development
    devTools: import.meta.env.MODE !== 'production',
});

// Log the initial state in development (helpful for debugging)
if (import.meta.env.MODE === 'development') {
    console.log('Redux Store Initialized:', store.getState());
}