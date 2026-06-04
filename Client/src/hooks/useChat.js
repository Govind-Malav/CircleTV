import { useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketService from '../services/socketService';

/**
 * useChat — chat state management hook
 * Connects Redux chatSlice state with socket events
 */
const useChat = () => {
  const dispatch = useDispatch();
  const chatState = useSelector((state) => state.chat);
  const [typingUsers, setTypingUsers] = useState({});
  const typingTimers = useRef({});

  const handleTypingStart = useCallback(({ chatId, userId, username }) => {
    setTypingUsers((prev) => ({
      ...prev,
      [chatId]: { ...prev[chatId], [userId]: username },
    }));

    // Auto-clear after 3s
    clearTimeout(typingTimers.current[`${chatId}-${userId}`]);
    typingTimers.current[`${chatId}-${userId}`] = setTimeout(() => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        if (updated[chatId]) {
          delete updated[chatId][userId];
          if (!Object.keys(updated[chatId]).length) delete updated[chatId];
        }
        return updated;
      });
    }, 3000);
  }, []);

  const handleTypingStop = useCallback(({ chatId, userId }) => {
    clearTimeout(typingTimers.current[`${chatId}-${userId}`]);
    setTypingUsers((prev) => {
      const updated = { ...prev };
      if (updated[chatId]) {
        delete updated[chatId][userId];
        if (!Object.keys(updated[chatId]).length) delete updated[chatId];
      }
      return updated;
    });
  }, []);

  const getTypingUsersForChat = useCallback(
    (chatId) => {
      const users = typingUsers[chatId];
      if (!users) return [];
      return Object.values(users);
    },
    [typingUsers]
  );

  return {
    ...chatState,
    typingUsers,
    getTypingUsersForChat,
    handleTypingStart,
    handleTypingStop,
  };
};

export default useChat;
export { useChat };
