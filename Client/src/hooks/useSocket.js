import { useEffect, useRef } from 'react';
import { useSocketContext } from '../context/SocketContext';
import socketService from '../services/socketService';

/**
 * useSocket — access to the socket instance and helpers
 * @param {Object} options
 * @param {Object} options.events — { eventName: handler } to auto-subscribe
 */
const useSocket = (options = {}) => {
  const { socket, isConnected } = useSocketContext();
  const { events = {} } = options;
  const eventNames = useRef([]);

  useEffect(() => {
    const entries = Object.entries(events);
    if (!entries.length) return;

    entries.forEach(([event, handler]) => {
      socketService.on(event, handler);
      eventNames.current.push(event);
    });

    return () => {
      eventNames.current.forEach((event) => {
        socketService.off(event, events[event]);
      });
      eventNames.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return {
    socket,
    isConnected,
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
    ...socketService,
  };
};

export default useSocket;
export { useSocket };
