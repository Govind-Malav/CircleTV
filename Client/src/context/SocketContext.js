import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/authSlice';
import socketService from '../services/socketService';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        socketRef.current = socketService.connect(token);

        socketRef.current.on('connect', () => setIsConnected(true));
        socketRef.current.on('disconnect', () => setIsConnected(false));
      }
    } else {
      socketService.disconnect();
      setIsConnected(false);
    }

    return () => {
      if (!isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated]);

  const value = {
    socket: socketRef.current,
    isConnected,
    socketService,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocketContext must be used within SocketProvider');
  return ctx;
};

export default SocketContext;
