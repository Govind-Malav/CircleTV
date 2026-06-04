import React from 'react';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'videos',     label: 'Videos' },
  { id: 'shorts',     label: 'Shorts' },
  { id: 'playlists',  label: 'Playlists' },
  { id: 'about',      label: 'About' },
];

const ChannelTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-800 px-4 sm:px-6">
      <nav
        className="flex gap-1 overflow-x-auto hide-scrollbar"
        role="tablist"
        aria-label="Channel sections"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}

              {/* Animated underline */}
              {isActive && (
                <motion.div
                  layoutId="channel-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ChannelTabs;
