import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/index';
import { checkAuthStatus } from './store/authSlice';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes';
import ErrorBoundary from './components/common/ErrorBoundary';

// ── Inner App (has access to Redux store) ─────────────────────────────────────
const AppContent = () => {
  useEffect(() => {
    // Check if user has a valid session on load
    store.dispatch(checkAuthStatus());
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
              {/* Global toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1e1e2e',
                    color: '#cdd6f4',
                    border: '1px solid #313244',
                    borderRadius: '12px',
                    fontSize: '14px',
                  },
                  success: {
                    iconTheme: { primary: '#a6e3a1', secondary: '#1e1e2e' },
                  },
                  error: {
                    iconTheme: { primary: '#f38ba8', secondary: '#1e1e2e' },
                  },
                }}
              />
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

// ── Root App ──────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
