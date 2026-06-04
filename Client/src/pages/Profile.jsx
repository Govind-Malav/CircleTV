import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { formatCount, formatRelativeTime } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SubscribeButton from '../components/channel/SubscribeButton';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';

const Profile = () => {
  const { id } = useParams();
  const currentUser = useSelector(selectUser);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isOwn = currentUser?._id === id;

  useEffect(() => {
    const load = async () => {
      try {
        const response = await userAPI.getUser(id);
        setProfile(response.data?.data || response.data);
      } catch { } finally { setLoading(false); }
    };
    if (id) load();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!profile) return <div className="text-center py-20 text-gray-400">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-violet-900/60 to-indigo-900/60 relative">
        {profile.banner && <img src={profile.banner} alt="" className="w-full h-full object-cover" />}
      </div>

      {/* Profile info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 -mt-12 mb-6">
          <img
            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.username}&background=7C3AED&color=fff&size=96`}
            alt={profile.username}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-950 shadow-xl"
          />
          <div className="flex-1 sm:pt-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
                <div className="flex gap-4 mt-1 text-sm text-gray-400">
                  <span><strong className="text-white">{formatCount(profile.subscriberCount || 0)}</strong> subscribers</span>
                  <span><strong className="text-white">{formatCount(profile.videoCount || 0)}</strong> videos</span>
                </div>
              </div>
              {isOwn ? (
                <Link to="/settings" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-full transition-colors">
                  Edit profile
                </Link>
              ) : (
                <SubscribeButton channelId={id} channel={profile} />
              )}
            </div>
            {profile.bio && <p className="mt-3 text-sm text-gray-300 max-w-2xl">{profile.bio}</p>}
          </div>
        </div>

        {/* Channel CTA */}
        <div className="pb-8">
          <Link to={`/channel/${id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/30 text-violet-400 rounded-xl text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2H6v2h12v-2h-2v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zM9 9l7 3.5L9 16V9z" />
            </svg>
            View channel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
