import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI } from '../services/api';
import ChannelBanner from '../components/channel/ChannelBanner';
import ChannelHeader from '../components/channel/ChannelHeader';
import ChannelTabs from '../components/channel/ChannelTabs';
import ChannelVideos from '../components/channel/ChannelVideos';
import ChannelPlaylists from '../components/channel/ChannelPlaylists';
import ChannelAbout from '../components/channel/ChannelAbout';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { AnimatePresence, motion } from 'framer-motion';

const Channel = () => {
  const { id } = useParams();
  const currentUser = useSelector(selectUser);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');

  const isOwner = currentUser?._id === id || currentUser?._id === channel?.owner?._id;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userAPI.getUser(id);
        setChannel(response.data?.data || response.data);
      } catch (err) {
        setError('Channel not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) return (
    <div className="animate-pulse">
      <div className="h-44 bg-gray-800 w-full" />
      <div className="px-6 py-4 flex gap-4">
        <div className="w-24 h-24 rounded-full bg-gray-700" />
        <div className="flex-1 space-y-2 pt-2">
          <div className="h-5 bg-gray-700 rounded w-48" />
          <div className="h-4 bg-gray-700 rounded w-32" />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px] text-center">
      <div>
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-white mb-2">{error}</h2>
        <p className="text-gray-400">This channel doesn't exist or may have been removed.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-950 min-h-screen">
      <ChannelBanner channel={channel} />
      <div className="bg-gray-900/50 border-b border-gray-800">
        <ChannelHeader channel={channel} />
        <ChannelTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'videos' && <ChannelVideos channelId={id} isOwner={isOwner} />}
          {activeTab === 'shorts' && <ChannelVideos channelId={id} isOwner={isOwner} shortsOnly />}
          {activeTab === 'playlists' && <ChannelPlaylists channelId={id} isOwner={isOwner} />}
          {activeTab === 'about' && <ChannelAbout channel={channel} channelId={id} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Channel;
