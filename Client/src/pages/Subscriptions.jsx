import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, videoAPI } from '../services/api';
import { formatViews, formatRelativeTime, formatDuration } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Subscriptions = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await videoAPI.getSubscriptionFeed();
        setVideos(response.data?.data || []);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  if (!videos.length) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center p-6">
      <div className="text-6xl mb-4">📺</div>
      <h2 className="text-xl font-bold text-white mb-2">No videos yet</h2>
      <p className="text-gray-400 mb-6">Subscribe to channels to see their latest content here</p>
      <Link to="/" className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-full transition-colors">Explore videos</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <h1 className="text-xl font-bold text-white mb-6">Subscriptions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {videos.map(video => (
          <Link key={video._id} to={`/watch/${video._id}`} className="group block">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 mb-3">
              <img src={video.thumbnail} alt={video.title} loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {video.duration && <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">{formatDuration(video.duration)}</span>}
            </div>
            <div className="flex gap-3">
              <Link to={`/channel/${video.uploader?._id}`}>
                <img src={video.uploader?.avatar || `https://ui-avatars.com/api/?name=${video.uploader?.username}&background=7C3AED&color=fff&size=36`}
                  alt="" className="w-9 h-9 rounded-full" />
              </Link>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-violet-400 transition-colors">{video.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{video.uploader?.username}</p>
                <p className="text-xs text-gray-500">{formatViews(video.views)} · {formatRelativeTime(video.createdAt)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
