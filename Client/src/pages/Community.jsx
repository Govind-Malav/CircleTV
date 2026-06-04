import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { communityAPI } from '../services/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CHANNEL_TYPES } from '../utils/constants';

// ── Community overview/landing page ───────────────────────────────────────────
// (When no specific channel is selected, shows community home/overview)

const Community = () => {
  const { communityId } = useParams();
  const currentUser = useSelector(selectUser);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await communityAPI.getCommunity(communityId);
        setCommunity(response.data?.data || response.data);
      } catch { } finally { setLoading(false); }
    };
    if (communityId) load();
  }, [communityId]);

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (!community) return (
    <div className="flex items-center justify-center h-full text-center p-6">
      <div>
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-white mb-2">Community not found</h2>
        <p className="text-gray-400">This community may have been removed.</p>
      </div>
    </div>
  );

  // Get the first text channel to navigate to
  const firstTextChannel = community.channels?.find(c => c.type === 'text');

  return (
    <div className="flex flex-col h-full bg-gray-950 p-6">
      {/* Banner */}
      <div className="relative h-40 rounded-2xl overflow-hidden mb-6">
        {community.banner ? (
          <img src={community.banner} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-violet-900/60 to-indigo-900/60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-end gap-4">
          {community.avatar && (
            <img src={community.avatar} alt="" className="w-14 h-14 rounded-2xl border-2 border-white/20 shadow-xl" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{community.name}</h1>
            <p className="text-sm text-gray-300">{community.members?.length || 0} members</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {community.description && (
        <p className="text-gray-300 mb-6 max-w-2xl">{community.description}</p>
      )}

      {/* Channels overview */}
      <div className="max-w-2xl">
        <h2 className="text-base font-semibold text-white mb-3">Channels</h2>
        <div className="space-y-2">
          {community.channels?.map(channel => (
            <Link
              key={channel._id}
              to={`/community/${communityId}/channel/${channel._id}`}
              className="flex items-center gap-3 p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl transition-colors group"
            >
              <span className="text-gray-400 group-hover:text-violet-400 transition-colors">
                {channel.type === 'voice' ? '🔊' : '#'}
              </span>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {channel.name}
              </span>
              {channel.description && (
                <span className="text-xs text-gray-500 ml-auto truncate max-w-xs">
                  {channel.description}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Jump to first channel CTA */}
        {firstTextChannel && (
          <Link
            to={`/community/${communityId}/channel/${firstTextChannel._id}`}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors"
          >
            Jump to #general
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Community;
