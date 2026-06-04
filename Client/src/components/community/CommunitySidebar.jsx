import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { communityAPI } from '../../services/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';

const CommunitySidebar = () => {
  const { communityId } = useParams();
  const currentUser = useSelector(selectUser);
  const [communities, setCommunities] = useState([]);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all user's communities (left icon rail)
  useEffect(() => {
    const load = async () => {
      try {
        const response = await communityAPI.getUserCommunities();
        setCommunities(response.data?.data || []);
      } catch { }
    };
    load();
  }, []);

  // Load current community details
  useEffect(() => {
    if (!communityId) { setLoading(false); return; }
    const load = async () => {
      try {
        const response = await communityAPI.getCommunity(communityId);
        setCommunity(response.data?.data || response.data);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, [communityId]);

  return (
    <div className="flex h-screen shrink-0">
      {/* ── Left icon rail (communities list) ─────────────────── */}
      <div className="w-16 bg-gray-950 border-r border-gray-800/50 flex flex-col items-center py-3 gap-2 overflow-y-auto custom-scrollbar">
        {/* Home */}
        <NavLink
          to="/"
          className="w-12 h-12 bg-gray-800 hover:bg-violet-600 text-white rounded-2xl flex items-center justify-center transition-all hover:rounded-xl mb-1"
          title="Home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </NavLink>

        <div className="w-8 h-px bg-gray-700 mb-1" />

        {/* Community icons */}
        {communities.map((c) => (
          <NavLink
            key={c._id}
            to={`/community/${c._id}`}
            title={c.name}
            className={({ isActive }) =>
              `w-12 h-12 rounded-2xl hover:rounded-xl transition-all overflow-hidden flex items-center justify-center ${
                isActive ? 'rounded-xl ring-2 ring-violet-500' : 'bg-gray-800'
              }`
            }
          >
            {c.avatar ? (
              <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-white">
                {c.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </NavLink>
        ))}

        {/* Add community */}
        <button
          className="w-12 h-12 bg-gray-800 hover:bg-green-600 text-gray-300 hover:text-white rounded-2xl hover:rounded-xl flex items-center justify-center transition-all mt-1"
          title="Create community"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* ── Right: Channel list (current community) ─────────── */}
      {communityId && community && (
        <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
          {/* Community name header */}
          <div className="px-4 py-3 border-b border-gray-800 shadow-sm">
            <h2 className="font-bold text-white truncate">{community.name}</h2>
          </div>

          {/* Channel list */}
          <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            {community.channels?.map((channel) => (
              <NavLink
                key={channel._id}
                to={`/community/${communityId}/channel/${channel._id}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 mx-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`
                }
              >
                <span className="text-gray-500">{channel.type === 'voice' ? '🔊' : '#'}</span>
                <span className="truncate">{channel.name}</span>
              </NavLink>
            ))}
          </div>

          {/* User panel */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-800 bg-gray-900">
            <img
              src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.username}&background=7C3AED&color=fff&size=32`}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.username}</p>
              <p className="text-[10px] text-green-400">Online</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitySidebar;