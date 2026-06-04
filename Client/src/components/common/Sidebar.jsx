import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: 'Home',
    to: '/',
    exact: true,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    label: 'Shorts',
    to: '/shorts',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    label: 'Subscriptions',
    to: '/subscriptions',
    requireAuth: true,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'History',
    to: '/history',
    requireAuth: true,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    label: 'Playlists',
    to: '/playlist/my',
    requireAuth: true,
  },
];

const EXTRA_ITEMS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: 'Messages',
    to: '/chat',
    requireAuth: true,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Communities',
    to: '/community/browse',
    requireAuth: true,
  },
];

const SidebarItem = ({ item, collapsed }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (item.requireAuth && !isAuthenticated) return null;

  return (
    <NavLink
      to={item.to}
      end={item.exact}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
          isActive
            ? 'bg-violet-600/20 text-violet-400'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`
      }
      title={collapsed ? item.label : undefined}
    >
      <span className="shrink-0">{item.icon}</span>
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
    </NavLink>
  );
};

const Sidebar = ({ collapsed = false, mobileOpen = false, onMobileClose }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 shrink-0 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        <SidebarContent collapsed={collapsed} user={user} isAuthenticated={isAuthenticated} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 z-40 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <Link to="/" onClick={onMobileClose} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2H6v2h12v-2h-2v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zM9 9l7 3.5L9 16V9z" />
                  </svg>
                </div>
                <span className="font-bold text-white">CircleTV</span>
              </Link>
              <button
                onClick={onMobileClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent collapsed={false} user={user} isAuthenticated={isAuthenticated} onItemClick={onMobileClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarContent = ({ collapsed, user, isAuthenticated, onItemClick }) => (
  <div className="flex flex-col flex-1 overflow-y-auto py-3 px-2 custom-scrollbar gap-0.5" onClick={onItemClick}>
    {/* Main nav */}
    {NAV_ITEMS.map((item) => (
      <SidebarItem key={item.to} item={item} collapsed={collapsed} />
    ))}

    {/* Divider */}
    <div className="my-2 border-t border-gray-800" />

    {/* Extra items */}
    {EXTRA_ITEMS.map((item) => (
      <SidebarItem key={item.to} item={item} collapsed={collapsed} />
    ))}

    {/* Upload CTA */}
    {isAuthenticated && !collapsed && (
      <div className="mt-auto pt-4 border-t border-gray-800 px-1">
        <NavLink
          to="/upload"
          className="flex items-center gap-2 px-3 py-2.5 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 hover:text-violet-300 rounded-xl text-sm font-medium transition-all"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload video
        </NavLink>
      </div>
    )}
  </div>
);

export default Sidebar;
