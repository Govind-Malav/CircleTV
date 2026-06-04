import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../store/authSlice';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Header = ({ onMenuClick, minimal = false }) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { isDark, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const userMenuRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 h-14 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/60 flex items-center gap-3 px-4">
      {/* ── Left: Menu + Logo ──────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <Link to="/" className="flex items-center gap-2 select-none">
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2H6v2h12v-2h-2v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zM9 9l7 3.5L9 16V9z" />
            </svg>
          </div>
          <span className="hidden sm:block font-bold text-white text-lg tracking-tight">
            Circle<span className="text-violet-400">TV</span>
          </span>
        </Link>
      </div>

      {/* ── Center: Search ─────────────────────────────────────── */}
      {!minimal && (
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto hidden sm:flex">
          <div className="relative w-full">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos, channels…"
              aria-label="Search"
              className="w-full bg-gray-800/80 border border-gray-700 focus:border-violet-500 rounded-l-full pl-4 pr-10 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 rounded-r-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors border-l border-gray-600"
              aria-label="Submit search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      )}

      {/* ── Right: Actions ─────────────────────────────────────── */}
      <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
        {/* Mobile search */}
        {!minimal && (
          <button
            onClick={() => navigate('/search')}
            className="sm:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M18.364 17.657l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {isAuthenticated ? (
          <>
            {/* Upload */}
            <Link
              to="/upload"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create
            </Link>

            {/* Notifications */}
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* User avatar menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 ring-violet-500 transition-all"
                aria-label="User menu"
              >
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=7C3AED&color=fff&size=32`}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="text-sm font-semibold text-white">{user?.username}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>

                    {/* Menu items */}
                    {[
                      { label: 'Your channel', to: `/channel/${user?._id}`, icon: '📺' },
                      { label: 'Profile', to: `/profile/${user?._id}`, icon: '👤' },
                      { label: 'Settings', to: '/settings', icon: '⚙️' },
                      { label: 'Upload video', to: '/upload', icon: '📤' },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    <div className="border-t border-gray-800 mt-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-full transition-colors shadow-lg shadow-violet-500/20"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
