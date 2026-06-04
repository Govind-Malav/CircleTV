import React from 'react';
import { Link } from 'react-router-dom';
import SubscribeButton from './SubscribeButton';
import { useAuth } from '../../hooks/useAuth';

// Format large numbers: 1200000 → 1.2M
const formatCount = (num = 0) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return String(num);
};

const ChannelHeader = ({ channel }) => {
  const { user } = useAuth();
  const isOwner = user?._id === channel?.owner?._id || user?._id === channel?._id;

  if (!channel) {
    return (
      <div className="px-6 py-4 flex items-center gap-4 animate-pulse">
        <div className="w-24 h-24 rounded-full bg-gray-700 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-700 rounded w-48" />
          <div className="h-4 bg-gray-700 rounded w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={channel.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.username)}&background=7C3AED&color=fff&size=96`}
          alt={channel.username}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-violet-500/40 shadow-lg shadow-violet-500/20"
        />
        {channel.isVerified && (
          <span
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center"
            title="Verified"
          >
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </span>
        )}
      </div>

      {/* Channel info */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-white truncate flex items-center gap-2">
          {channel.username}
        </h1>

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
          <span>
            <strong className="text-white">{formatCount(channel.subscriberCount || channel.subscribers?.length || 0)}</strong> subscribers
          </span>
          <span>
            <strong className="text-white">{formatCount(channel.videoCount || 0)}</strong> videos
          </span>
        </div>

        {channel.bio && (
          <p className="mt-2 text-sm text-gray-400 line-clamp-2 max-w-xl">
            {channel.bio}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {isOwner ? (
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Manage channel
          </Link>
        ) : (
          <SubscribeButton channelId={channel._id} channel={channel} />
        )}
      </div>
    </div>
  );
};

export default ChannelHeader;
