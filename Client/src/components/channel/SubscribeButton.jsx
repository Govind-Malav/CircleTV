import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../store/authSlice';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SubscribeButton = ({ channelId, channel }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const isSubscribed = currentUser?.subscribedTo?.includes(channelId);
  const [subscribed, setSubscribed] = useState(isSubscribed);
  const [loading, setLoading] = useState(false);
  const [showBell, setShowBell] = useState(false);
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  const handleSubscribe = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Sign in to subscribe');
      navigate('/login');
      return;
    }

    // Optimistic update
    const wasSubscribed = subscribed;
    setSubscribed(!wasSubscribed);
    setLoading(true);

    try {
      if (wasSubscribed) {
        await userAPI.unsubscribe(channelId);
        toast.success(`Unsubscribed from ${channel?.username || 'channel'}`);
        setShowBell(false);
      } else {
        await userAPI.subscribe(channelId);
        toast.success(`Subscribed to ${channel?.username || 'channel'}!`);
        setShowBell(true);
      }
    } catch (err) {
      // Revert on error
      setSubscribed(wasSubscribed);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [channelId, channel, isAuthenticated, navigate, subscribed]);

  const handleBellToggle = useCallback(async () => {
    setNotifyEnabled((prev) => !prev);
    toast.success(notifyEnabled ? 'Notifications off' : 'Notifications on 🔔');
    setShowBell(false);
  }, [notifyEnabled]);

  return (
    <div className="flex items-center gap-2">
      {/* Subscribe / Subscribed button */}
      <motion.button
        id={`subscribe-btn-${channelId}`}
        onClick={handleSubscribe}
        disabled={loading}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-gray-900 ${
          subscribed
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25'
        } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        aria-label={subscribed ? 'Unsubscribe' : 'Subscribe'}
        aria-pressed={subscribed}
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : subscribed ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            Subscribed
          </>
        ) : (
          'Subscribe'
        )}
      </motion.button>

      {/* Bell notification button (shown after subscribing) */}
      <AnimatePresence>
        {subscribed && showBell && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleBellToggle}
            className={`p-2 rounded-full transition-colors focus:outline-none ${
              notifyEnabled
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
            title={notifyEnabled ? 'Turn off notifications' : 'Turn on notifications'}
            aria-label="Toggle notifications"
          >
            {notifyEnabled ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscribeButton;
